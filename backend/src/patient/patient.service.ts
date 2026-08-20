import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { formatPrescriptionId } from '../prescription-id';
import { allocatePatientId, isFormattedPatientId } from '../patient-id';

@Injectable()
export class PatientService {
  constructor(
    private db: MysqlService,
    private redisService: RedisService,
  ) {}

  private async ensureFormattedPatientId(patient: any) {
    if (!patient || isFormattedPatientId(patient.id)) return patient;
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const registeredAt = new Date(
        patient.createdAt || patient.updatedAt || Date.now(),
      );
      const newId = await allocatePatientId(
        connection,
        patient.name,
        registeredAt,
      );
      const referenceTables = [
        'accessrequest',
        'appointment',
        'invoice',
        'medicalrecord',
        'prescription',
        'sample',
        'testrequest',
      ];
      // Update the parent first so MySQL can apply each foreign key's
      // ON UPDATE CASCADE rule. Updating children to an ID that does not yet
      // exist violates their patient foreign keys.
      await connection.execute('UPDATE patient SET id = ? WHERE id = ?', [
        newId,
        patient.id,
      ]);

      // Keep legacy/non-constrained references in sync as well. Rows covered
      // by cascading foreign keys have already moved and are harmlessly
      // skipped by these updates.
      for (const table of referenceTables) {
        await connection.execute(
          `UPDATE \`${table}\` SET patientId = ? WHERE patientId = ?`,
          [newId, patient.id],
        );
      }
      await connection.execute(
        'UPDATE setting SET `key` = REPLACE(`key`, ?, ?) WHERE `key` = ?',
        [patient.id, newId, `profile.logo.patient.${patient.id}`],
      );
      await connection.execute(
        'UPDATE notification SET type = REPLACE(type, ?, ?) WHERE type LIKE ?',
        [patient.id, newId, `%${patient.id}%`],
      );
      await connection.commit();
      await this.redisService.delPattern('patient:*');
      await this.redisService.delPattern('hospital:*');
      await this.redisService.delPattern('laboratory:*');
      return { ...patient, id: newId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getOverview(userEmail: string) {
    const cacheKey = `patient:overview:v2:${userEmail}`;
    let patient = await this.db.queryOne(
      'SELECT * FROM patient WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [userEmail],
    );

    if (!patient) {
      const user = await this.db.queryOne(
        'SELECT * FROM user WHERE email = ?',
        [userEmail],
      );
      const connection = await this.db.getPool().getConnection();
      const now = new Date();
      let newId = '';
      try {
        await connection.beginTransaction();
        newId = await allocatePatientId(
          connection,
          user ? user.name : 'Unknown',
          now,
        );
        await connection.execute(
          'INSERT INTO patient (id, email, name, phone, bloodGroup, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
          [newId, userEmail, user ? user.name : 'Unknown', '', 'Unknown', now],
        );
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      patient = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [
        newId,
      ]);
    }
    patient = await this.ensureFormattedPatientId(patient);

    const appointments = await this.db.query(
      `
      SELECT a.*, d.name as doctorName, d.specialization as doctorSpecialization, h.name as hospitalName 
      FROM appointment a
      LEFT JOIN doctor d ON a.doctorId = d.id
      LEFT JOIN hospital h ON a.hospitalId = h.id
      WHERE a.patientId = ?
      ORDER BY a.dateTime DESC LIMIT 5
    `,
      [patient.id],
    );

    const records = await this.db.query(
      'SELECT * FROM medicalrecord WHERE patientId = ? ORDER BY date DESC LIMIT 5',
      [patient.id],
    );
    const providerStats = await this.db.queryOne(
      `SELECT
         COUNT(DISTINCT CASE
           WHEN UPPER(TRIM(COALESCE(h.type, ''))) = 'HOSPITAL' THEN connections.facilityId
         END) AS connectedHospitals,
         COUNT(DISTINCT CASE
           WHEN UPPER(TRIM(COALESCE(h.type, ''))) = 'CLINIC' THEN connections.facilityId
         END) AS connectedClinics,
         COUNT(DISTINCT CASE
           WHEN UPPER(TRIM(COALESCE(h.type, ''))) LIKE '%LAB%' THEN connections.facilityId
         END) AS connectedLabs,
         (
           SELECT COUNT(DISTINCT approved.hospitalId)
           FROM accessrequest approved
           WHERE approved.patientId = ?
             AND approved.hospitalId IS NOT NULL
             AND UPPER(TRIM(COALESCE(approved.status, ''))) = 'APPROVED'
         ) AS accessGranted
       FROM (
         SELECT ar.hospitalId AS facilityId
         FROM accessrequest ar
         WHERE ar.patientId = ?
           AND ar.hospitalId IS NOT NULL
           AND UPPER(TRIM(COALESCE(ar.status, ''))) = 'APPROVED'

         UNION ALL

         SELECT mr.hospitalId AS facilityId
         FROM medicalrecord mr
         WHERE mr.patientId = ?
           AND mr.hospitalId IS NOT NULL

         UNION ALL

         SELECT pr.hospitalId AS facilityId
         FROM prescription pr
         WHERE pr.patientId = ?
           AND pr.hospitalId IS NOT NULL

         UNION ALL

         SELECT ap.hospitalId AS facilityId
         FROM appointment ap
         WHERE ap.patientId = ?
           AND ap.hospitalId IS NOT NULL
           AND ap.deletedAt IS NULL

         UNION ALL

         SELECT tr.hospitalId AS facilityId
         FROM testrequest tr
         WHERE tr.patientId = ?
           AND tr.hospitalId IS NOT NULL

         UNION ALL

         SELECT tr.referringHospitalId AS facilityId
         FROM testrequest tr
         WHERE tr.patientId = ?
           AND tr.referringHospitalId IS NOT NULL

         UNION ALL

         SELECT bi.facilityId
         FROM billing_invoice bi
         WHERE bi.patientId = ?
           AND bi.facilityId IS NOT NULL
       ) connections
       INNER JOIN hospital h ON h.id = connections.facilityId`,
      Array(8).fill(patient.id),
    );

    let age = 'N/A';
    if (patient.dateOfBirth) {
      const dob = new Date(patient.dateOfBirth);
      const diff = Date.now() - dob.getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
    }

    let lastVisitStr = 'No visits yet';
    const lastAppointment = appointments.find((a) => a.status === 'COMPLETED');
    if (lastAppointment) {
      lastVisitStr = new Date(lastAppointment.dateTime).toLocaleDateString(
        'en-GB',
        { day: '2-digit', month: 'short', year: 'numeric' },
      );
    } else if (records.length > 0) {
      lastVisitStr = new Date(records[0].date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    const timelineEvents: any[] = [];
    appointments.forEach((apt) => {
      const d = new Date(apt.dateTime);
      timelineEvents.push({
        id: 'apt-' + apt.id,
        date: d,
        dateStr: d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        title: `${apt.doctorSpecialization || 'General'} Consultation`,
        desc: apt.notes || `Appointment at ${apt.hospitalName || 'Hospital'}`,
        type: 'APPOINTMENT',
      });
    });

    records.forEach((rec) => {
      const d = new Date(rec.date);
      timelineEvents.push({
        id: 'rec-' + rec.id,
        date: d,
        dateStr: d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        title:
          String(rec.type).toUpperCase() === 'PRESCRIPTION'
            ? formatPrescriptionId(rec.title || rec.id)
            : rec.title,
        desc: rec.description || rec.type,
        type: 'RECORD',
      });
    });

    timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
    const recentTimeline = timelineEvents.slice(0, 4);

    // Extract recent highlights and vitals from medical records
    const recentHighlights = records
      .filter((r) => r.type === 'LAB_REPORT')
      .slice(0, 2)
      .map((r) => ({
        name: r.title,
        status: r.status || 'Available',
        value: 'Open report',
      }));

    // Find BP from descriptions or default to N/A
    let bloodPressure = 'N/A';
    const bpRecord = records.find(
      (r) => r.description && r.description.match(/\b\d{2,3}\/\d{2,3}\b/),
    );
    if (bpRecord) {
      const match = bpRecord.description.match(/\b(\d{2,3}\/\d{2,3})\b/);
      if (match) bloodPressure = match[1];
    }

    const result = {
      patientInfo: {
        id: patient.id,
        name: patient.name,
        age: age,
        bloodGroup: patient.bloodGroup || 'Not Specified',
        lastVisit: lastVisitStr,
        gender: patient.gender || 'Not Specified',
      },
      vitals: {
        bloodPressure: bloodPressure,
      },
      providerStats: {
        connectedHospitals: Number(providerStats?.connectedHospitals || 0),
        connectedClinics: Number(providerStats?.connectedClinics || 0),
        connectedLabs: Number(providerStats?.connectedLabs || 0),
        accessGranted: Number(providerStats?.accessGranted || 0),
      },
      recentHighlights: recentHighlights,
      timeline: recentTimeline,
      testResultsStats: {
        completed: records.filter((r) => r.type === 'LAB_REPORT').length,
        pending: appointments.filter((a) => a.status === 'SCHEDULED').length,
        abnormal: records.filter(
          (r) => String(r.status || '').toUpperCase() === 'ABNORMAL',
        ).length,
      },
      recentReports: records.slice(0, 3).map((r) => ({
        id: r.id,
        name:
          String(r.type).toUpperCase() === 'PRESCRIPTION'
            ? formatPrescriptionId(r.title || r.id)
            : r.title,
        date: new Date(r.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        type: r.type,
        size: r.fileSize
          ? `${(Number(r.fileSize) / 1048576).toFixed(1)} MB`
          : 'Stored securely',
      })),
    };

    await this.redisService.set(cacheKey, result, 300); // 5 mins
    return result;
  }

  async getAppointments(userEmail: string) {
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) return [];

    return this.db.query(
      `
      SELECT
        a.id,
        a.dateTime AS appointment_date,
        LOWER(a.status) AS status,
        a.notes,
        d.name AS doctor_name,
        COALESCE(d.department, d.specialization, 'General medicine') AS department,
        h.name AS hospital_name
      FROM appointment a
      INNER JOIN doctor d ON d.id = a.doctorId
      INNER JOIN hospital h ON h.id = a.hospitalId
      WHERE a.patientId = ?
      ORDER BY a.dateTime DESC
    `,
      [patient.id],
    );
  }

  async getAppointmentProviders() {
    return this.db.query(`
      SELECT
        d.id AS doctorId,
        d.name AS doctorName,
        COALESCE(d.department, d.specialization, 'General medicine') AS department,
        h.id AS hospitalId,
        h.name AS hospitalName
      FROM doctor d
      INNER JOIN hospital h ON h.id = d.hospitalId
      WHERE UPPER(COALESCE(d.status, 'ACTIVE')) = 'ACTIVE'
        AND UPPER(COALESCE(h.status, 'ACTIVE')) = 'ACTIVE'
      ORDER BY h.name, d.name
    `);
  }

  async createAppointment(userEmail: string, data: any) {
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient)
      throw new NotFoundException(
        'Patient profile not found. Complete your profile first.',
      );

    const dateTime = new Date(data.dateTime);
    if (
      !data.doctorId ||
      !data.hospitalId ||
      Number.isNaN(dateTime.getTime())
    ) {
      throw new BadRequestException(
        'Doctor, facility, and a valid appointment time are required.',
      );
    }
    if (dateTime.getTime() <= Date.now()) {
      throw new BadRequestException('Appointment time must be in the future.');
    }

    const provider = await this.db.queryOne(
      'SELECT id FROM doctor WHERE id = ? AND hospitalId = ? AND UPPER(COALESCE(status, "ACTIVE")) = "ACTIVE"',
      [data.doctorId, data.hospitalId],
    );
    if (!provider)
      throw new BadRequestException(
        'The selected provider is not available at this facility.',
      );

    const id = uuidv4();
    const now = new Date();
    await this.db.query(
      'INSERT INTO appointment (id, patientId, doctorId, hospitalId, dateTime, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        patient.id,
        data.doctorId,
        data.hospitalId,
        dateTime,
        'SCHEDULED',
        String(data.notes || '').trim() || null,
        now,
        now,
      ],
    );
    await this.redisService.del(`patient:overview:v2:${userEmail}`);
    return { id, message: 'Appointment booked successfully.' };
  }

  async updateAppointmentStatus(userEmail: string, id: string, status: string) {
    const normalizedStatus = String(status || '').toUpperCase();
    if (!['APPROVED', 'REJECTED', 'REVOKED'].includes(normalizedStatus)) {
      throw new BadRequestException('Invalid access request action.');
    }
    if (normalizedStatus !== 'CANCELLED') {
      throw new BadRequestException(
        'Patients may only cancel scheduled appointments.',
      );
    }

    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const appointment = await this.db.queryOne(
      'SELECT id, status FROM appointment WHERE id = ? AND patientId = ?',
      [id, patient.id],
    );
    if (!appointment) throw new NotFoundException('Appointment not found.');
    if (String(appointment.status).toUpperCase() !== 'SCHEDULED') {
      throw new BadRequestException(
        'Only scheduled appointments can be cancelled.',
      );
    }

    await this.db.query(
      'UPDATE appointment SET status = ?, updatedAt = ? WHERE id = ?',
      ['CANCELLED', new Date(), id],
    );
    await this.redisService.del(`patient:overview:v2:${userEmail}`);
    return { message: 'Appointment cancelled.' };
  }

  async getRecords(userEmail: string) {
    const cacheKey = `patient:records:v2:${userEmail}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) return { myUploads: [] };

    const records = await this.db.query(
      `
      SELECT m.*, h.name as hospitalName, h.type as hospitalType 
      FROM medicalrecord m
      LEFT JOIN hospital h ON m.hospitalId = h.id
      WHERE m.patientId = ?
        AND UPPER(COALESCE(m.type, '')) <> 'PRESCRIPTION'
      ORDER BY m.date DESC
    `,
      [patient.id],
    );

    const formattedRecords = records.map((r) => {
      let fileType = 'pdf';
      if (
        r.fileUrl &&
        (r.fileUrl.endsWith('.jpg') || r.fileUrl.endsWith('.png'))
      ) {
        fileType = 'jpg';
      }

      let typeColor = 'text-slate-600 bg-slate-50';
      if (r.type === 'LAB_REPORT' || r.type === 'Blood Test')
        typeColor = 'text-red-600 bg-red-50';
      else if (r.type?.toUpperCase() === 'PRESCRIPTION')
        typeColor = 'text-emerald-600 bg-emerald-50';
      else if (r.type === 'XRAY' || r.type === 'X-Ray')
        typeColor = 'text-cyan-600 bg-cyan-50';

      return {
        id: r.id,
        fileName: r.title,
        type: r.type,
        uploadDate: new Date(r.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        size: '1.5 MB',
        fileType: fileType,
        typeColor: typeColor,
        fileUrl: r.fileUrl,
        hospitalName: r.hospitalName || 'Uploaded by Patient',
        hospitalType: r.hospitalType || null,
      };
    });

    const result = { myUploads: formattedRecords };
    await this.redisService.set(cacheKey, result, 300); // 5 mins
    return result;
  }

  async uploadRecord(userEmail: string, file: any, body: any) {
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) throw new Error('Patient not found');

    const newId = uuidv4();
    const now = new Date();
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, title, type, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        newId,
        patient.id,
        body.reportName || file.originalname,
        body.reportType || 'DOCUMENT',
        file.filename,
        now,
        now,
      ],
    );

    // Invalidate patient cache
    await this.redisService.del(`patient:overview:v2:${userEmail}`);
    await this.redisService.del(`patient:records:${userEmail}`);

    return { id: newId };
  }

  async getProfile(userEmail: string) {
    const cacheKey = `patient:profile:${userEmail}`;
    let patient = await this.db.queryOne(
      'SELECT * FROM patient WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [userEmail],
    );
    if (!patient) {
      return {
        name: '',
        email: userEmail,
        phone: '',
        dateOfBirth: '',
        bloodGroup: '',
        gender: '',
        address: '',
      };
    }
    patient = await this.ensureFormattedPatientId(patient);

    const result = {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
        : '',
      bloodGroup: patient.bloodGroup,
      gender: patient.gender,
      address: patient.address || '',
      logoUrl:
        (
          await this.db.queryOne('SELECT value FROM setting WHERE `key` = ?', [
            `profile.logo.patient.${patient.id}`,
          ])
        )?.value || '',
    };
    await this.redisService.set(cacheKey, result, 600); // 10 mins
    return result;
  }

  async updateProfile(userEmail: string, data: any) {
    let dob: Date | null = null;
    if (data.dateOfBirth) {
      const parsed = new Date(data.dateOfBirth);
      if (!isNaN(parsed.getTime())) {
        dob = parsed;
      }
    }

    let patient = await this.db.queryOne(
      'SELECT * FROM patient WHERE email = ?',
      [userEmail],
    );

    const nameVal = String(data.name || '').trim();
    const phoneVal = String(data.phone || '').trim();
    const bloodGroupVal = String(data.bloodGroup || '').trim();
    const genderVal = String(data.gender || '').trim();
    const addressVal = String(data.address || '').trim() || null;

    if (patient) {
      patient = await this.ensureFormattedPatientId(patient);
      await this.db.query(
        'UPDATE patient SET name = ?, phone = ?, bloodGroup = ?, gender = ?, dateOfBirth = ?, address = ?, updatedAt = NOW(3) WHERE id = ?',
        [nameVal || patient.name, phoneVal, bloodGroupVal, genderVal, dob, addressVal, patient.id],
      );
      if (nameVal) {
        await this.db.query('UPDATE user SET name = ? WHERE email = ?', [
          nameVal,
          userEmail,
        ]);
      }
    } else {
      const connection = await this.db.getPool().getConnection();
      const now = new Date();
      let newId = '';
      try {
        await connection.beginTransaction();
        newId = await allocatePatientId(connection, nameVal || 'Patient', now);
        await connection.execute(
          'INSERT INTO patient (id, email, name, phone, bloodGroup, gender, dateOfBirth, address, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            newId,
            userEmail,
            nameVal || 'Patient',
            phoneVal,
            bloodGroupVal,
            genderVal,
            dob,
            addressVal,
            now,
          ],
        );
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      patient = { id: newId };
    }

    // Invalidate caches
    await this.redisService.del(`patient:profile:${userEmail}`);
    await this.redisService.del(`patient:overview:v2:${userEmail}`);

    return this.getProfile(userEmail);
  }

  async uploadProfileLogo(userEmail: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Select an image to upload.');
    if (!file.mimetype?.startsWith('image/'))
      throw new BadRequestException('Profile image must be an image file.');
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const logoUrl = `/uploads/${file.filename}`;
    await this.db.query(
      'INSERT INTO setting (`key`, value, updatedAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updatedAt = VALUES(updatedAt)',
      [`profile.logo.patient.${patient.id}`, logoUrl, new Date()],
    );
    await this.redisService.del(`patient:profile:${userEmail}`);
    return { logoUrl };
  }

  async getPrescriptions(userEmail: string) {
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) return [];

    const records = await this.db.query(
      `
      SELECT m.*, h.name as hospitalName, h.type as hospitalType 
      FROM medicalrecord m
      LEFT JOIN hospital h ON m.hospitalId = h.id
      WHERE m.patientId = ? AND UPPER(COALESCE(m.type, '')) = 'PRESCRIPTION'
      ORDER BY m.date DESC
    `,
      [patient.id],
    );

    const formattedRecords = records.map((r) => ({
      id: formatPrescriptionId(r.title || r.id),
      doctor: r.description || 'Unknown Doctor',
      date: new Date(r.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Active',
      hospitalName: r.hospitalName || null,
      hospitalType: r.hospitalType || null,
      fileUrl: r.fileUrl || null,
    }));

    const doctorPrescriptions = await this.db.query(
      `
      SELECT p.*, h.name as hospitalName, h.type as hospitalType, d.name as doctorName, sfp.storedFileId as imageFileId
      FROM prescription p
      LEFT JOIN hospital h ON p.hospitalId = h.id
      LEFT JOIN doctor d ON p.doctorId = d.id
      LEFT JOIN stored_file_prescription sfp ON p.id = sfp.prescriptionId
      WHERE p.patientId = ?
      ORDER BY p.createdAt DESC
    `,
      [patient.id],
    );

    const formattedDoctorPrescriptions = doctorPrescriptions.map((p) => ({
      id: formatPrescriptionId(p.id),
      rawId: p.id,
      doctor: p.doctorName
        ? `Dr. ${p.doctorName.replace(/^(Dr\.?\s*)+/i, '')}`
        : 'Unknown Doctor',
      date: new Date(p.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: p.status || 'Active',
      hospitalName: p.hospitalName || null,
      hospitalType: p.hospitalType || null,
      medicine: p.medicine,
      dosage: p.dosage,
      duration: p.duration,
      fileUrl: p.imageFileId
        ? `/api/patient/prescriptions/${encodeURIComponent(p.id)}/image`
        : p.fileUrl || null,
    }));

    const allPrescriptions = [
      ...formattedRecords,
      ...formattedDoctorPrescriptions,
    ];
    allPrescriptions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return allPrescriptions;
  }

  async createPrescription(
    userEmail: string,
    data: any,
    file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Prescription image is required.');
    if (!String(data.doctor || '').trim())
      throw new BadRequestException('Doctor name is required.');
    if (!data.date)
      throw new BadRequestException('Prescription date is required.');
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) throw new Error('Patient not found');

    const newId = uuidv4();
    const prescriptionId = await this.allocatePrescriptionId();
    const d = data.date ? new Date(data.date) : new Date();
    const fileUrl = `/uploads/${file.filename}`;
    await this.db.query(
      "INSERT INTO medicalrecord (id, patientId, type, title, description, fileUrl, date, updatedAt) VALUES (?, ?, 'PRESCRIPTION', ?, ?, ?, ?, ?)",
      [newId, patient.id, prescriptionId, data.doctor, fileUrl, d, new Date()],
    );

    return {
      id: prescriptionId,
      doctor: data.doctor,
      date: d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Active',
      fileUrl,
    };
  }

  private async allocatePrescriptionId(): Promise<string> {
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const [rows]: any = await connection.execute(
        `SELECT nextValue FROM prescription_id_sequence
         WHERE sequenceName = 'prescription' FOR UPDATE`,
      );
      if (!rows.length)
        throw new Error('Prescription ID sequence is not initialized.');

      const nextValue = Number(rows[0].nextValue);
      if (nextValue > 99999)
        throw new Error('Prescription ID range is exhausted.');
      const prescriptionId = `RX${String(nextValue).padStart(5, '0')}`;
      await connection.execute(
        `UPDATE prescription_id_sequence SET nextValue = ?, updatedAt = ?
         WHERE sequenceName = 'prescription'`,
        [nextValue + 1, new Date()],
      );
      await connection.commit();
      return prescriptionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getPrescriptionImage(email: string, id: string) {
    const patient = await this.db.queryOne(
      'SELECT id FROM patient WHERE email = ?',
      [email],
    );
    if (!patient) throw new UnauthorizedException('Patient not found');

    const result = await this.db.queryOne(
      `SELECT sf.content, sf.mimeType, sf.fileName, sf.sizeBytes
       FROM stored_file_prescription sfp
       JOIN stored_file sf ON sfp.storedFileId = sf.id
       JOIN prescription p ON sfp.prescriptionId = p.id
       WHERE p.id = ? AND p.patientId = ?`,
      [id, patient.id],
    );

    if (!result || !result.content) {
      throw new NotFoundException('Prescription image not found');
    }

    return result;
  }

  async getAccessRequests(userEmail: string) {
    const patient = await this.db.queryOne(
      'SELECT id, name FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) return [];

    await this.db.query(
      `UPDATE accessrequest
       SET status = 'EXPIRED'
       WHERE patientId = ? AND status = 'APPROVED'
         AND (
           ((duration IS NULL OR duration = '' OR duration = '24 Hours') AND (updatedAt IS NULL OR updatedAt <= DATE_SUB(NOW(), INTERVAL 24 HOUR)))
           OR (duration = '7 Days' AND (updatedAt IS NULL OR updatedAt <= DATE_SUB(NOW(), INTERVAL 7 DAY)))
         )`,
      [patient.id],
    );

    const requests = await this.db.query(
      `
      SELECT r.*, h.name as hospitalName, d.name as doctorName
      FROM accessrequest r
      LEFT JOIN hospital h ON r.hospitalId = h.id
      LEFT JOIN doctor d ON r.doctorId = d.id
      WHERE r.patientId = ?
      ORDER BY r.requestDate DESC
    `,
      [patient.id],
    );

    return Promise.all(requests.map(async (req: any) => {
      const requestedTypes = String(req.reportTypes || '')
        .split(',').map(type => type.trim().toLowerCase()).filter(Boolean);
      const allReports = requestedTypes.includes('all reports');
      let eligibleReports = await this.db.query<any>(
        `SELECT id, title, type, date, fileUrl FROM medicalrecord
         WHERE patientId = ? ORDER BY COALESCE(date, createdAt) DESC`,
        [patient.id],
      );
      if (!allReports) {
        eligibleReports = eligibleReports.filter(report => requestedTypes.some(type =>
          String(report.title || '').toLowerCase().includes(type)
          || String(report.type || '').toLowerCase().includes(type),
        ));
      }
      let sharedReportIds: string[] = [];
      try {
        const parsed = JSON.parse(req.authorizedReportIds || '[]');
        if (Array.isArray(parsed)) sharedReportIds = parsed.map(String);
      } catch {}
      return {
        id: req.id,
        hospital: req.hospitalName,
        doctor: req.doctorName || 'Lab Admin',
        purpose: req.reason || 'Routine Checkup',
        reportTypes: req.reportTypes || 'All Reports',
        priority: req.priority || 'Normal',
        duration: req.duration || '24 Hours',
        date: new Date(req.requestDate).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
        }),
        status: req.status,
        eligibleReports: eligibleReports.map(report => ({
          id: report.id, title: report.title, type: report.type,
          date: report.date, hasFile: Boolean(report.fileUrl),
        })),
        sharedReportIds,
      };
    }));
  }

  async updateAccessRequestStatus(
    userEmail: string,
    id: string,
    status: string,
    reportIds: string[] = [],
  ) {
    const patient = await this.db.queryOne(
      'SELECT id, name FROM patient WHERE email = ?',
      [userEmail],
    );
    if (!patient) throw new NotFoundException('Patient not found');

    const req = await this.db.queryOne(
      'SELECT * FROM accessrequest WHERE id = ?',
      [id],
    );
    if (!req || req.patientId !== patient.id)
      throw new NotFoundException('Request not found');

    const normalizedStatus = String(status || '').toUpperCase();
    if (!['APPROVED', 'REJECTED', 'REVOKED'].includes(normalizedStatus)) {
      throw new BadRequestException('Invalid access request action.');
    }
    if (normalizedStatus === 'APPROVED') {
      const selectedIds = [...new Set((reportIds || []).map(String).filter(Boolean))];
      if (!selectedIds.length) throw new BadRequestException('Select at least one requested report to share.');
      const placeholders = selectedIds.map(() => '?').join(',');
      const selectedReports = await this.db.query<any>(
        `SELECT id, title, type FROM medicalrecord
         WHERE patientId = ? AND id IN (${placeholders})`,
        [patient.id, ...selectedIds],
      );
      if (selectedReports.length !== selectedIds.length) {
        throw new BadRequestException('One or more selected reports do not belong to this patient.');
      }
      const requestedTypes = String(req.reportTypes || '')
        .split(',').map(type => type.trim().toLowerCase()).filter(Boolean);
      if (!requestedTypes.includes('all reports')) {
        const invalidReport = selectedReports.some(report => !requestedTypes.some(type =>
          String(report.title || '').toLowerCase().includes(type)
          || String(report.type || '').toLowerCase().includes(type),
        ));
        if (invalidReport) throw new BadRequestException('Only reports matching the request can be shared.');
      }
      await this.db.query(
        'UPDATE accessrequest SET authorizedReportIds = ? WHERE id = ?',
        [JSON.stringify(selectedIds), id],
      );
    }
    await this.db.query(
      'UPDATE accessrequest SET status = ?, updatedAt = ? WHERE id = ?',
      [normalizedStatus, new Date(), id],
    );

    if (normalizedStatus === 'APPROVED') {
      const notifId = uuidv4();
      await this.db.query(
        'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, "Low", ?, ?)',
        [
          notifId,
          req.hospitalId,
          `PATIENT_APPROVED|${patient.id}`,
          'Access Request Approved',
          `${patient.name} approved access to the requested reports only: ${req.reportTypes || 'All Reports'}. Access duration: ${req.duration || '24 Hours'}.`,
          new Date(),
          new Date(),
        ],
      );
    } else if (normalizedStatus === 'REVOKED') {
      const notifId = uuidv4();
      await this.db.query(
        'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, "Low", ?, ?)',
        [
          notifId,
          req.hospitalId,
          `PATIENT_REVOKED|${patient.id}`,
          'Access Revoked',
          `${patient.name} has revoked your access to their medical records.`,
          new Date(),
          new Date(),
        ],
      );
    }
    await this.redisService.delPattern('hospital:searchPatients:*');
    return { success: true };
  }

  async getNotifications(userEmail: string) {
    const user = await this.db.queryOne<any>('SELECT id FROM user WHERE email = ?', [
      userEmail,
    ]);
    if (!user) return [];

    const notifications = await this.db.query(
      'SELECT * FROM notification WHERE userId = ? ORDER BY createdAt DESC',
      [user.id],
    );

    const patient = await this.db.queryOne<any>('SELECT id FROM patient WHERE LOWER(email)=LOWER(?) LIMIT 1', [userEmail]);
    const quotations = patient ? await this.db.query<any>(
      `SELECT q.id, q.pharmacyId FROM pharmacy_quotation q
       WHERE q.patientId=? AND q.status IN ('SENT','ACCEPTED')
       ORDER BY q.createdAt DESC`,
      [patient.id],
    ) : [];

    return notifications.map((n) => {
      const storedUrl = String(n.actionUrl || '');
      const isGenericQuotationUrl = n.type === 'PHARMACY_QUOTATION' && (!storedUrl || storedUrl.endsWith('viewQuotation=true'));
      const matchingQuotation = isGenericQuotationUrl
        ? quotations.find((quotation: any) => quotation.pharmacyId === n.hospitalId)
        : null;
      return {
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      actionUrl: matchingQuotation
        ? `/patient/prescriptions?viewQuotation=${encodeURIComponent(matchingQuotation.id)}`
        : storedUrl || '/patient/prescriptions',
      time: new Date(n.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      read: n.isRead ? true : false,
      };
    });
  }

  async markNotificationAsRead(userEmail: string, id: string) {
    const user = await this.db.queryOne('SELECT id FROM user WHERE email = ?', [
      userEmail,
    ]);
    if (!user) return { success: false };
    await this.db.query(
      'UPDATE notification SET isRead = true WHERE id = ? AND userId = ?',
      [id, user.id],
    );
    return { success: true };
  }

  async getNearbyPharmacies(location?: string) {
    const dbPharmacies = await this.db.query<any>(
      `SELECT h.id, h.name, h.address, h.phone, h.status, h.isVerified,
              hp.pharmacyServiceAreas AS serviceAreas,
              hp.openingTime, hp.closingTime
       FROM hospital h
       LEFT JOIN hospital_profile hp ON hp.hospitalId = h.id
       WHERE UPPER(h.type) = 'PHARMACY'
         AND UPPER(COALESCE(h.status, '')) <> 'SUSPENDED'
       ORDER BY h.isVerified DESC, h.name ASC`,
    );
    const allPharmacies = dbPharmacies.map((row, index) => {
      const now = new Date();
      const indiaTimeParts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(now);
      const currentHour = Number(indiaTimeParts.find((part) => part.type === 'hour')?.value || 0);
      const currentMinute = Number(indiaTimeParts.find((part) => part.type === 'minute')?.value || 0);
      const currentMinutes = currentHour * 60 + currentMinute;
      const toMinutes = (value: unknown) => {
        const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
        if (!match) return null;
        let hour = Number(match[1]);
        const minute = Number(match[2]);
        const period = match[3]?.toUpperCase();
        if (hour > 23 || minute > 59 || (period && hour > 12)) return null;
        if (period === 'AM' && hour === 12) hour = 0;
        if (period === 'PM' && hour < 12) hour += 12;
        return hour * 60 + minute;
      };
      const opensAt = toMinutes(row.openingTime);
      const closesAt = toMinutes(row.closingTime);
      const isOpen = opensAt == null || closesAt == null ||
        (opensAt <= closesAt
          ? currentMinutes >= opensAt && currentMinutes <= closesAt
          : currentMinutes >= opensAt || currentMinutes <= closesAt);
      return {
        id: row.id,
        name: row.name || 'Registered Pharmacy',
        address: String(row.address || '').trim(),
        phone: String(row.phone || '').trim(),
        serviceAreas: String(row.serviceAreas || '').trim(),
        status: row.status || 'ACTIVE',
        distance: `${(0.8 + index * 0.7).toFixed(1)} km`,
        rating: (4.8 - Math.min(index, 4) * 0.1).toFixed(1),
        openStatus: isOpen ? 'Open' : 'Closed',
      };
    });
    const normalizeSearchText = (value: unknown) => String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
    const searchLocation = normalizeSearchText(location);
    if (!searchLocation) {
      return allPharmacies;
    }

    const searchTokens = searchLocation.split(' ').filter(Boolean);
    return allPharmacies.filter((pharmacy) => {
      const searchableText = normalizeSearchText([
        pharmacy.address,
        pharmacy.name,
        pharmacy.serviceAreas,
        pharmacy.id,
      ].filter(Boolean).join(' '));
      return searchTokens.every((token) => searchableText.includes(token));
    });
  }

  async sendPrescriptionToPharmacies(userEmail: string, data: any) {
    const patient = await this.db.queryOne<any>(
      'SELECT id FROM patient WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [userEmail],
    );
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const pharmacyIds = [...new Set((Array.isArray(data.pharmacyIds) ? data.pharmacyIds : []).map((id: any) => String(id).trim()).filter(Boolean))];
    if (!data.prescriptionReference || !data.deliveryAddress || pharmacyIds.length === 0) {
      throw new BadRequestException('Prescription, delivery location and pharmacy IDs are required.');
    }

    const placeholders = pharmacyIds.map(() => '?').join(',');
    const pharmacies = await this.db.query<any>(
      `SELECT id FROM hospital WHERE UPPER(type) = 'PHARMACY' AND id IN (${placeholders})`,
      pharmacyIds,
    );
    if (pharmacies.length !== pharmacyIds.length) {
      throw new BadRequestException('One or more selected Pharmacy IDs are invalid.');
    }
    const connection = await this.db.getPool().getConnection();
    const requestGroupId = `PHR-${Date.now()}`;
    try {
      await connection.beginTransaction();
      for (const pharmacy of pharmacies) {
        const notifId = uuidv4();
        await connection.execute(
          `INSERT INTO pharmacy_prescription_request
           (id, requestGroupId, patientId, pharmacyId, prescriptionReference,
            deliveryAddress, requestNote, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW', NOW(3), NOW(3))`,
          [notifId, requestGroupId, patient.id, pharmacy.id, String(data.prescriptionReference), String(data.deliveryAddress), String(data.requestNote || '')],
        );

        // Notify Pharmacy Dashboard
        const [pharmacyUserRows]: any = await connection.execute(
          `SELECT id FROM user WHERE hospitalId = ? LIMIT 1`,
          [pharmacy.id]
        );
        const pharmacyUserId = (pharmacyUserRows && pharmacyUserRows[0]) ? pharmacyUserRows[0].id : null;

        await connection.execute(
          `INSERT INTO notification (id, userId, hospitalId, type, title, message, isRead, actionRequired, actionUrl, severity, createdAt, updatedAt)
           VALUES (?, ?, ?, 'NEW_PRESCRIPTION_REQUEST', ?, ?, false, true, '/pharmacy/prescription-requests', 'Medium', NOW(3), NOW(3))`,
          [
            uuidv4(),
            pharmacyUserId,
            pharmacy.id,
            `New Prescription Request Received`,
            `Patient shared prescription ${data.prescriptionReference} for medicine quotation.`
          ]
        );
      }
      await connection.commit();
      return { requestGroupId, recipients: pharmacies.length, pharmacyIds: pharmacies.map((item) => item.id), status: 'NEW' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getPharmacyQuotations(userEmail: string) {
    const patient = await this.db.queryOne<any>('SELECT id FROM patient WHERE LOWER(email)=LOWER(?) LIMIT 1', [userEmail]);
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const rows = await this.db.query<any>(
      `SELECT q.*, h.name AS pharmacyName, h.id AS pharmacyId, r.prescriptionReference,
              EXISTS(
                SELECT 1 FROM pharmacy_quotation accepted
                WHERE accepted.requestGroupId=q.requestGroupId AND accepted.status='ACCEPTED'
              ) AS groupHasAccepted,
              (q.status='ACCEPTED') AS isSelected
       FROM pharmacy_quotation q
       JOIN hospital h ON h.id=q.pharmacyId
       JOIN pharmacy_prescription_request r ON r.id=q.requestId
       WHERE q.patientId=? AND q.status IN ('SENT','ACCEPTED')
       ORDER BY q.createdAt DESC, q.totalAmount ASC`,
      [patient.id],
    );
    return rows.map((row) => ({
      ...row,
      rawPrescriptionReference: row.prescriptionReference,
      prescriptionReference: formatPrescriptionId(row.prescriptionReference),
    }));
  }

  async confirmPharmacyQuotation(userEmail: string, quotationId: string) {
    const patient = await this.db.queryOne<any>('SELECT id FROM patient WHERE LOWER(email)=LOWER(?) LIMIT 1', [userEmail]);
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const [rows]: any = await connection.execute('SELECT * FROM pharmacy_quotation WHERE id=? AND patientId=? AND status=? FOR UPDATE', [quotationId, patient.id, 'SENT']);
      const quotation = rows[0];
      if (!quotation) throw new BadRequestException('Quotation is unavailable or already processed.');
      const [acceptedRows]: any = await connection.execute(
        `SELECT id FROM pharmacy_quotation
         WHERE requestGroupId=? AND status='ACCEPTED' LIMIT 1 FOR UPDATE`,
        [quotation.requestGroupId],
      );
      if (acceptedRows[0]) {
        throw new BadRequestException('A pharmacy has already been selected for this request. Reject the remaining quotations individually.');
      }
      const items = typeof quotation.itemsJson === 'string' ? JSON.parse(quotation.itemsJson) : quotation.itemsJson;
      for (const item of Array.isArray(items) ? items : []) {
        if (!item.inventoryItemId || item.available === false) continue;
        const [result]: any = await connection.execute(`UPDATE pharmacy_inventory_item SET stockQuantity=stockQuantity-?,updatedAt=NOW(3) WHERE id=? AND pharmacyId=? AND stockQuantity>=?`, [item.quantity, item.inventoryItemId, quotation.pharmacyId, item.quantity]);
        if (!Number(result.affectedRows || 0)) throw new BadRequestException(`Insufficient stock for ${item.medicineName}.`);
      }
      const orderId = `ORD-${Date.now()}`;
      await connection.execute(`INSERT INTO pharmacy_order (id,quotationId,requestGroupId,patientId,pharmacyId,totalAmount,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,'CONFIRMED',NOW(3),NOW(3))`, [orderId, quotation.id, quotation.requestGroupId, patient.id, quotation.pharmacyId, quotation.totalAmount]);
      // Accept only the selected pharmacy. Other quotations stay pending until
      // the patient explicitly rejects them, so every pharmacy gets a clear response.
      await connection.execute(
        `UPDATE pharmacy_quotation SET status='ACCEPTED', updatedAt=NOW(3) WHERE id=?`,
        [quotation.id],
      );
      await connection.execute(
        `UPDATE pharmacy_prescription_request SET status='ACCEPTED', updatedAt=NOW(3)
         WHERE id=? AND pharmacyId=?`,
        [quotation.requestId, quotation.pharmacyId],
      );

      // Notify Pharmacy of Order Confirmation
      const [pharmacyUserRows]: any = await connection.execute(
        `SELECT id FROM user WHERE hospitalId = ? LIMIT 1`,
        [quotation.pharmacyId]
      );
      const pharmacyUserId = (pharmacyUserRows && pharmacyUserRows[0]) ? pharmacyUserRows[0].id : null;

      await connection.execute(
        `INSERT INTO notification (id, userId, hospitalId, type, title, message, isRead, actionRequired, actionUrl, severity, createdAt, updatedAt)
         VALUES (?, ?, ?, 'QUOTATION_ACCEPTED', ?, ?, false, false, '/pharmacy/orders', 'High', NOW(3), NOW(3))`,
        [
          uuidv4(),
          pharmacyUserId,
          quotation.pharmacyId,
          `Quotation Accepted & Order Confirmed`,
          `Patient accepted quotation ${quotation.id} and confirmed order for ₹${Number(quotation.totalAmount).toLocaleString('en-IN')}.`
        ]
      );

      await connection.commit();
      return { orderId, status: 'CONFIRMED', pharmacyId: quotation.pharmacyId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async rejectPharmacyQuotation(userEmail: string, quotationId: string) {
    const patient = await this.db.queryOne<any>(
      'SELECT id, name FROM patient WHERE LOWER(email)=LOWER(?) LIMIT 1',
      [userEmail],
    );
    if (!patient) throw new NotFoundException('Patient profile not found.');

    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const [rows]: any = await connection.execute(
        `SELECT q.id, q.pharmacyId, q.requestId, h.name AS pharmacyName
         FROM pharmacy_quotation q
         JOIN hospital h ON h.id=q.pharmacyId
         WHERE q.id=? AND q.patientId=? AND q.status='SENT' FOR UPDATE`,
        [quotationId, patient.id],
      );
      const quotation = rows[0];
      if (!quotation) throw new BadRequestException('Quotation is unavailable or already processed.');

      await connection.execute(
        `UPDATE pharmacy_quotation SET status='REJECTED', updatedAt=NOW(3) WHERE id=?`,
        [quotation.id],
      );
      await connection.execute(
        `UPDATE pharmacy_prescription_request SET status='REJECTED', updatedAt=NOW(3)
         WHERE id=? AND pharmacyId=?`,
        [quotation.requestId, quotation.pharmacyId],
      );
      const [pharmacyUsers]: any = await connection.execute(
        'SELECT id FROM user WHERE hospitalId=? ORDER BY createdAt ASC LIMIT 1',
        [quotation.pharmacyId],
      );
      if (pharmacyUsers[0]?.id) {
        await connection.execute(
          `INSERT INTO notification
           (id, userId, hospitalId, type, title, message, isRead, actionRequired, actionUrl, severity, createdAt, updatedAt)
           VALUES (?, ?, ?, 'QUOTATION_REJECTED', 'Quotation Rejected', ?, false, false, '/pharmacy/quotations', 'Medium', NOW(3), NOW(3))`,
          [uuidv4(), pharmacyUsers[0].id, quotation.pharmacyId, `${patient.name || 'Patient'} rejected quotation ${quotation.id}.`],
        );
      }
      await connection.commit();
      return { quotationId: quotation.id, status: 'REJECTED' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getPharmacyOrders(userEmail: string) {
    const patient = await this.db.queryOne<any>('SELECT id FROM patient WHERE LOWER(email)=LOWER(?) LIMIT 1', [userEmail]);
    if (!patient) throw new NotFoundException('Patient profile not found.');
    return this.db.query(`SELECT o.*, h.name AS pharmacyName, q.itemsJson FROM pharmacy_order o JOIN hospital h ON h.id=o.pharmacyId JOIN pharmacy_quotation q ON q.id=o.quotationId WHERE o.patientId=? ORDER BY o.createdAt DESC`, [patient.id]);
  }

  async markAllNotificationsAsRead(userEmail: string) {
    const user = await this.db.queryOne('SELECT id FROM user WHERE email = ?', [
      userEmail,
    ]);
    if (!user) return { success: false };

    await this.db.query(
      'UPDATE notification SET isRead = true WHERE userId = ?',
      [user.id],
    );
    return { success: true };
  }
}
