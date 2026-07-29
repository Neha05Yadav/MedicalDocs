import { Injectable, NotFoundException, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';
import { formatPrescriptionId, formatPrescriptionRecord } from '../prescription-id';

@Injectable()
export class HospitalService {
  constructor(
    private db: MysqlService,
    private redisService: RedisService,
  ) {}

  private async getHospitalByEmail(userEmail: string) {
    // Resolve the account's explicit tenant first. Email-only matching is a
    // compatibility fallback because historical imports can contain duplicate
    // facilities with the same email.
    let hospital: any = null;
    const user = await this.db.queryOne('SELECT hospitalId FROM user WHERE email = ?', [userEmail]);
    if (user?.hospitalId) {
      hospital = await this.db.queryOne('SELECT * FROM hospital WHERE id = ? AND type = "HOSPITAL"', [user.hospitalId]);
    }
    if (!hospital) {
      hospital = await this.db.queryOne(
        'SELECT * FROM hospital WHERE LOWER(email) = LOWER(?) AND type = "HOSPITAL" ORDER BY isVerified DESC, updatedAt DESC LIMIT 1',
        [userEmail],
      );
    }
    if (!hospital) throw new UnauthorizedException('No hospital workspace is linked to this identity.');
    return hospital;
  }

  private generatePatientId(name: string, phone: string, year: string) {
    const initials = name.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2);
    const safePhone = phone || '000';
    const last3Phone = safePhone.length >= 3 ? safePhone.slice(-3) : safePhone.padStart(3, '0');
    const last2Year = year.slice(-2);
    return `${initials}${last3Phone}${last2Year}`;
  }

  async getOverview(userEmail: string) {
    const cacheKey = `hospital:overview:${userEmail}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const hospital = await this.getHospitalByEmail(userEmail);

    const doctorsCountRow = await this.db.queryOne('SELECT COUNT(*) as c FROM doctor WHERE hospitalId = ?', [hospital.id]);
    const recordsCountRow = await this.db.queryOne('SELECT COUNT(*) as c FROM medicalrecord WHERE hospitalId = ?', [hospital.id]);
    
    // patientsCount (from medicalrecord OR accessrequest)
    const patientsCountRow = await this.db.queryOne(`
      SELECT COUNT(DISTINCT patientId) as c FROM (
        SELECT patientId FROM medicalrecord WHERE hospitalId = ?
        UNION
        SELECT patientId FROM accessrequest WHERE hospitalId = ?
      ) as p
    `, [hospital.id, hospital.id]);

    const distinctDeptsRow = await this.db.query(`SELECT DISTINCT specialization FROM doctor WHERE hospitalId = ?`, [hospital.id]);
    
    const requests = await this.db.query(`
      SELECT r.*, p.name as patientName, p.phone as patientPhone, d.specialization as doctorSpec, d.name as doctorName 
      FROM accessrequest r
      LEFT JOIN patient p ON r.patientId = p.id
      LEFT JOIN doctor d ON r.doctorId = d.id
      WHERE r.hospitalId = ?
      ORDER BY r.requestDate DESC LIMIT 5
    `, [hospital.id]);

    const activePatients = requests.map(req => ({
        id: req.id,
        patientId: req.patientId,
        name: req.hospitalPatientName || req.patientName,
        mobile: req.hospitalPatientMobile || req.patientPhone,
        admissionInfo: req.admissionInfo || '',
        department: req.doctorSpec || 'Not assigned',
        doctorId: req.doctorId,
        doctor: req.doctorName || 'Not assigned',
        status: req.status === 'APPROVED' ? 'Access approved' : req.status
    }));

    const reportRows = await this.db.query(`
      SELECT DATE(date) AS reportDate, COUNT(*) AS reports
      FROM medicalrecord
      WHERE hospitalId = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(date)
    `, [hospital.id]);
    const localDateKey = (value: any) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
    const reportsByDate = new Map(reportRows.map(row => [localDateKey(row.reportDate), Number(row.reports)]));
    const reportStats = Array.from({ length: 7 }, (_, offset) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - offset));
      const key = localDateKey(date);
      return { name: date.toLocaleDateString('en-US', { weekday: 'short' }), reports: reportsByDate.get(key) || 0 };
    });

    const deptStatsRow = await this.db.query(`
      SELECT d.specialization as name, COUNT(DISTINCT d.id) as doctors, COUNT(a.id) as patients,
        SUM(CASE WHEN a.dateTime >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END) AS currentWeek,
        SUM(CASE WHEN a.dateTime >= DATE_SUB(CURDATE(), INTERVAL 13 DAY) AND a.dateTime < DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END) AS previousWeek
      FROM doctor d
      LEFT JOIN appointment a ON d.id = a.doctorId
      WHERE d.hospitalId = ?
      GROUP BY d.specialization
    `, [hospital.id]);
    
    const departmentsData = deptStatsRow.map(row => ({
      name: row.name,
      doctors: Number(row.doctors),
      patients: Number(row.patients),
      trend: Number(row.previousWeek) === 0 ? (Number(row.currentWeek) === 0 ? '0%' : 'New') : `${Number(row.currentWeek) >= Number(row.previousWeek) ? '+' : ''}${Math.round(((Number(row.currentWeek) - Number(row.previousWeek)) / Number(row.previousWeek)) * 100)}%`
    }));

    const result = {
        totalDoctors: doctorsCountRow ? Number(doctorsCountRow.c) : 0,
        totalPatients: patientsCountRow ? Number(patientsCountRow.c) : 0,
        reportsUploaded: recordsCountRow ? Number(recordsCountRow.c) : 0,
        totalDepartments: distinctDeptsRow.length,
        activePatients: activePatients,
        reportStats,
        departments: departmentsData
    };
    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async addTreatmentPatient(userEmail: string, data: any) {
    const hospital = await this.getHospitalByEmail(userEmail);
    
    let patient;
    if (data.patientId && data.patientId.trim() !== '') {
        patient = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [data.patientId]);
    } else {
        patient = await this.db.queryOne('SELECT * FROM patient WHERE phone = ?', [data.mobile]);
    }
    
    if (!patient) {
        const year = new Date().getFullYear().toString();
        const pId = (data.patientId && data.patientId.trim() !== '') ? data.patientId : this.generatePatientId(data.name, data.mobile, year);
        await this.db.query('INSERT INTO patient (id, name, phone, updatedAt) VALUES (?, ?, ?, ?)', [pId, data.name, data.mobile, new Date()]);
        patient = { id: pId };
    }

    await this.db.query(
      'INSERT INTO accessrequest (id, patientId, doctorId, hospitalId, status, hospitalPatientName, hospitalPatientMobile, updatedAt, requestDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), patient.id, data.doctorId || null, hospital.id, 'APPROVED', data.name, data.mobile, new Date(), new Date(), new Date()]
    );

    return { success: true, message: "Patient added to treatment queue" };
  }

  async updateTreatmentPatient(userEmail: string, data: any) {
    if (!data.id) throw new Error("Missing access request ID");
    await this.db.query(
      'UPDATE accessrequest SET doctorId = ?, hospitalPatientName = ?, hospitalPatientMobile = ?, admissionInfo = ? WHERE id = ?',
      [data.doctorId || null, data.name, data.mobile, data.admissionInfo, data.id]
    );
    return { success: true, message: "Patient updated successfully" };
  }

  async getDoctors(userEmail: string) {
    const cacheKey = `hospital:doctors:${userEmail}`;
    const cached = await this.redisService.get(cacheKey);
    // if (cached) return cached;

    const hospital = await this.getHospitalByEmail(userEmail);
    const doctors = await this.db.query('SELECT * FROM doctor WHERE hospitalId = ? ORDER BY name ASC', [hospital.id]);
    
    const result = await Promise.all(doctors.map(async d => {
      const activePatientsRow = await this.db.queryOne('SELECT COUNT(DISTINCT patientId) as c FROM accessrequest WHERE doctorId = ? AND hospitalId = ?', [d.id, hospital.id]);
      const activePatients = activePatientsRow ? Number(activePatientsRow.c) : 0;

      return {
        id: d.id,
        name: d.name,
        specialty: d.specialization,
        department: d.specialization || "General",
        email: d.email || `${d.name.toLowerCase().replace(' ', '')}@hospital.com`,
        phone: d.phone,
        status: d.status,
        patientsCount: activePatients,
        patients: activePatients,
        shift: d.shift || '09:00 AM - 05:00 PM',
        rating: 4.8
      };
    }));
    
    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async addDoctor(userEmail: string, data: any) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const doctorId = uuidv4();
    await this.db.query(
      'INSERT INTO doctor (id, name, specialization, phone, email, status, hospitalId, updatedAt, shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [doctorId, data.name, data.department || data.specialty || 'General', data.phone || '', data.email || '', data.status || 'Active', hospital.id, new Date(), data.shift || '09:00 AM - 05:00 PM']
    );
    await this.redisService.del(`hospital:doctors:${userEmail}`);
    await this.redisService.del(`hospital:overview:${userEmail}`);
    return { success: true, message: "Doctor added successfully", doctor: { id: doctorId } };
  }

  async updateDoctor(userEmail: string, id: string, data: any) {
    const hospital = await this.getHospitalByEmail(userEmail);
    await this.db.query(
      'UPDATE doctor SET name = ?, specialization = ?, phone = ?, email = ?, status = ?, shift = ? WHERE id = ? AND hospitalId = ?',
      [data.name, data.department || data.specialty, data.phone || '', data.email || '', data.status, data.shift || '09:00 AM - 05:00 PM', id, hospital.id]
    );
    await this.redisService.del(`hospital:doctors:${userEmail}`);
    return { success: true, message: "Doctor updated successfully" };
  }

  async deleteDoctor(userEmail: string, id: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    await this.db.query(
      'DELETE FROM doctor WHERE id = ? AND hospitalId = ?',
      [id, hospital.id],
    );
    await this.redisService.del(`hospital:doctors:${userEmail}`);
    await this.redisService.del(`hospital:overview:${userEmail}`);
    return { success: true, message: "Doctor deleted successfully" };
  }

  async searchPatients(userEmail: string, query: string) {
    if (!query || query.length < 2) return [];
    const hospital = await this.getHospitalByEmail(userEmail);
    
    const patients = await this.db.query(
      `SELECT * FROM patient WHERE id LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ? LIMIT 10`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    const result: any[] = [];
    for (const p of patients) {
      const recordsCountRow = await this.db.queryOne('SELECT COUNT(*) as c FROM medicalrecord WHERE patientId = ?', [p.id]);
      
      let status = 'Not Requested';
      let validTill = '';
      let accessExpiresAt: string | null = null;
      const accessReq = await this.db.queryOne('SELECT id, status, duration, updatedAt FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [hospital.id, p.id]);
      if (accessReq) {
        if (accessReq.status === 'APPROVED') {
          const approvedAt = accessReq.updatedAt ? new Date(accessReq.updatedAt).getTime() : 0;
          const expiryDate = new Date(approvedAt + 24 * 60 * 60 * 1000);
          const isExpired = !approvedAt || Date.now() >= expiryDate.getTime();

          if (isExpired) {
            await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', accessReq.id]);
            status = 'Expired';
          } else {
            status = 'Access Approved';
            accessExpiresAt = expiryDate.toISOString();
            validTill = expiryDate.toLocaleDateString() + ' ' + expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
        else if (accessReq.status === 'PENDING') status = 'Pending';
        else if (accessReq.status === 'REJECTED') status = 'Rejected';
        else if (accessReq.status === 'EXPIRED') status = 'Expired';
      }

      result.push({
        id: p.id,
        name: p.name,
        email: p.email || 'N/A',
        mobile: p.phone || 'N/A',
        bloodGroup: p.bloodGroup || 'N/A',
        gender: p.gender || 'N/A',
        dob: p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        regDate: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        status: status,
        availableRecords: recordsCountRow ? Number(recordsCountRow.c) : 0,
        accessValidTill: validTill,
        accessExpiresAt,
        department: 'General',
        verifiedOn: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        verifiedBy: 'System'
      });
    }

    return result;
  }

  async createAccessRequest(userEmail: string, patientId: string, doctorId: string, reportTypes: string, reason: string, priority: string, duration: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const accessDuration = '24 Hours';
    const requestedTypes = String(reportTypes || '').split(',').map(type => type.trim()).filter(Boolean);
    if (!requestedTypes.length) throw new BadRequestException('Select at least one report type.');
    if (requestedTypes.some(type => type.toLowerCase() === 'other')) {
      throw new BadRequestException('Enter the exact report name instead of Other.');
    }
    const normalizedReportTypes = requestedTypes.join(', ');
    const existing = await this.db.queryOne('SELECT * FROM accessrequest WHERE hospitalId = ? AND patientId = ?', [hospital.id, patientId]);
    if (existing) {
      await this.db.query('UPDATE accessrequest SET doctorId = ?, status = ?, requestDate = ?, updatedAt = ?, reportTypes = ?, reason = ?, priority = ?, duration = ? WHERE id = ?', 
        [doctorId, 'PENDING', new Date(), new Date(), normalizedReportTypes, reason, priority, accessDuration, existing.id]);
    } else {
      await this.db.query(
        'INSERT INTO accessrequest (id, patientId, hospitalId, doctorId, status, updatedAt, requestDate, createdAt, reportTypes, reason, priority, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), patientId, hospital.id, doctorId, 'PENDING', new Date(), new Date(), new Date(), normalizedReportTypes, reason, priority, accessDuration]
      );
    }
    
    // Auto-create notification
    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        const doc = await this.db.queryOne('SELECT name FROM doctor WHERE id = ?', [doctorId]);
        const doctorName = doc ? doc.name : 'Unknown Doctor';
        
        const requestedReportsString = (reportTypes === 'All Reports' || reportTypes.includes('All Reports'))
          ? 'All Medical Reports' 
          : reportTypes.split(',').map((r: string) => `• ${r.trim()}`).join('\n');
          
        const dateStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const message = `Dr. ${doctorName.replace(/^(Dr\.?\s*)+/i, '')} from ${hospital.name} has requested access to your medical records.\n\nRequested Reports:\n${requestedReportsString}\n\nReason:\n${reason}\n\nStatus: Pending\n\n${dateStr} • ${timeStr}`;

        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), userForNotif.id, 'ACCESS_REQUEST', 'New Access Request', message, false, true, new Date(), new Date()]
        );
      }
    }
    
    return { success: true, message: "Access request created" };
  }

  async getPatientRecords(userEmail: string, patientId: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const access = await this.db.queryOne('SELECT * FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [hospital.id, patientId]);
    
    if (!access || access.status !== 'APPROVED') throw new ForbiddenException("You do not have an active approved request to view this patient's records.");

    const approvedAt = access.updatedAt ? new Date(access.updatedAt).getTime() : 0;
    if (!approvedAt || Date.now() >= approvedAt + 24 * 60 * 60 * 1000) {
      await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', access.id]);
      throw new ForbiddenException('Your 24-hour access has expired. Please request access again.');
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

    return reports.map(formatPrescriptionRecord);
  }

  async createLabRequest(userEmail: string, data: any) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const labId = data.labId;
    if (!labId) throw new BadRequestException("Lab ID is required");

    const requestId = uuidv4();
    await this.db.query(
      'INSERT INTO testrequest (id, patientId, hospitalId, testType, status, priority, doctorId, referringHospitalId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [requestId, data.patientId, labId, data.labTestName, 'Pending', data.priority || 'Normal', data.doctorId, hospital.id, new Date(), new Date()]
    );

    await this.db.query(
      'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), labId, `LAB_REQUEST|${hospital.id}`, "New Lab Request", `${hospital.name} has requested a ${data.labTestName} for patient ${data.patientId}.`, false, true, 'High', new Date(), new Date()]
    );
    return { success: true, message: "Lab request sent successfully" };
  }

  async getAllLabs() {
    return this.db.query('SELECT id, name FROM hospital WHERE type = "LABORATORY" OR type = "LAB"');
  }

  async getHospitalPatients(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const records = await this.db.query('SELECT DISTINCT patientId FROM medicalrecord WHERE hospitalId = ?', [hospital.id]);
    const accesses = await this.db.query('SELECT DISTINCT patientId FROM accessrequest WHERE hospitalId = ?', [hospital.id]);
    
    const pIds = new Set([...records.map(r => r.patientId), ...accesses.map(a => a.patientId)]);
    const patients: any[] = [];
    
    for (const pid of Array.from(pIds)) {
      const p = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [pid]);
      if (p) patients.push(p);
    }

    return Promise.all(patients.map(async p => {
      const recCount = await this.db.queryOne('SELECT COUNT(*) as count FROM medicalrecord WHERE patientId = ? AND hospitalId = ?', [p.id, hospital.id]);
      const recs = await this.db.query('SELECT type, date FROM medicalrecord WHERE patientId = ? AND hospitalId = ? ORDER BY date DESC LIMIT 1', [p.id, hospital.id]);
      
      let lastUploadDate = 'N/A';
      if (recs.length > 0) {
        lastUploadDate = new Date(recs[0].date).toLocaleDateString();
      }

      return {
        patientId: p.id,
        patientName: p.name,
        totalReports: Number(recCount?.count || 0),
        lastUploadDate
      };
    }));
  }

  async getReceivedLabReports(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    // Find medical records where type is LAB_REPORT and description indicates it came from a lab
    // The laboratory service uses description: `From ${hospital.name}: ${data.category || 'Lab Report'}`
    const records = await this.db.query(`
      SELECT m.*, p.name as patientName, p.phone as patientPhone 
      FROM medicalrecord m
      LEFT JOIN patient p ON m.patientId = p.id
      WHERE m.hospitalId = ? AND m.type = 'LAB_REPORT' AND m.description LIKE 'From %'
      ORDER BY m.date DESC
    `, [hospital.id]);

    return records.map(r => {
      // Extract lab name from description "From LabName: Category"
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

  async getPatientWithReports(userEmail: string, patientId: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const p = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [patientId]);
    if (!p) throw new NotFoundException("Patient not found");

    // Reports created or received by this hospital remain visible in its own
    // report workspace. Access approval is required only for records owned by
    // other providers.
    let reports = await this.db.query('SELECT * FROM medicalrecord WHERE patientId = ? AND hospitalId = ? ORDER BY date DESC', [patientId, hospital.id]);
    if (reports.length === 0) {
      const access = await this.db.queryOne('SELECT * FROM accessrequest WHERE hospitalId = ? AND patientId = ? ORDER BY updatedAt DESC LIMIT 1', [hospital.id, patientId]);
      if (!access || access.status !== 'APPROVED') throw new ForbiddenException("No hospital-owned reports were found, and there is no active patient approval.");
      const approvedAt = access.updatedAt ? new Date(access.updatedAt).getTime() : 0;
      if (!approvedAt || Date.now() >= approvedAt + 24 * 60 * 60 * 1000) {
        await this.db.query('UPDATE accessrequest SET status = ? WHERE id = ?', ['EXPIRED', access.id]);
        throw new ForbiddenException('Your 24-hour access has expired. Please request access again.');
      }
      reports = await this.db.query('SELECT * FROM medicalrecord WHERE patientId = ? ORDER BY date DESC', [patientId]);
      const approvedTypes: string[] = access.reportTypes ? access.reportTypes.split(',').map((type: string) => type.trim()) : [];
      if (!approvedTypes.includes('All Reports')) {
        reports = reports.filter((record: any) => approvedTypes.some(type =>
          String(record.title || '').toLowerCase().includes(type.toLowerCase()) ||
          String(record.type || '').toLowerCase().includes(type.toLowerCase()),
        ));
      }
    }

    const formatted = reports.map((r: any) => ({
      id: r.id,
      docName: String(r.type).toUpperCase() === 'PRESCRIPTION' ? formatPrescriptionId(r.title || r.id) : r.title,
      type: r.type,
      uploadDate: new Date(r.date).toLocaleDateString(),
      fileUrl: r.fileUrl
    }));

    const age = p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 'N/A';
    const gender = p.gender || 'Unknown';

    return {
      profile: {
        id: p.id,
        name: p.name,
        mobile: p.phone,
        ageGender: `${age} yrs, ${gender}`,
        lastVisit: formatted.length > 0 ? formatted[0].uploadDate : 'N/A',
        totalReports: formatted.length
      },
      reports: formatted
    };
  }

  async uploadNewPatientReport(userEmail: string, data: any, file?: Express.Multer.File) {
    const hospital = await this.getHospitalByEmail(userEmail);
    let patient = await this.db.queryOne('SELECT * FROM patient WHERE phone = ?', [data.patientPhone || data.patientMobile]);
    if (!patient) {
      const year = new Date().getFullYear().toString();
      const newId = this.generatePatientId(data.patientName, data.patientPhone || data.patientMobile, year);
      await this.db.query('INSERT INTO patient (id, name, phone, updatedAt) VALUES (?, ?, ?, ?)', [newId, data.patientName, data.patientPhone || data.patientMobile, new Date()]);
      patient = { id: newId };
    }
    const recId = uuidv4();
    const title = data.docName || data.reportName || 'New Report';
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, hospitalId, title, type, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [recId, patient.id, hospital.id, title, data.reportType || 'DOCUMENT', file?.filename || null, new Date(), new Date()]
    );
    
    // Add Notification
    const userForNotif = patient.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patient.email]) : 
                         (patient.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patient.phone]) : null);
    if (userForNotif) {
      await this.db.query(
        'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
        [uuidv4(), userForNotif.id, 'REPORT', 'New Report Uploaded', `${hospital.name} has uploaded a new report: ${title}`, new Date(), new Date()]
      );
    }

    return { success: true, message: "Report uploaded successfully for new patient" };
  }

  async uploadReportForPatient(userEmail: string, patientId: string, data: any, file?: Express.Multer.File) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const title = data.docName || data.reportName || 'Report';
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, hospitalId, title, type, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), patientId, hospital.id, title, data.reportType || 'DOCUMENT', file?.filename || null, new Date(), new Date()]
    );

    // Add Notification
    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
          [uuidv4(), userForNotif.id, 'REPORT', 'New Report Uploaded', `${hospital.name} has uploaded a new report: ${title}`, new Date(), new Date()]
        );
      }
    }

    return { success: true, message: "Report uploaded successfully" };
  }

  async getBillingPatients(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const requests = await this.db.query(`
      SELECT r.*, p.name as patientName, p.phone as patientPhone
      FROM accessrequest r
      LEFT JOIN patient p ON r.patientId = p.id
      WHERE r.hospitalId = ?
    `, [hospital.id]);

    const uniquePatients = new Map();
    for (const req of requests) {
      if (!uniquePatients.has(req.patientId)) {
        uniquePatients.set(req.patientId, {
          id: req.patientId,
          name: req.hospitalPatientName || req.patientName,
          phone: req.hospitalPatientMobile || req.patientPhone,
          lastVisit: new Date(req.requestDate).toLocaleDateString(),
          status: 'Admitted'
        });
      }
    }
    return Array.from(uniquePatients.values());
  }

  async getInvoices(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const invoices = await this.db.query(`
      SELECT i.*, p.name as patientName, p.phone as patientPhone 
      FROM invoice i
      LEFT JOIN patient p ON i.patientId = p.id
      WHERE i.hospitalId = ? ORDER BY i.date DESC
    `, [hospital.id]);

    return invoices.map(inv => ({
      id: inv.id,
      patientId: inv.patientId,
      patient: inv.patientName || 'Unknown',
      date: new Date(inv.date).toISOString().split('T')[0],
      amount: inv.totalAmount,
      status: inv.status,
      items: `Consultation${inv.testFee > 0 ? ' + Tests' : ''}`
    }));
  }

  async createInvoice(userEmail: string, data: any) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const invId = uuidv4();
    await this.db.query(
      'INSERT INTO invoice (id, patientId, hospitalId, consultationFee, testFee, totalAmount, status, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [invId, data.patientId, hospital.id, data.consultationFee || 0, data.testFee || 0, data.totalAmount, data.status, new Date(), new Date()]
    );

    await this.db.query(
      'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), hospital.id, 'System', 'New Invoice Generated', `An invoice of 1${data.totalAmount} was generated for patient ${data.patientId}.`, false, false, new Date(), new Date()]
    );

    const patientObj = await this.db.queryOne('SELECT * FROM patient WHERE id = ?', [data.patientId]);
    if (patientObj) {
      const userForNotif = patientObj.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patientObj.email]) : 
                           (patientObj.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patientObj.phone]) : null);
      if (userForNotif) {
        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
          [uuidv4(), userForNotif.id, 'INVOICE', 'New Invoice Generated', `${hospital.name} has generated a new invoice of 1${data.totalAmount} for you.`, new Date(), new Date()]
        );
      }
    }

    return { id: invId };
  }

  async getDepartments(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const doctors = await this.db.query('SELECT * FROM doctor WHERE hospitalId = ?', [hospital.id]);
    const totalReportsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM medicalrecord WHERE hospitalId = ?', [hospital.id]);
    const totalReports = totalReportsRow ? Number(totalReportsRow.c) : 0;

    const deptMap: Record<string, { doctors: number, patients: number, reports: number }> = {};
    let totalPatients = 0;

    for (const doc of doctors) {
      const deptName = doc.specialization;
      if (!deptMap[deptName]) deptMap[deptName] = { doctors: 0, patients: 0, reports: 0 };
      deptMap[deptName].doctors += 1;
      const apptCountRow = await this.db.queryOne('SELECT COUNT(*) as c FROM appointment WHERE doctorId = ?', [doc.id]);
      if (apptCountRow) {
        const count = Number(apptCountRow.c);
        deptMap[deptName].patients += count;
        totalPatients += count;
      }
    }

    const deptKeys = Object.keys(deptMap);
    if (deptKeys.length > 0 && totalReports > 0) {
      const reportsPerDept = Math.floor(totalReports / deptKeys.length);
      deptKeys.forEach(k => deptMap[k].reports = reportsPerDept);
      deptMap[deptKeys[0]].reports += totalReports % deptKeys.length;
    }

    const departmentsData = Object.keys(deptMap).map(k => ({
      name: k,
      doctors: deptMap[k].doctors,
      patients: deptMap[k].patients,
      reports: deptMap[k].reports
    }));

    return {
      kpiData: [
        { title: "Total Departments", value: departmentsData.length.toString(), subtitle: "All departments", type: "departments" },
        { title: "Total Doctors", value: doctors.length.toString(), subtitle: "Across all departments", type: "doctors" },
        { title: "Total Patients", value: totalPatients.toString(), subtitle: "Across all departments", type: "patients" },
        { title: "Reports Generated", value: totalReports.toString(), subtitle: "This month", type: "reports" },
      ],
      departmentsData
    };
  }

  async getNotifications(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const notifs = await this.db.query('SELECT * FROM notification WHERE hospitalId = ? ORDER BY createdAt DESC', [hospital.id]);

    return notifs.map(n => {
      const diffMs = new Date().getTime() - new Date(n.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      let timeStr = `${diffMins} mins ago`;
      if (diffMins > 60) timeStr = `${Math.floor(diffMins / 60)} hours ago`;
      if (diffMins > 1440) timeStr = `${Math.floor(diffMins / 1440)} days ago`;
      if (diffMins === 0) timeStr = "Just now";

      return {
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: timeStr,
        isRead: !!n.isRead,
        actionRequired: !!n.actionRequired
      };
    });
  }

  async markAllNotificationsAsRead(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId = ? AND isRead = false', [hospital.id]);
    return { success: true };
  }

  async markNotificationAsRead(userEmail: string, id: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    await this.db.query(
      'UPDATE notification SET isRead = true WHERE id = ? AND hospitalId = ?',
      [id, hospital.id],
    );
    return { success: true };
  }

  async deleteNotification(userEmail: string, id: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    await this.db.query(
      'DELETE FROM notification WHERE id = ? AND hospitalId = ?',
      [id, hospital.id],
    );
    return { success: true };
  }

  async getAnalytics(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const [patientRow, appointmentRow, priorAppointmentRow, totalReportsRow, priorReportsRow] = await Promise.all([
      this.db.queryOne(`SELECT COUNT(DISTINCT a.patientId) AS c FROM appointment a INNER JOIN doctor d ON d.id = a.doctorId WHERE d.hospitalId = ?`, [hospital.id]),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM appointment a INNER JOIN doctor d ON d.id = a.doctorId WHERE d.hospitalId = ? AND a.dateTime >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`, [hospital.id]),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM appointment a INNER JOIN doctor d ON d.id = a.doctorId WHERE d.hospitalId = ? AND a.dateTime >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND a.dateTime < DATE_FORMAT(CURDATE(), '%Y-%m-01')`, [hospital.id]),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM medicalrecord WHERE hospitalId = ? AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`, [hospital.id]),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM medicalrecord WHERE hospitalId = ? AND date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')`, [hospital.id]),
    ]);
    const totalPatients = Number(patientRow?.c || 0);
    const appointmentsThisMonth = Number(appointmentRow?.c || 0);
    const reportsThisMonth = Number(totalReportsRow?.c || 0);

    const deptRows = await this.db.query(`
      SELECT COALESCE(d.department, d.specialization, 'General') AS name, COUNT(a.id) AS value
      FROM doctor d LEFT JOIN appointment a ON a.doctorId = d.id
      WHERE d.hospitalId = ?
      GROUP BY COALESCE(d.department, d.specialization, 'General')
      ORDER BY value DESC
    `, [hospital.id]);

    const colors = ["#dc2626", "#7c3aed", "#d97706", "#0252d9", "#059669", "#ec4899", "#14b8a6"];
    const deptDistribution = deptRows.map((row, index) => ({
      name: row.name,
      value: Number(row.value),
      color: colors[index % colors.length]
    }));

    const appointmentMonths = await this.db.query(`
      SELECT DATE_FORMAT(a.dateTime, '%Y-%m') AS monthKey, COUNT(*) AS appointments, COUNT(DISTINCT a.patientId) AS patients
      FROM appointment a INNER JOIN doctor d ON d.id = a.doctorId
      WHERE d.hospitalId = ? AND a.dateTime >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
      GROUP BY DATE_FORMAT(a.dateTime, '%Y-%m')
    `, [hospital.id]);
    const reportMonths = await this.db.query(`
      SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, COUNT(*) AS reports
      FROM medicalrecord WHERE hospitalId = ? AND date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
      GROUP BY DATE_FORMAT(date, '%Y-%m')
    `, [hospital.id]);
    const appointmentsByMonth = new Map(appointmentMonths.map(row => [row.monthKey, row]));
    const reportsByMonth = new Map(reportMonths.map(row => [row.monthKey, row]));
    const monthlyData = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (5 - index));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const appointmentMonth = appointmentsByMonth.get(monthKey);
      const reportMonth = reportsByMonth.get(monthKey);
      return { month: date.toLocaleDateString('en-US', { month: 'short' }), patients: Number(appointmentMonth?.patients || 0), appointments: Number(appointmentMonth?.appointments || 0), reports: Number(reportMonth?.reports || 0) };
    });
    const trend = (current: number, previous: number) => previous === 0 ? (current === 0 ? '0%' : 'New') : `${current >= previous ? '+' : ''}${Math.round(((current - previous) / previous) * 100)}%`;

    return {
      kpis: [
        { label: "Total Patients", value: totalPatients.toString() },
        { label: "Data Window", value: "6 months" },
        { label: "Appts This Month", value: appointmentsThisMonth.toString(), trend: trend(appointmentsThisMonth, Number(priorAppointmentRow?.c || 0)) },
        { label: "Reports This Month", value: reportsThisMonth.toString(), trend: trend(reportsThisMonth, Number(priorReportsRow?.c || 0)) },
      ],
      monthlyData,
      deptDistribution
    };
  }

  async getSubscription(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const plans = await this.db.query('SELECT * FROM subscriptionplan ORDER BY price ASC');
    const current = await this.db.queryOne(`
      SELECT hs.*, sp.name AS planName
      FROM hospitalsubscription hs
      INNER JOIN subscriptionplan sp ON sp.id = hs.planId
      WHERE hs.hospitalId = ? AND UPPER(hs.status) = 'ACTIVE'
      ORDER BY hs.updatedAt DESC LIMIT 1
    `, [hospital.id]);

    return {
      currentPlanId: current?.planId || null,
      subscription: current || null,
      plans: plans.map(plan => {
        let features: string[] = [];
        try { features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]'); } catch { features = []; }
        return { ...plan, features, popular: Boolean(plan.popular) };
      }),
    };
  }

  async changeSubscription(userEmail: string, planId: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    const plan = await this.db.queryOne('SELECT id, name FROM subscriptionplan WHERE id = ?', [planId]);
    if (!plan) throw new NotFoundException('Subscription plan not found.');

    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute('UPDATE hospitalsubscription SET status = ?, updatedAt = ? WHERE hospitalId = ? AND UPPER(status) = ?', ['Inactive', new Date(), hospital.id, 'ACTIVE']);
      const now = new Date();
      await connection.execute(
        'INSERT INTO hospitalsubscription (id, hospitalId, planId, status, startDate, endDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), hospital.id, plan.id, 'Active', now, null, now, now],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return { currentPlanId: plan.id, message: `${plan.name} is now active.` };
  }

  async getHospitalProfile(userEmail: string) {
    const hospital = await this.getHospitalByEmail(userEmail);
    let profile = await this.db.queryOne('SELECT * FROM hospital_profile WHERE hospitalId = ?', [hospital.id]);
    
    return {
      hospitalId: hospital.id,
      name: hospital.name,
      email: hospital.email,
      phone: hospital.phone,
      licenseNumber: hospital.licenseNumber,
      type: hospital.type,
      ...profile
    };
  }

  async updateHospitalLogo(userEmail: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Select an image to upload.');
    if (!file.mimetype?.startsWith('image/')) throw new BadRequestException('Hospital logo must be an image file.');
    const hospital = await this.getHospitalByEmail(userEmail);
    const logoUrl = `/uploads/${file.filename}`;
    const existing = await this.db.queryOne('SELECT id FROM hospital_profile WHERE hospitalId = ?', [hospital.id]);
    if (existing) await this.db.query('UPDATE hospital_profile SET logoUrl = ?, updatedAt = ? WHERE hospitalId = ?', [logoUrl, new Date(), hospital.id]);
    else await this.db.query('INSERT INTO hospital_profile (id, hospitalId, logoUrl) VALUES (?, ?, ?)', [uuidv4(), hospital.id, logoUrl]);
    return { logoUrl };
  }

  async updateHospitalProfile(userEmail: string, data: any) {
    const hospital = await this.getHospitalByEmail(userEmail);

    await this.db.query(
      'UPDATE hospital SET name = ?, email = ?, phone = ?, updatedAt = ? WHERE id = ?',
      [data.name, data.email, data.phone, new Date(), hospital.id]
    );

    const existing = await this.db.queryOne('SELECT id FROM hospital_profile WHERE hospitalId = ?', [hospital.id]);
    
    if (data.registrationNumber) {
      const regCheck = await this.db.queryOne(
        'SELECT id FROM hospital_profile WHERE registrationNumber = ? AND hospitalId != ?', 
        [data.registrationNumber, hospital.id]
      );
      if (regCheck) throw new BadRequestException('Registration Number is already in use by another hospital.');
    }

    if (existing) {
      await this.db.query(
        `UPDATE hospital_profile SET 
          logoUrl = ?, registrationNumber = ?, establishedYear = ?, emergencyContact = ?, website = ?,
          city = ?, state = ?, country = ?, postalCode = ?,
          adminName = ?, adminDesignation = ?, adminEmail = ?, adminContact = ?,
          departments = ?, description = ?, workingDays = ?, openingTime = ?, closingTime = ?, emergencyServices = ?,
          updatedAt = ?
         WHERE hospitalId = ?`,
        [
          data.logoUrl || null, data.registrationNumber || null, data.establishedYear || null, data.emergencyContact || null, data.website || null,
          data.city || null, data.state || null, data.country || null, data.postalCode || null,
          data.adminName || null, data.adminDesignation || null, data.adminEmail || null, data.adminContact || null,
          data.departments || null, data.description || null, data.workingDays || null, data.openingTime || null, data.closingTime || null, data.emergencyServices ? 1 : 0,
          new Date(), hospital.id
        ]
      );
    } else {
      await this.db.query(
        `INSERT INTO hospital_profile (
          id, hospitalId, logoUrl, registrationNumber, establishedYear, emergencyContact, website,
          city, state, country, postalCode, adminName, adminDesignation, adminEmail, adminContact,
          departments, description, workingDays, openingTime, closingTime, emergencyServices
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(), hospital.id, data.logoUrl || null, data.registrationNumber || null, data.establishedYear || null, data.emergencyContact || null, data.website || null,
          data.city || null, data.state || null, data.country || null, data.postalCode || null,
          data.adminName || null, data.adminDesignation || null, data.adminEmail || null, data.adminContact || null,
          data.departments || null, data.description || null, data.workingDays || null, data.openingTime || null, data.closingTime || null, data.emergencyServices ? 1 : 0
        ]
      );
    }
    
    if (data.email && data.email !== userEmail) {
      const userCheck = await this.db.queryOne('SELECT id FROM user WHERE email = ? AND id != ?', [data.email, hospital.id]);
      if (!userCheck) {
         await this.db.query('UPDATE user SET email = ? WHERE email = ?', [data.email, userEmail]);
      }
    }

    return { success: true };
  }

  async updatePassword(userEmail: string, data: any) {
    const user = await this.db.queryOne('SELECT * FROM user WHERE email = ?', [userEmail]);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Incorrect current password');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.db.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, userEmail]);

    return { success: true };
  }
}
