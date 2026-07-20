import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { formatPrescriptionId } from '../prescription-id';

@Injectable()
export class PatientService {
  constructor(
    private db: MysqlService,
    private redisService: RedisService,
  ) {}

  private generatePatientId(name: string, phone: string, year: string) {
    const initials = name.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2);
    const safePhone = phone || '000';
    const last3Phone = safePhone.length >= 3 ? safePhone.slice(-3) : safePhone.padStart(3, '0');
    const last2Year = year.slice(-2);
    return `${initials}${last3Phone}${last2Year}`;
  }

  async getOverview(userEmail: string) {
    const cacheKey = `patient:overview:${userEmail}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    let patient = await this.db.queryOne('SELECT * FROM patient WHERE email = ?', [userEmail]);

    if (!patient) {
      const user = await this.db.queryOne('SELECT * FROM user WHERE email = ?', [userEmail]);
      const year = new Date().getFullYear().toString();
      const newId = this.generatePatientId(user ? user.name : 'Unknown', '', year);
      await this.db.query(
        'INSERT INTO patient (id, email, name, phone, bloodGroup, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [newId, userEmail, user ? user.name : 'Unknown', '', 'Unknown', new Date()]
      );
      patient = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [newId]);
    }

    const appointments = await this.db.query(`
      SELECT a.*, d.name as doctorName, d.specialization as doctorSpecialization, h.name as hospitalName 
      FROM appointment a
      LEFT JOIN doctor d ON a.doctorId = d.id
      LEFT JOIN hospital h ON a.hospitalId = h.id
      WHERE a.patientId = ?
      ORDER BY a.dateTime DESC LIMIT 5
    `, [patient.id]);

    const records = await this.db.query('SELECT * FROM medicalrecord WHERE patientId = ? ORDER BY date DESC LIMIT 5', [patient.id]);

    let age = 'N/A';
    if (patient.dateOfBirth) {
      const dob = new Date(patient.dateOfBirth);
      const diff = Date.now() - dob.getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
    }

    let lastVisitStr = 'No visits yet';
    const lastAppointment = appointments.find(a => a.status === 'COMPLETED');
    if (lastAppointment) {
      lastVisitStr = new Date(lastAppointment.dateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } else if (records.length > 0) {
      lastVisitStr = new Date(records[0].date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const timelineEvents: any[] = [];
    appointments.forEach(apt => {
      const d = new Date(apt.dateTime);
      timelineEvents.push({
        id: 'apt-' + apt.id,
        date: d,
        dateStr: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        title: `${apt.doctorSpecialization || 'General'} Consultation`,
        desc: apt.notes || `Appointment at ${apt.hospitalName || 'Hospital'}`,
        type: 'APPOINTMENT'
      });
    });

    records.forEach(rec => {
      const d = new Date(rec.date);
      timelineEvents.push({
        id: 'rec-' + rec.id,
        date: d,
        dateStr: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        title: String(rec.type).toUpperCase() === 'PRESCRIPTION' ? formatPrescriptionId(rec.title || rec.id) : rec.title,
        desc: rec.description || rec.type,
        type: 'RECORD'
      });
    });

    timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
    const recentTimeline = timelineEvents.slice(0, 4);
    
    // Extract recent highlights and vitals from medical records
    const recentHighlights = records.filter(r => r.type === 'LAB_REPORT').slice(0, 2).map(r => ({
      name: r.title,
      status: r.status || 'Available',
      value: 'Open report'
    }));

    // Find BP from descriptions or default to N/A
    let bloodPressure = 'N/A';
    const bpRecord = records.find(r => r.description && r.description.match(/\b\d{2,3}\/\d{2,3}\b/));
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
        bloodPressure: bloodPressure
      },
      recentHighlights: recentHighlights,
      timeline: recentTimeline,
      testResultsStats: {
        completed: records.filter(r => r.type === 'LAB_REPORT').length,
        pending: appointments.filter(a => a.status === 'SCHEDULED').length,
        abnormal: records.filter(r => String(r.status || '').toUpperCase() === 'ABNORMAL').length,
      },
      recentReports: records.slice(0, 3).map(r => ({
        id: r.id,
        name: String(r.type).toUpperCase() === 'PRESCRIPTION' ? formatPrescriptionId(r.title || r.id) : r.title,
        date: new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: r.type,
        size: r.fileSize ? `${(Number(r.fileSize) / 1048576).toFixed(1)} MB` : 'Stored securely'
      }))
    };

    await this.redisService.set(cacheKey, result, 300); // 5 mins
    return result;
  }

  async getAppointments(userEmail: string) {
    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) return [];

    return this.db.query(`
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
    `, [patient.id]);
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
    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) throw new NotFoundException('Patient profile not found. Complete your profile first.');

    const dateTime = new Date(data.dateTime);
    if (!data.doctorId || !data.hospitalId || Number.isNaN(dateTime.getTime())) {
      throw new BadRequestException('Doctor, facility, and a valid appointment time are required.');
    }
    if (dateTime.getTime() <= Date.now()) {
      throw new BadRequestException('Appointment time must be in the future.');
    }

    const provider = await this.db.queryOne(
      'SELECT id FROM doctor WHERE id = ? AND hospitalId = ? AND UPPER(COALESCE(status, "ACTIVE")) = "ACTIVE"',
      [data.doctorId, data.hospitalId],
    );
    if (!provider) throw new BadRequestException('The selected provider is not available at this facility.');

    const id = uuidv4();
    const now = new Date();
    await this.db.query(
      'INSERT INTO appointment (id, patientId, doctorId, hospitalId, dateTime, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, patient.id, data.doctorId, data.hospitalId, dateTime, 'SCHEDULED', String(data.notes || '').trim() || null, now, now],
    );
    await this.redisService.del(`patient:overview:${userEmail}`);
    return { id, message: 'Appointment booked successfully.' };
  }

  async updateAppointmentStatus(userEmail: string, id: string, status: string) {
    const normalizedStatus = String(status || '').toUpperCase();
    if (normalizedStatus !== 'CANCELLED') {
      throw new BadRequestException('Patients may only cancel scheduled appointments.');
    }

    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const appointment = await this.db.queryOne(
      'SELECT id, status FROM appointment WHERE id = ? AND patientId = ?',
      [id, patient.id],
    );
    if (!appointment) throw new NotFoundException('Appointment not found.');
    if (String(appointment.status).toUpperCase() !== 'SCHEDULED') {
      throw new BadRequestException('Only scheduled appointments can be cancelled.');
    }

    await this.db.query('UPDATE appointment SET status = ?, updatedAt = ? WHERE id = ?', ['CANCELLED', new Date(), id]);
    await this.redisService.del(`patient:overview:${userEmail}`);
    return { message: 'Appointment cancelled.' };
  }

  async getRecords(userEmail: string) {
    const cacheKey = `patient:records:v2:${userEmail}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) return { myUploads: [] };

    const records = await this.db.query(`
      SELECT m.*, h.name as hospitalName, h.type as hospitalType 
      FROM medicalrecord m
      LEFT JOIN hospital h ON m.hospitalId = h.id
      WHERE m.patientId = ?
        AND UPPER(COALESCE(m.type, '')) <> 'PRESCRIPTION'
      ORDER BY m.date DESC
    `, [patient.id]);

    const formattedRecords = records.map(r => {
      let fileType = 'pdf';
      if (r.fileUrl && (r.fileUrl.endsWith('.jpg') || r.fileUrl.endsWith('.png'))) {
        fileType = 'jpg';
      }

      let typeColor = 'text-slate-600 bg-slate-50';
      if (r.type === 'LAB_REPORT' || r.type === 'Blood Test') typeColor = 'text-red-600 bg-red-50';
      else if (r.type?.toUpperCase() === 'PRESCRIPTION') typeColor = 'text-emerald-600 bg-emerald-50';
      else if (r.type === 'XRAY' || r.type === 'X-Ray') typeColor = 'text-cyan-600 bg-cyan-50';
      
      return {
        id: r.id,
        fileName: r.title,
        type: r.type,
        uploadDate: new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: '1.5 MB',
        fileType: fileType,
        typeColor: typeColor,
        fileUrl: r.fileUrl,
        hospitalName: r.hospitalName || "Uploaded by Patient",
        hospitalType: r.hospitalType || null
      };
    });

    const result = { myUploads: formattedRecords };
    await this.redisService.set(cacheKey, result, 300); // 5 mins
    return result;
  }

  async uploadRecord(userEmail: string, file: any, body: any) {
    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) throw new Error("Patient not found");

    const newId = uuidv4();
    const now = new Date();
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, title, type, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newId, patient.id, body.reportName || file.originalname, body.reportType || 'DOCUMENT', file.filename, now, now]
    );

    // Invalidate patient cache
    await this.redisService.del(`patient:overview:${userEmail}`);
    await this.redisService.del(`patient:records:${userEmail}`);

    return { id: newId };
  }

  async getProfile(userEmail: string) {
    const cacheKey = `patient:profile:${userEmail}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const patient = await this.db.queryOne('SELECT * FROM patient WHERE email = ?', [userEmail]);
    if (!patient) {
      return {
        name: '', email: userEmail, phone: '', dateOfBirth: '', bloodGroup: '', gender: ''
      };
    }
    
    const result = {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      bloodGroup: patient.bloodGroup,
      gender: patient.gender,
      logoUrl: (await this.db.queryOne('SELECT value FROM setting WHERE `key` = ?', [`profile.logo.patient.${patient.id}`]))?.value || '',
    };
    await this.redisService.set(cacheKey, result, 600); // 10 mins
    return result;
  }

  async updateProfile(userEmail: string, data: any) {
    let patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    
    if (patient) {
      await this.db.query(
        'UPDATE patient SET name = ?, phone = ?, bloodGroup = ?, gender = ?, dateOfBirth = ? WHERE id = ?',
        [data.name, data.phone, data.bloodGroup, data.gender, dob, patient.id]
      );
      await this.db.query('UPDATE user SET name = ? WHERE email = ?', [data.name, userEmail]);
    } else {
      const year = new Date().getFullYear().toString();
      const newId = this.generatePatientId(data.name, data.phone, year);
      await this.db.query(
        'INSERT INTO patient (id, email, name, phone, bloodGroup, gender, dateOfBirth, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [newId, userEmail, data.name, data.phone, data.bloodGroup, data.gender, dob, new Date()]
      );
      patient = { id: newId };
    }
    
    // Invalidate caches
    await this.redisService.del(`patient:profile:${userEmail}`);
    await this.redisService.del(`patient:overview:${userEmail}`);
    
    return patient;
  }

  async uploadProfileLogo(userEmail: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Select an image to upload.');
    if (!file.mimetype?.startsWith('image/')) throw new BadRequestException('Profile image must be an image file.');
    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) throw new NotFoundException('Patient profile not found.');
    const logoUrl = `/uploads/${file.filename}`;
    await this.db.query('INSERT INTO setting (`key`, value, updatedAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updatedAt = VALUES(updatedAt)', [`profile.logo.patient.${patient.id}`, logoUrl, new Date()]);
    await this.redisService.del(`patient:profile:${userEmail}`);
    return { logoUrl };
  }

  async getPrescriptions(userEmail: string) {
    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) return [];

    const records = await this.db.query(`
      SELECT m.*, h.name as hospitalName, h.type as hospitalType 
      FROM medicalrecord m
      LEFT JOIN hospital h ON m.hospitalId = h.id
      WHERE m.patientId = ? AND UPPER(COALESCE(m.type, '')) = 'PRESCRIPTION'
      ORDER BY m.date DESC
    `, [patient.id]);

    const formattedRecords = records.map(r => ({
      id: formatPrescriptionId(r.title || r.id),
      doctor: r.description || 'Unknown Doctor',
      date: new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
      hospitalName: r.hospitalName || null,
      hospitalType: r.hospitalType || null,
      fileUrl: r.fileUrl || null
    }));

    const doctorPrescriptions = await this.db.query(`
      SELECT p.*, h.name as hospitalName, h.type as hospitalType, d.name as doctorName
      FROM prescription p
      LEFT JOIN hospital h ON p.hospitalId = h.id
      LEFT JOIN doctor d ON p.doctorId = d.id
      WHERE p.patientId = ?
      ORDER BY p.createdAt DESC
    `, [patient.id]);

    const formattedDoctorPrescriptions = doctorPrescriptions.map(p => ({
      id: formatPrescriptionId(p.id),
      doctor: p.doctorName ? 'Dr. ' + p.doctorName : 'Unknown Doctor',
      date: new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: p.status || 'Active',
      hospitalName: p.hospitalName || null,
      hospitalType: p.hospitalType || null,
      medicine: p.medicine,
      dosage: p.dosage,
      duration: p.duration
    }));

    const allPrescriptions = [...formattedRecords, ...formattedDoctorPrescriptions];
    allPrescriptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allPrescriptions;
  }

  async createPrescription(userEmail: string, data: any) {
    const patient = await this.db.queryOne('SELECT id FROM patient WHERE email = ?', [userEmail]);
    if (!patient) throw new Error("Patient not found");

    const newId = uuidv4();
    const prescriptionId = await this.allocatePrescriptionId();
    const d = data.date ? new Date(data.date) : new Date();
    await this.db.query(
      "INSERT INTO medicalrecord (id, patientId, type, title, description, date, updatedAt) VALUES (?, ?, 'PRESCRIPTION', ?, ?, ?, ?)",
      [newId, patient.id, prescriptionId, data.doctor, d, new Date()]
    );

    return {
      id: prescriptionId,
      doctor: data.doctor,
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
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
      if (!rows.length) throw new Error('Prescription ID sequence is not initialized.');

      const nextValue = Number(rows[0].nextValue);
      if (nextValue > 99999) throw new Error('Prescription ID range is exhausted.');
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

  async getAccessRequests(userEmail: string) {
    const patient = await this.db.queryOne('SELECT id, name FROM patient WHERE email = ?', [userEmail]);
    if (!patient) return [];

    const requests = await this.db.query(`
      SELECT r.*, h.name as hospitalName, d.name as doctorName
      FROM accessrequest r
      LEFT JOIN hospital h ON r.hospitalId = h.id
      LEFT JOIN doctor d ON r.doctorId = d.id
      WHERE r.patientId = ?
      ORDER BY r.requestDate DESC
    `, [patient.id]);

    return requests.map(req => ({
      id: req.id,
      hospital: req.hospitalName,
      doctor: req.doctorName || "Lab Admin",
      purpose: req.reason || "Routine Checkup",
      reportTypes: req.reportTypes || "All Reports",
      priority: req.priority || "Normal",
      duration: req.duration || "24 Hours",
      date: new Date(req.requestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: req.status,
    }));
  }

  async updateAccessRequestStatus(userEmail: string, id: string, status: string) {
    const patient = await this.db.queryOne('SELECT id, name FROM patient WHERE email = ?', [userEmail]);
    if (!patient) throw new NotFoundException("Patient not found");

    const req = await this.db.queryOne('SELECT * FROM accessrequest WHERE id = ?', [id]);
    if (!req || req.patientId !== patient.id) throw new NotFoundException("Request not found");

    await this.db.query('UPDATE accessrequest SET status = ?, updatedAt = ? WHERE id = ?', [status, new Date(), id]);

    if (status === 'APPROVED') {
      const notifId = uuidv4();
      await this.db.query(
        'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, "Low", ?, ?)',
        [notifId, req.hospitalId, `PATIENT_APPROVED|${patient.id}`, "Access Request Approved", `${patient.name} has approved your request to access their medical records.`, new Date(), new Date()]
      );
    }
    return { success: true };
  }

  async getNotifications(userEmail: string) {
    const user = await this.db.queryOne('SELECT id FROM user WHERE email = ?', [userEmail]);
    if (!user) return [];
    
    const notifications = await this.db.query('SELECT * FROM notification WHERE userId = ? ORDER BY createdAt DESC', [user.id]);
    
    return notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      read: n.isRead ? true : false
    }));
  }

  async markNotificationAsRead(userEmail: string, id: string) {
    await this.db.query('UPDATE notification SET isRead = true WHERE id = ?', [id]);
    return { success: true };
  }

  async markAllNotificationsAsRead(userEmail: string) {
    const user = await this.db.queryOne('SELECT id FROM user WHERE email = ?', [userEmail]);
    if (!user) return { success: false };
    
    await this.db.query('UPDATE notification SET isRead = true WHERE userId = ?', [user.id]);
    return { success: true };
  }
}
