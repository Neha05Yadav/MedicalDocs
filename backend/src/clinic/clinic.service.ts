import { BadRequestException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { createHash } from 'crypto';
import { formatPrescriptionId, formatPrescriptionRecord } from '../prescription-id';

@Injectable({ scope: Scope.REQUEST })
export class ClinicService {
  constructor(
    private db: MysqlService,
    private redisService: RedisService,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  private async getDoctorContext() {
    const email = this.request?.user?.email;
    if (!email) throw new UnauthorizedException('Clinic identity is required.');

    // A clinic portal may be opened by an individual doctor or by the clinic
    // administrator. Resolve the doctor directly first; for an administrator,
    // stay inside the linked clinic tenant and use its active clinical profile.
    let doctor = await this.db.queryOne('SELECT * FROM doctor WHERE email = ?', [email]);
    if (!doctor) {
      const user = await this.db.queryOne(
        `SELECT u.hospitalId
         FROM user u
         INNER JOIN hospital h ON h.id = u.hospitalId
         WHERE u.email = ? AND UPPER(h.type) = 'CLINIC'
         LIMIT 1`,
        [email],
      );

      if (user?.hospitalId) {
        doctor = await this.db.queryOne(
          `SELECT * FROM doctor
           WHERE hospitalId = ? AND (status IS NULL OR status = 'Active')
           ORDER BY updatedAt DESC, id ASC
           LIMIT 1`,
          [user.hospitalId],
        );
      }
    }
    if (!doctor) throw new UnauthorizedException('No clinic workspace is linked to this identity.');
    return doctor;
  }

  async getOverview() {
    const doctor = await this.getDoctorContext();
    const cacheKey = `clinic:overview:v3:${doctor.id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const currentMonth = new Date().getMonth();

    const appts = await this.db.query('SELECT * FROM appointment WHERE doctorId = ?', [doctor.id]);
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAppointments = appts.filter(a => new Date(a.dateTime).toISOString().startsWith(todayStr)).length;
    const pendingAppointments = appts.filter(a => a.status === 'SCHEDULED' && new Date(a.dateTime) >= new Date()).length;
    
    // Total Patients
    const linkedPatients = await this.getMyPatients();
    const totalPatients = linkedPatients.length;

    // Prescriptions Issued
    const rxs = await this.db.query('SELECT id FROM prescription WHERE doctorId = ?', [doctor.id]);
    const prescriptionsWritten = rxs.length;

    // Pending Reports (Test requests sent by clinic that are not completed)
    const pendingTestReqs = await this.db.query(
      'SELECT id FROM testrequest WHERE referringHospitalId = ? AND status != "Completed"', 
      [doctor.hospitalId]
    );
    const pendingReports = pendingTestReqs.length;

    // Reviewed / Received Reports
    const receivedReports = await this.db.query(
      'SELECT id FROM medicalrecord WHERE hospitalId = ? AND type = "LAB_REPORT"', 
      [doctor.hospitalId]
    );
    const reviewedReports = receivedReports.length;

    const kpis = [
      { label: "Total Patients", value: totalPatients.toString() },
      { label: "Pending Reports", value: pendingReports.toString() },
      { label: "Reviewed Reports", value: reviewedReports.toString() },
      { label: "Prescriptions Issued", value: prescriptionsWritten.toString() }
    ];

    let scheduleMode = 'upcoming';
    let scheduleRows = await this.db.query(`
      SELECT a.*, p.name as patientName 
      FROM appointment a
      LEFT JOIN patient p ON a.patientId = p.id
      WHERE a.doctorId = ? AND a.dateTime >= CURDATE()
      ORDER BY a.dateTime ASC LIMIT 5
    `, [doctor.id]);

    // If the clinic has no future booking, keep the card useful with its real
    // most-recent DB activity instead of rendering a large empty placeholder.
    if (scheduleRows.length === 0) {
      scheduleMode = 'recent';
      scheduleRows = await this.db.query(`
        SELECT a.*, p.name as patientName
        FROM appointment a
        LEFT JOIN patient p ON a.patientId = p.id
        WHERE a.doctorId = ?
        ORDER BY a.dateTime DESC LIMIT 5
      `, [doctor.id]);
    }

    const recentPatients = linkedPatients.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      condition: p.diagnosis || 'General',
      age: p.age || 'N/A',
      last_visit: !p.lastVisit || p.lastVisit === 'N/A' ? null : p.lastVisit,
    }));
    
    const activePatients = await this.db.query(`
      SELECT r.*, p.name as patientName, p.phone as patientPhone, h.name as hospitalName 
      FROM accessrequest r
      LEFT JOIN patient p ON r.patientId = p.id
      LEFT JOIN hospital h ON r.hospitalId = h.id
      WHERE r.doctorId = ? AND r.status = "APPROVED"
      ORDER BY r.requestDate DESC LIMIT 5
    `, [doctor.id]);

    const result = {
      kpis,
      todaysAppointments,
      pendingAppointments,
      totalPatients,
      prescriptionsWritten,
      scheduleMode,
      appointments: scheduleRows.map(a => ({
        id: a.id,
        patientName: a.patientName,
        time: new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(a.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        notes: a.notes || 'Consultation',
        status: a.status,
      })),
      recentPatients,
      activePatients: activePatients.map(r => ({
        id: r.id,
        name: r.hospitalPatientName || r.patientName,
        condition: r.admissionInfo || 'No admission context',
        ward: r.hospitalName || 'Facility unavailable',
        lastVisit: new Date(r.requestDate).toLocaleDateString()
      })),
      revenueData: []
    };

    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async getAppointments() {
    const doctor = await this.getDoctorContext();
    const appts = await this.db.query(`
      SELECT a.*, p.name as patientName, p.phone as patientPhone 
      FROM appointment a
      LEFT JOIN patient p ON a.patientId = p.id
      WHERE a.doctorId = ?
      ORDER BY a.dateTime DESC
    `, [doctor.id]);

    return appts.map(a => ({
      id: a.id,
      patientName: a.patientName,
      patientId: a.patientId,
      phone: a.patientPhone || 'N/A',
      date: new Date(a.dateTime).toLocaleDateString(),
      time: new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: a.type || 'Consultation',
      status: a.status
    }));
  }

  async updateAppointmentStatus(id: string, status: string) {
    const doctor = await this.getDoctorContext();
    const appt = await this.db.queryOne('SELECT * FROM appointment WHERE id = ? AND doctorId = ?', [id, doctor.id]);
    if (!appt) throw new NotFoundException('Appointment not found');

    await this.db.query('UPDATE appointment SET status = ? WHERE id = ?', [status, id]);

    if (status === 'COMPLETED') {
      const existing = await this.db.queryOne('SELECT * FROM accessrequest WHERE doctorId = ? AND patientId = ?', [doctor.id, appt.patientId]);
      if (!existing && doctor.hospitalId) {
        await this.db.query(
          'INSERT INTO accessrequest (id, patientId, doctorId, hospitalId, status, requestDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), appt.patientId, doctor.id, doctor.hospitalId, 'APPROVED', new Date(), new Date(), new Date()]
        );
      }
    }
    return { success: true, message: "Access Approved" };
  }

  async createLabRequest(data: { patientId: string; labTestName: string; priority: string; labId: string }) {
    const doctor = await this.getDoctorContext();
    const labId = data.labId;
    const hospital = await this.db.queryOne('SELECT * FROM hospital WHERE id = ?', [doctor.hospitalId]);

    const requestId = uuidv4();
    await this.db.query(
      'INSERT INTO testrequest (id, patientId, hospitalId, testType, status, priority, doctorId, referringHospitalId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [requestId, data.patientId, labId, data.labTestName, 'Pending', data.priority || 'Normal', doctor.id, hospital.id, new Date(), new Date()]
    );

    await this.db.query(
      'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), labId, `LAB_REQUEST|${hospital.id}`, "New Lab Request", `${hospital.name} has requested a ${data.labTestName} for patient ${data.patientId}.`, false, true, 'High', new Date(), new Date()]
    );
    return { success: true, message: "Lab request sent successfully" };
  }

  // --- Prescriptions Module APIs ---
  async getMyPatients() {
    const doctor = await this.getDoctorContext();
    const customRows = await this.db.query(
      'SELECT * FROM clinic_patient WHERE doctorId = ? ORDER BY updatedAt DESC',
      [doctor.id],
    );
    const linkedRows = await this.db.query(`
      SELECT p.*,
        MAX(activity.activityAt) AS activityAt,
        MAX(activity.diagnosis) AS diagnosis
      FROM patient p
      INNER JOIN (
        SELECT patientId, MAX(dateTime) AS activityAt, MAX(notes) AS diagnosis
          FROM appointment WHERE doctorId = ? GROUP BY patientId
        UNION ALL
        SELECT patientId, MAX(requestDate), MAX(admissionInfo)
          FROM accessrequest WHERE doctorId = ? OR hospitalId = ? GROUP BY patientId
        UNION ALL
        SELECT patientId, MAX(createdAt), MAX(medicine)
          FROM prescription WHERE doctorId = ? OR hospitalId = ? GROUP BY patientId
        UNION ALL
        SELECT patientId, MAX(createdAt), MAX(description)
          FROM medicalrecord WHERE hospitalId = ? GROUP BY patientId
      ) activity ON activity.patientId = p.id
      GROUP BY p.id
      ORDER BY activityAt DESC, p.updatedAt DESC
    `, [doctor.id, doctor.id, doctor.hospitalId, doctor.id, doctor.hospitalId, doctor.hospitalId]);

    const customIds = new Set(customRows.map((row: any) => row.id));
    const realRows = linkedRows
      .filter((row: any) => !customIds.has(row.id))
      .map((row: any) => ({
        id: row.id,
        name: row.name,
        phone: row.phone || '',
        age: row.dateOfBirth
          ? Math.max(0, Math.floor((Date.now() - new Date(row.dateOfBirth).getTime()) / 31557600000))
          : 'N/A',
        gender: row.gender || 'Unknown',
        bloodGroup: row.bloodGroup || 'N/A',
        lastVisit: row.activityAt ? new Date(row.activityAt).toLocaleDateString('en-IN') : 'N/A',
        diagnosis: row.diagnosis || 'General consultation',
        followUp: 'Not scheduled',
        status: 'Treatment Ongoing',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        source: 'database',
      }));
    return [...customRows, ...realRows];
  }

  private generatePatientId(name: string, phone: string, year: string) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const safePhone = phone || '000';
    const last3Phone = safePhone.length >= 3 ? safePhone.slice(-3) : safePhone.padStart(3, '0');
    const last2Year = year.slice(-2);
    return `${initials}${last3Phone}${last2Year}`;
  }

  async createMyPatient(data: any) {
    const doctor = await this.getDoctorContext();
    const year = new Date().getFullYear().toString();
    let id = this.generatePatientId(data.name, data.phone, year);
    const existing = await this.db.queryOne('SELECT id FROM clinic_patient WHERE id = ?', [id]);
    if (existing) id = `${id}-${uuidv4().slice(0, 4).toUpperCase()}`;
    await this.db.query(
      'INSERT INTO clinic_patient (id, doctorId, name, phone, age, gender, bloodGroup, lastVisit, diagnosis, followUp, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, doctor.id, data.name, data.phone || null, data.age, data.gender, data.bloodGroup,
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        data.diagnosis || 'Pending',
        data.followUp ? new Date(data.followUp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not scheduled',
        data.status, new Date(), new Date()
      ]
    );
    await this.redisService.del(`clinic:patients:v3:${doctor.id}`);
    await this.redisService.del(`clinic:overview:v3:${doctor.id}`);
    return { success: true, id };
  }

  async updateMyPatient(id: string, data: any) {
    const doctor = await this.getDoctorContext();
    await this.db.query(
      'UPDATE clinic_patient SET name = ?, phone = ?, age = ?, gender = ?, bloodGroup = ?, diagnosis = ?, followUp = ?, status = ?, updatedAt = ? WHERE id = ? AND doctorId = ?',
      [
        data.name, data.phone || null, data.age, data.gender, data.bloodGroup, data.diagnosis || 'Pending',
        data.followUp ? new Date(data.followUp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not scheduled',
        data.status, new Date(), id, doctor.id
      ]
    );
    await this.redisService.del(`clinic:patients:v3:${doctor.id}`);
    return { success: true };
  }

  async deleteMyPatient(id: string) {
    const doctor = await this.getDoctorContext();
    const patient = await this.db.queryOne('SELECT id FROM clinic_patient WHERE id = ? AND doctorId = ?', [id, doctor.id]);
    if (!patient) throw new NotFoundException('Clinic patient not found.');
    await this.db.query('DELETE FROM clinic_patient WHERE id = ? AND doctorId = ?', [id, doctor.id]);
    await this.redisService.del(`clinic:patients:v3:${doctor.id}`);
    await this.redisService.del(`clinic:overview:v3:${doctor.id}`);
    return { success: true };
  }

  async getPatients() {
    const doctor = await this.getDoctorContext();
    const cacheKey = `clinic:patients:v3:${doctor.id}`;
    const cached = await this.redisService.get<any[]>(cacheKey);
    if (cached) return cached;

    const directoryRows = await this.db.query('SELECT id FROM patient ORDER BY updatedAt DESC, createdAt DESC');
    const pIds = directoryRows.map((row: any) => row.id);
    const patients: any[] = [];

    for (const pid of pIds) {
      const p = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [pid]);
      if (p) {
        const lastAppt = await this.db.queryOne('SELECT dateTime FROM appointment WHERE doctorId = ? AND patientId = ? AND status = "COMPLETED" ORDER BY dateTime DESC LIMIT 1', [doctor.id, p.id]);
        
        let status = 'Not Requested';
        let validTill = '';
        const accessReq = await this.db.queryOne('SELECT id, status, updatedAt FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [doctor.hospitalId, p.id]);
        if (accessReq) {
          if (accessReq.status === 'PENDING') status = 'Pending';
          else if (accessReq.status === 'APPROVED') status = 'Access Approved';
          else if (accessReq.status === 'REJECTED') status = 'Rejected';
          
          if (accessReq.status === 'APPROVED') {
            let isExpired = false;
            if (accessReq.updatedAt) {
              const now = new Date().getTime();
              const approvedAt = new Date(accessReq.updatedAt).getTime();
              const hoursPassed = (now - approvedAt) / (1000 * 60 * 60);
              
              // Defaulting to 24 hours for all requests since duration isn't tracked in DB
              let expiryHours = 24;

              if (expiryHours > 0 && hoursPassed > expiryHours) {
                isExpired = true;
              } else if (expiryHours > 0) {
                const expiryDate = new Date(approvedAt + expiryHours * 60 * 60 * 1000);
                validTill = expiryDate.toLocaleDateString() + ' ' + expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            }

            if (isExpired) {
              await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', accessReq.id]);
              status = 'Expired';
            }
          }
          else if (accessReq.status === 'EXPIRED' || accessReq.status === 'REVOKED') status = 'Expired';
        }

        patients.push({
          id: p.id,
          name: p.name,
          age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 'N/A',
          gender: p.gender || 'Unknown',
          phone: p.phone || 'N/A',
          mobile: p.phone || 'N/A',
          lastVisit: lastAppt ? new Date(lastAppt.dateTime).toLocaleDateString() : 'N/A',
          bloodGroup: p.bloodGroup || 'N/A',
          status,
          accessValidTill: validTill,
          validTill
        });
      }
    }
    
    await this.redisService.set(cacheKey, patients, 300);
    return patients;
  }

  async searchPatients(query: string) {
    if (!query || query.length < 2) return [];
    const doctor = await this.getDoctorContext();
    const patients = await this.db.query(`SELECT * FROM patient WHERE id LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ? LIMIT 10`, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    
    const result: any[] = [];
    for (const p of patients) {
      let status = 'Not Requested';
      let validTill = '';
      const accessReq = await this.db.queryOne('SELECT id, status, updatedAt FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [doctor.hospitalId, p.id]);
      if (accessReq) {
        if (accessReq.status === 'PENDING') status = 'Pending';
        else if (accessReq.status === 'APPROVED') status = 'Access Approved';
        else if (accessReq.status === 'REJECTED') status = 'Rejected';

        if (accessReq.status === 'APPROVED') {
          let isExpired = false;
          if (accessReq.updatedAt) {
            const now = new Date().getTime();
            const approvedAt = new Date(accessReq.updatedAt).getTime();
            const hoursPassed = (now - approvedAt) / (1000 * 60 * 60);
            
            // Defaulting to 24 hours for all requests
            let expiryHours = 24;

            if (expiryHours > 0 && hoursPassed > expiryHours) {
              isExpired = true;
            } else if (expiryHours > 0) {
              const expiryDate = new Date(approvedAt + expiryHours * 60 * 60 * 1000);
              validTill = expiryDate.toLocaleDateString() + ' ' + expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
          }

          if (isExpired) {
            await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', accessReq.id]);
            status = 'Expired';
          } else {
            status = 'Access Approved';
          }
        }
        else if (accessReq.status === 'PENDING') status = 'Pending';
        else if (accessReq.status === 'REJECTED') status = 'Rejected';
        else if (accessReq.status === 'EXPIRED' || accessReq.status === 'REVOKED') status = 'Expired';
      }

      result.push({
        id: p.id,
        name: p.name,
        phone: p.phone,
        mobile: p.phone || 'N/A',
        email: p.email,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 'N/A',
        gender: p.gender || 'Unknown',
        bloodGroup: p.bloodGroup || 'N/A',
        status,
        accessValidTill: validTill,
        validTill
      });
    }
    return result;
  }

  async getPatientDetails(patientId: string) {
    const doctor = await this.getDoctorContext();
    const p = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [patientId]);
    if (!p) throw new NotFoundException('Patient not found');

    const appts = await this.db.query('SELECT * FROM appointment WHERE doctorId = ? AND patientId = ? ORDER BY dateTime DESC LIMIT 5', [doctor.id, patientId]);
    const rxs = await this.db.query('SELECT * FROM prescription WHERE doctorId = ? AND patientId = ? ORDER BY createdAt DESC LIMIT 5', [doctor.id, patientId]);
    const recs = await this.db.query('SELECT * FROM medicalrecord WHERE patientId = ? ORDER BY date DESC LIMIT 5', [patientId]);

    return {
      patient: {
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 'N/A',
        gender: p.gender || 'Unknown',
        bloodGroup: p.bloodGroup || 'N/A'
      },
      appointments: appts.map(a => ({
        id: a.id,
        date: new Date(a.dateTime).toLocaleDateString(),
        type: a.type || 'Consultation',
        status: a.status
      })),
      prescriptions: rxs.map(r => ({
        id: formatPrescriptionId(r.id),
        recordId: r.id,
        medicine: r.medicine,
        date: new Date(r.createdAt).toLocaleDateString(),
        status: r.status
      })),
      records: recs.map(r => ({
        id: r.id,
        title: String(r.type).toUpperCase() === 'PRESCRIPTION' ? formatPrescriptionId(r.title || r.id) : r.title,
        type: r.type,
        date: new Date(r.date).toLocaleDateString(),
        fileUrl: r.fileUrl
      }))
    };
  }
  async requestAccess(patientId: string, reportTypes: string, reason: string, priority: string, duration: string, note: string) {
    const doctor = await this.getDoctorContext();
    const existing = await this.db.queryOne('SELECT * FROM accessrequest WHERE hospitalId = ? AND patientId = ?', [doctor.hospitalId, patientId]);
    
    if (existing) {
      await this.db.query('UPDATE accessrequest SET doctorId = ?, status = ?, requestDate = ?, updatedAt = ?, reportTypes = ?, reason = ?, priority = ?, duration = ? WHERE id = ?', 
        [doctor.id, 'PENDING', new Date(), new Date(), reportTypes, reason, priority, duration, existing.id]);
    } else {
      await this.db.query(
        'INSERT INTO accessrequest (id, patientId, hospitalId, doctorId, status, updatedAt, requestDate, createdAt, reportTypes, reason, priority, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), patientId, doctor.hospitalId, doctor.id, 'PENDING', new Date(), new Date(), new Date(), reportTypes, reason, priority, duration]
      );
    }

    // Auto-create notification for the patient
    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        const hospital = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [doctor.hospitalId]);
        const hospitalName = hospital ? hospital.name : 'Clinic';
        
        const requestedReportsString = (reportTypes === 'All Reports' || reportTypes.includes('All Reports'))
          ? 'All Medical Reports' 
          : reportTypes.split(',').map((r: string) => `• ${r.trim()}`).join('\n');
          
        const dateStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const message = `${hospitalName} has requested access to your medical records.\n\nRequested Reports:\n${requestedReportsString}\n\nReason:\n${reason}\n\nStatus: Pending\n\n${dateStr} • ${timeStr}`;

        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), userForNotif.id, 'ACCESS_REQUEST', 'New Access Request', message, false, true, new Date(), new Date()]
        );
      }
    }
    return { success: true };
  }

  async approveAccess(requestId: string) {
    const doctor = await this.getDoctorContext();
    await this.db.query('UPDATE accessrequest SET status = "APPROVED" WHERE id = ? AND doctorId = ?', [requestId, doctor.id]);
    return { success: true };
  }

  async getPatientRecords(patientId: string) {
    const doctor = await this.getDoctorContext();
    const access = await this.db.queryOne('SELECT * FROM accessrequest WHERE hospitalId = ? AND patientId = ? AND status = ?', [doctor.hospitalId, patientId, 'APPROVED']);
    
    if (!access) throw new UnauthorizedException("You do not have an approved access request to view this patient's reports.");

    // Check Duration
    if (access.updatedAt) {
      const now = new Date().getTime();
      const approvedAt = new Date(access.updatedAt).getTime();
      const hoursPassed = (now - approvedAt) / (1000 * 60 * 60);
      if (hoursPassed > 24) {
        await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', access.id]);
        throw new UnauthorizedException("Your access request has expired (24 Hours). Please request access again.");
      }
    }

    let reports = await this.db.query('SELECT * FROM medicalrecord WHERE patientId = ? ORDER BY date DESC', [patientId]);
    
    // Filter by Report Types
    const rawTypes = access.reportTypes?.trim() ? access.reportTypes : 'All Reports';
    const approvedTypes: string[] = rawTypes.split(',').map((t: string) => t.trim());
    if (!approvedTypes.includes('All Reports')) {
      reports = reports.filter((r: any) => {
        return approvedTypes.some(type => 
          r.title.toLowerCase().includes(type.toLowerCase()) || 
          r.type.toLowerCase().includes(type.toLowerCase())
        );
      });
    }

    return reports.map(formatPrescriptionRecord);
  }

  async getAllLabs() {
    return this.db.query('SELECT id, name, address FROM hospital WHERE type = "Laboratory" AND status = "Active"');
  }

  async getPrescriptions() {
    const doctor = await this.getDoctorContext();
    const rxs = await this.db.query(`
      SELECT r.*, p.name as patientName, sfp.storedFileId as imageFileId
      FROM prescription r
      LEFT JOIN patient p ON r.patientId = p.id
      LEFT JOIN stored_file_prescription sfp ON sfp.prescriptionId = r.id
      WHERE r.doctorId = ?
      ORDER BY r.createdAt DESC
    `, [doctor.id]);

    return rxs.map(rx => ({
      id: formatPrescriptionId(rx.id),
      recordId: rx.id,
      patientName: rx.patientName,
      patientId: rx.patientId,
      medicine: rx.medicine,
      dosage: rx.dosage,
      duration: rx.duration,
      date: new Date(rx.createdAt).toLocaleDateString(),
      status: rx.status,
      hasImage: Boolean(rx.imageFileId),
      imageUrl: rx.imageFileId ? `/api/clinic/prescriptions/${encodeURIComponent(rx.id)}/image` : null,
    }));
  }

  async createPrescription(data: any, image?: Express.Multer.File) {
    const doctor = await this.getDoctorContext();
    const pId = await this.insertPrescriptionWithRxId(data, doctor);

    if (image) {
      if (!this.hasValidImageSignature(image.buffer, image.mimetype)) {
        await this.db.query('DELETE FROM prescription WHERE id = ? AND doctorId = ?', [pId, doctor.id]);
        throw new BadRequestException('The uploaded prescription image is invalid.');
      }

      const storedFileId = uuidv4();
      const relativePath = `prescriptions/${pId}/${storedFileId}`;
      const sha256 = createHash('sha256').update(image.buffer).digest('hex');
      await this.db.query(
        `INSERT INTO stored_file
          (id, fileName, relativePath, mimeType, sizeBytes, sha256, content, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [storedFileId, image.originalname, relativePath, image.mimetype, image.size, sha256, image.buffer, new Date(), new Date()],
      );
      await this.db.query(
        'INSERT INTO stored_file_prescription (storedFileId, prescriptionId, createdAt) VALUES (?, ?, ?)',
        [storedFileId, pId, new Date()],
      );
    }

    if (data.labTestName && data.labId) {
      await this.db.query(
        'INSERT INTO testrequest (id, patientId, hospitalId, doctorId, testType, status, priority, referringHospitalId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), data.patientId, data.labId, doctor.id, data.labTestName, 'Pending', data.labTestPriority || 'Normal', doctor.hospitalId, new Date(), new Date()]
      );

      const h = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [doctor.hospitalId]);
      await this.db.query(
        'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, true, ?, ?)',
          [uuidv4(), data.labId, 'Request', 'New Lab Test Request', `Dr. ${doctor.name.replace(/^(Dr\.?\s*)+/i, '')} from ${h?.name || 'Clinic'} has requested a ${data.labTestName}.`, new Date(), new Date()]
      );
    }

    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [data.patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
          [uuidv4(), userForNotif.id, 'PRESCRIPTION', 'New Prescription Added', `Dr. ${doctor.name.replace(/^(Dr\.?\s*)+/i, '')} has added a new prescription for ${data.medicine}.`, new Date(), new Date()]
        );
      }
    }

    await this.redisService.del(`clinic:overview:v3:${doctor.id}`);
    return { id: pId };
  }

  async getPrescriptionImage(id: string) {
    const doctor = await this.getDoctorContext();
    const image = await this.db.queryOne(
      `SELECT sf.fileName, sf.mimeType, sf.sizeBytes, sf.content
       FROM prescription p
       INNER JOIN stored_file_prescription sfp ON sfp.prescriptionId = p.id
       INNER JOIN stored_file sf ON sf.id = sfp.storedFileId
       WHERE p.id = ? AND p.doctorId = ?
       LIMIT 1`,
      [id, doctor.id],
    );
    if (!image) throw new NotFoundException('Prescription image not found');
    return image;
  }

  private hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
    if (!buffer?.length) return false;
    if (mimeType === 'image/jpeg') {
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }
    if (mimeType === 'image/png') {
      return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }
    if (mimeType === 'image/webp') {
      return buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    }
    return false;
  }

  private async insertPrescriptionWithRxId(data: any, doctor: any): Promise<string> {
    // Real prescription books use controlled serial numbers, not random IDs.
    // Lock the single sequence row so concurrent requests receive consecutive,
      // unique RX-prefixed identifiers.
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const [sequenceRows]: any = await connection.execute(
        `SELECT nextValue FROM prescription_id_sequence
         WHERE sequenceName = 'prescription' FOR UPDATE`,
      );
      if (!sequenceRows.length) {
        throw new Error('Prescription ID sequence is not initialized.');
      }

      let nextValue = Number(sequenceRows[0].nextValue);
      while (nextValue <= 99999) {
        const id = `RX${String(nextValue).padStart(5, '0')}`;
        try {
          await connection.execute(
            'INSERT INTO prescription (id, patientId, doctorId, hospitalId, medicine, dosage, duration, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, data.patientId, doctor.id, doctor.hospitalId, data.medicine, data.dosage, data.duration, data.status || 'Active', new Date(), new Date()],
          );
          await connection.execute(
            `UPDATE prescription_id_sequence SET nextValue = ?, updatedAt = ?
             WHERE sequenceName = 'prescription'`,
            [nextValue + 1, new Date()],
          );
          await connection.commit();
          return id;
        } catch (error: any) {
          if (error?.code !== 'ER_DUP_ENTRY') throw error;
          nextValue += 1;
        }
      }
      throw new Error('The five-digit prescription ID range is exhausted.');
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updatePrescription(id: string, data: any) {
    const doctor = await this.getDoctorContext();
    const rx = await this.db.queryOne('SELECT * FROM prescription WHERE id = ? AND doctorId = ?', [id, doctor.id]);
    if (!rx) throw new NotFoundException('Prescription not found');

    await this.db.query('UPDATE prescription SET medicine = ?, dosage = ?, duration = ?, status = ? WHERE id = ?', [data.medicine, data.dosage, data.duration, data.status, id]);
    return { success: true };
  }

  async deletePrescription(id: string) {
    const doctor = await this.getDoctorContext();
    const file = await this.db.queryOne(
      `SELECT sfp.storedFileId FROM stored_file_prescription sfp
       INNER JOIN prescription p ON p.id = sfp.prescriptionId
       WHERE p.id = ? AND p.doctorId = ? LIMIT 1`,
      [id, doctor.id],
    );
    await this.db.query('DELETE FROM prescription WHERE id = ? AND doctorId = ?', [id, doctor.id]);
    if (file?.storedFileId) await this.db.query('DELETE FROM stored_file WHERE id = ?', [file.storedFileId]);
    return { success: true };
  }

  async getReports() {
    await this.getDoctorContext();
    const linkedPatients = await this.getMyPatients();
    const pIds = Array.from(new Set(linkedPatients.map((patient: any) => patient.id)));
    if (pIds.length === 0) return [];

    const placeholders = pIds.map(() => '?').join(',');
    const records = await this.db.query(`
      SELECT m.*, p.name as patientName 
      FROM medicalrecord m
      LEFT JOIN patient p ON m.patientId = p.id
      WHERE m.patientId IN (${placeholders})
      ORDER BY m.date DESC
    `, pIds);

    return records.map(r => ({
      id: r.id,
      patientName: r.patientName,
      patientId: r.patientId,
      title: String(r.type).toUpperCase() === 'PRESCRIPTION' ? formatPrescriptionId(r.title || r.id) : r.title,
      category: r.type,
      date: new Date(r.date).toLocaleDateString(),
      size: 'Unknown',
      status: 'Read',
      fileUrl: r.fileUrl
    }));
  }

  async getReceivedLabReports() {
    const doctor = await this.getDoctorContext();
    // Use the doctor's hospitalId (the clinic's ID) to find lab reports assigned to this clinic
    const records = await this.db.query(`
      SELECT m.*, p.name as patientName, p.phone as patientPhone 
      FROM medicalrecord m
      LEFT JOIN patient p ON m.patientId = p.id
      WHERE m.hospitalId = ? AND m.type = 'LAB_REPORT' AND m.description LIKE 'From %'
      ORDER BY m.date DESC
    `, [doctor.hospitalId]);

    return records.map(r => {
      let labName = 'Unknown Lab';
      if (r.description && r.description.startsWith('From ')) {
        labName = r.description.substring(5).split(':')[0];
      }
      
      return {
        id: r.id,
        patientId: r.patientId,
        patientName: r.patientName,
        patientPhone: r.patientPhone,
        testName: r.title,
        labName: labName,
        date: new Date(r.date).toLocaleDateString(),
        fileUrl: r.fileUrl
      };
    });
  }

  async createReport(data: any) {
    const doctor = await this.getDoctorContext();
    const rId = uuidv4();
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, hospitalId, title, type, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [rId, data.patientId, doctor.hospitalId, data.title, data.category, data.fileUrl || "", new Date(), new Date()]
    );

    // Fetch hospital name for notification
    const hospital = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [doctor.hospitalId]);
    const hospitalName = hospital ? hospital.name : 'Clinic';

    // Add Notification
    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [data.patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
          [uuidv4(), userForNotif.id, 'REPORT', 'New Report Uploaded', `${hospitalName} has uploaded a new report: ${data.title}`, new Date(), new Date()]
        );
      }
    }

    return { id: rId };
  }

  async getNotifications() {
    const doctor = await this.getDoctorContext();
    if (!doctor.hospitalId) return [];
    
    const notifs = await this.db.query('SELECT * FROM notification WHERE hospitalId = ? ORDER BY createdAt DESC', [doctor.hospitalId]);
    return notifs.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: new Date(n.createdAt).toISOString(),
      type: n.type,
      isRead: !!n.isRead,
      actionRequired: !!n.actionRequired
    }));
  }

  async markNotificationRead(id: string) {
    const doctor = await this.getDoctorContext();
    await this.db.query('UPDATE notification SET isRead = true WHERE id = ? AND hospitalId = ?', [id, doctor.hospitalId]);
    return { success: true };
  }

  async markAllNotificationsRead() {
    const doctor = await this.getDoctorContext();
    if (!doctor.hospitalId) return { success: false };
    await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId = ? AND isRead = false', [doctor.hospitalId]);
    return { success: true };
  }

  async deleteNotification(id: string) {
    const doctor = await this.getDoctorContext();
    await this.db.query('DELETE FROM notification WHERE id = ? AND hospitalId = ?', [id, doctor.hospitalId]);
    return { success: true };
  }

  async getProfile() {
    const doctor = await this.getDoctorContext();
    const h = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [doctor.hospitalId]);
    const logo = await this.db.queryOne('SELECT value FROM setting WHERE `key` = ?', [`clinic_logo_${doctor.id}`]);

    return {
      name: doctor.name,
      specialization: doctor.specialization,
      department: doctor.department || "Not Specified",
      hospital: h?.name || "Not Assigned",
      registrationNo: doctor.registrationNo || "N/A",
      email: doctor.email || "",
      phone: doctor.phone || "",
      experience: doctor.experience || "0 Years",
      bio: doctor.bio || "No bio available.",
      address: doctor.address || "No address provided.",
      logoUrl: logo?.value || ""
    };
  }

  async updateProfile(data: any) {
    const doctor = await this.getDoctorContext();
    await this.db.query(
      'UPDATE doctor SET name = ?, specialization = ?, department = ?, registrationNo = ?, email = ?, phone = ?, experience = ?, bio = ?, address = ? WHERE id = ?',
      [data.name, data.specialization, data.department, data.registrationNo, data.email, data.phone, data.experience, data.bio, data.address, doctor.id]
    );
    return { success: true };
  }

  async uploadProfileLogo(file?: Express.Multer.File) {
    if (!file) throw new NotFoundException('Please select an image to upload.');
    const doctor = await this.getDoctorContext();
    const logoUrl = `/uploads/${file.filename}`;
    await this.db.query(
      'INSERT INTO setting (`key`, value, updatedAt) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE value = VALUES(value), updatedAt = NOW()',
      [`clinic_logo_${doctor.id}`, logoUrl],
    );
    return { logoUrl };
  }
}
