import { Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';

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
    const doctor = await this.db.queryOne('SELECT * FROM doctor WHERE email = ?', [email]);
    if (!doctor) throw new UnauthorizedException('No clinic workspace is linked to this identity.');
    return doctor;
  }

  async getOverview() {
    const doctor = await this.getDoctorContext();
    const cacheKey = `clinic:overview:${doctor.id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const currentMonth = new Date().getMonth();

    const appts = await this.db.query('SELECT * FROM appointment WHERE doctorId = ?', [doctor.id]);
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAppointments = appts.filter(a => new Date(a.dateTime).toISOString().startsWith(todayStr)).length;
    const pendingAppointments = appts.filter(a => a.status === 'SCHEDULED' && new Date(a.dateTime) >= new Date()).length;
    
    // Total Patients
    const cpRows = await this.db.query('SELECT id FROM clinic_patient WHERE doctorId = ?', [doctor.id]);
    let totalPatients = cpRows.length;
    if (totalPatients === 0) {
      const pMap = new Set();
      appts.forEach(a => pMap.add(a.patientId));
      const reqs = await this.db.query('SELECT patientId FROM accessrequest WHERE doctorId = ?', [doctor.id]);
      reqs.forEach(r => pMap.add(r.patientId));
      totalPatients = pMap.size;
    }

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

    const todayAppts = await this.db.query(`
      SELECT a.*, p.name as patientName 
      FROM appointment a
      LEFT JOIN patient p ON a.patientId = p.id
      WHERE a.doctorId = ? AND DATE(a.dateTime) = ?
      ORDER BY a.dateTime ASC LIMIT 5
    `, [doctor.id, todayStr]);

    const allPatients = await this.getPatients();
    const recentPatients = allPatients.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      condition: p.diagnosis || 'General',
      age: p.age || 0,
      last_visit: p.lastVisit === 'N/A' ? new Date().toISOString() : new Date(p.lastVisit).toISOString()
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
      appointments: todayAppts.map(a => ({
        id: a.id,
        patientName: a.patientName,
        time: new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: a.type || 'Consultation',
        status: a.status
      })),
      recentPatients,
      activePatients: activePatients.map(r => ({
        id: r.id,
        name: r.hospitalPatientName || r.patientName,
        condition: r.admissionInfo || 'Under Observation',
        ward: r.hospitalName || 'General Ward',
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
    const rows = await this.db.query('SELECT * FROM clinic_patient WHERE doctorId = ? ORDER BY createdAt DESC', [doctor.id]);
    return rows;
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
    const id = this.generatePatientId(data.name, data.phone, year);
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
    await this.redisService.del(`clinic:patients:${doctor.id}`);
    await this.redisService.del(`clinic:overview:${doctor.id}`);
    return { success: true, id };
  }

  async updateMyPatient(id: string, data: any) {
    const doctor = await this.getDoctorContext();
    await this.db.query(
      'UPDATE clinic_patient SET name = ?, age = ?, gender = ?, bloodGroup = ?, diagnosis = ?, followUp = ?, status = ?, updatedAt = ? WHERE id = ? AND doctorId = ?',
      [
        data.name, data.age, data.gender, data.bloodGroup, data.diagnosis || 'Pending',
        data.followUp ? new Date(data.followUp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not scheduled',
        data.status, new Date(), id, doctor.id
      ]
    );
    await this.redisService.del(`clinic:patients:${doctor.id}`);
    return { success: true };
  }

  async getPatients() {
    const doctor = await this.getDoctorContext();
    const cacheKey = `clinic:patients:${doctor.id}`;
    const cached = await this.redisService.get<any[]>(cacheKey);
    if (cached) return cached;

    const appts = await this.db.query('SELECT patientId FROM appointment WHERE doctorId = ?', [doctor.id]);
    const reqs = await this.db.query('SELECT patientId FROM accessrequest WHERE doctorId = ?', [doctor.id]);

    const pIds = Array.from(new Set([...appts.map(a => a.patientId), ...reqs.map(r => r.patientId)]));
    const patients: any[] = [];

    for (const pid of pIds) {
      const p = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [pid]);
      if (p) {
        const lastAppt = await this.db.queryOne('SELECT dateTime FROM appointment WHERE doctorId = ? AND patientId = ? AND status = "COMPLETED" ORDER BY dateTime DESC LIMIT 1', [doctor.id, p.id]);
        
        let status = 'Not Requested';
        let validTill = '';
        const accessReq = await this.db.queryOne('SELECT id, status, duration, updatedAt FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [doctor.hospitalId, p.id]);
        if (accessReq) {
          if (accessReq.status === 'APPROVED') {
            let isExpired = false;
            if (accessReq.duration !== 'Until Patient Revokes' && accessReq.updatedAt) {
              const now = new Date().getTime();
              const approvedAt = new Date(accessReq.updatedAt).getTime();
              const hoursPassed = (now - approvedAt) / (1000 * 60 * 60);
              let expiryHours = 0;
              if (accessReq.duration === '24 Hours') expiryHours = 24;
              else if (accessReq.duration === '7 Days') expiryHours = 24 * 7;
              else if (accessReq.duration === '30 Days') expiryHours = 24 * 30;

              if (expiryHours > 0 && hoursPassed > expiryHours) {
                isExpired = true;
              } else if (expiryHours > 0) {
                const expiryDate = new Date(approvedAt + expiryHours * 60 * 60 * 1000);
                validTill = expiryDate.toLocaleDateString() + ' ' + expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            } else if (accessReq.duration === 'Until Patient Revokes') {
              validTill = 'Until Revoked';
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
          else if (accessReq.status === 'EXPIRED') status = 'Expired';
        }

        patients.push({
          id: p.id,
          name: p.name,
          age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 35,
          gender: p.gender || 'Unknown',
          phone: p.phone || 'N/A',
          lastVisit: lastAppt ? new Date(lastAppt.dateTime).toLocaleDateString() : 'N/A',
          bloodGroup: p.bloodGroup || 'N/A',
          status,
          accessValidTill: validTill
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
      const accessReq = await this.db.queryOne('SELECT id, status, duration, updatedAt FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [doctor.hospitalId, p.id]);
      if (accessReq) {
        if (accessReq.status === 'APPROVED') {
          let isExpired = false;
          if (accessReq.duration !== 'Until Patient Revokes' && accessReq.updatedAt) {
            const now = new Date().getTime();
            const approvedAt = new Date(accessReq.updatedAt).getTime();
            const hoursPassed = (now - approvedAt) / (1000 * 60 * 60);
            let expiryHours = 0;
            if (accessReq.duration === '24 Hours') expiryHours = 24;
            else if (accessReq.duration === '7 Days') expiryHours = 24 * 7;
            else if (accessReq.duration === '30 Days') expiryHours = 24 * 30;

            if (expiryHours > 0 && hoursPassed > expiryHours) {
              isExpired = true;
            } else if (expiryHours > 0) {
              const expiryDate = new Date(approvedAt + expiryHours * 60 * 60 * 1000);
              validTill = expiryDate.toLocaleDateString() + ' ' + expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
          } else if (accessReq.duration === 'Until Patient Revokes') {
            validTill = 'Until Revoked';
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
        else if (accessReq.status === 'EXPIRED') status = 'Expired';
      }

      result.push({
        id: p.id,
        name: p.name,
        phone: p.phone,
        email: p.email,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 35,
        gender: p.gender || 'Unknown',
        bloodGroup: p.bloodGroup || 'N/A',
        status,
        accessValidTill: validTill
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
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 35,
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
        id: r.id,
        medicine: r.medicine,
        date: new Date(r.createdAt).toLocaleDateString(),
        status: r.status
      })),
      records: recs.map(r => ({
        id: r.id,
        title: r.title,
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

        const message = `Dr. ${doctor.name} from ${hospitalName} has requested access to your medical records.\n\nRequested Reports:\n${requestedReportsString}\n\nReason:\n${reason}\n\nStatus: Pending\n\n${dateStr} • ${timeStr}`;

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
    if (access.duration !== 'Until Patient Revokes' && access.updatedAt) {
      const now = new Date().getTime();
      const approvedAt = new Date(access.updatedAt).getTime();
      const hoursPassed = (now - approvedAt) / (1000 * 60 * 60);
      if (access.duration === '24 Hours' && hoursPassed > 24) {
        await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', access.id]);
        throw new UnauthorizedException("Your access request has expired (24 Hours). Please request access again.");
      }
      if (access.duration === '7 Days' && hoursPassed > (24 * 7)) {
        await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', access.id]);
        throw new UnauthorizedException("Your access request has expired (7 Days). Please request access again.");
      }
    }

    let reports = await this.db.query('SELECT * FROM medicalrecord WHERE patientId = ? ORDER BY date DESC', [patientId]);
    
    // Filter by Report Types
    const approvedTypes: string[] = access.reportTypes ? access.reportTypes.split(',').map((t: string) => t.trim()) : [];
    if (!approvedTypes.includes('All Reports')) {
      reports = reports.filter((r: any) => {
        return approvedTypes.some(type => 
          r.title.toLowerCase().includes(type.toLowerCase()) || 
          r.type.toLowerCase().includes(type.toLowerCase())
        );
      });
    }

    return reports;
  }

  async getAllLabs() {
    return this.db.query('SELECT id, name, address FROM hospital WHERE type = "Laboratory" AND status = "Active"');
  }

  async getPrescriptions() {
    const doctor = await this.getDoctorContext();
    const rxs = await this.db.query(`
      SELECT r.*, p.name as patientName 
      FROM prescription r
      LEFT JOIN patient p ON r.patientId = p.id
      WHERE r.doctorId = ?
      ORDER BY r.createdAt DESC
    `, [doctor.id]);

    return rxs.map(rx => ({
      id: rx.id,
      patientName: rx.patientName,
      patientId: rx.patientId,
      medicine: rx.medicine,
      dosage: rx.dosage,
      duration: rx.duration,
      date: new Date(rx.createdAt).toLocaleDateString(),
      status: rx.status
    }));
  }

  async createPrescription(data: any) {
    const doctor = await this.getDoctorContext();
    const pId = uuidv4();
    await this.db.query(
      'INSERT INTO prescription (id, patientId, doctorId, hospitalId, medicine, dosage, duration, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pId, data.patientId, doctor.id, doctor.hospitalId, data.medicine, data.dosage, data.duration, data.status || 'Active', new Date(), new Date()]
    );

    if (data.labTestName && data.labId) {
      await this.db.query(
        'INSERT INTO testrequest (id, patientId, hospitalId, doctorId, testType, status, priority, referringHospitalId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), data.patientId, data.labId, doctor.id, data.labTestName, 'Pending', data.labTestPriority || 'Normal', doctor.hospitalId, new Date(), new Date()]
      );

      const h = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [doctor.hospitalId]);
      await this.db.query(
        'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, true, ?, ?)',
        [uuidv4(), data.labId, 'Request', 'New Lab Test Request', `Dr. ${doctor.name} from ${h?.name || 'Clinic'} has requested a ${data.labTestName}.`, new Date(), new Date()]
      );
    }

    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [data.patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
          [uuidv4(), userForNotif.id, 'PRESCRIPTION', 'New Prescription Added', `Dr. ${doctor.name} has added a new prescription for ${data.medicine}.`, new Date(), new Date()]
        );
      }
    }

    await this.redisService.del(`clinic:overview:${doctor.id}`);
    return { id: pId };
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
    await this.db.query('DELETE FROM prescription WHERE id = ? AND doctorId = ?', [id, doctor.id]);
    return { success: true };
  }

  async getReports() {
    const doctor = await this.getDoctorContext();
    const appts = await this.db.query('SELECT patientId FROM appointment WHERE doctorId = ?', [doctor.id]);
    const reqs = await this.db.query('SELECT patientId FROM accessrequest WHERE doctorId = ?', [doctor.id]);

    const pIds = Array.from(new Set([...appts.map(a => a.patientId), ...reqs.map(r => r.patientId)]));
    if (pIds.length === 0) return [];

    const pIdsStr = pIds.map(id => `'${id}'`).join(',');
    const records = await this.db.query(`
      SELECT m.*, p.name as patientName 
      FROM medicalrecord m
      LEFT JOIN patient p ON m.patientId = p.id
      WHERE m.patientId IN (${pIdsStr})
      ORDER BY m.date DESC
    `);

    return records.map(r => ({
      id: r.id,
      patientName: r.patientName,
      patientId: r.patientId,
      title: r.title,
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
