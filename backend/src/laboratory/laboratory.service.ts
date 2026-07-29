import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { formatPrescriptionId } from '../prescription-id';

@Injectable()
export class LaboratoryService {
  constructor(
    private db: MysqlService,
    private redisService: RedisService,
  ) {}


  private async getHospitalContext(userEmail: string | undefined) {
    let hospital: any = null;
    if (userEmail) {
      // The explicit user-to-facility link is the tenant boundary. Legacy data
      // can contain duplicate facility rows sharing an email, so email-only
      // lookup may silently open an empty workspace.
      const user = await this.db.queryOne('SELECT hospitalId FROM user WHERE email = ?', [userEmail]);
      if (user?.hospitalId) {
        hospital = await this.db.queryOne('SELECT * FROM hospital WHERE id = ? AND type IN ("LABORATORY", "LAB")', [user.hospitalId]);
      }
      if (!hospital) {
        hospital = await this.db.queryOne(
          'SELECT * FROM hospital WHERE LOWER(email) = LOWER(?) AND type IN ("LABORATORY", "LAB") ORDER BY isVerified DESC, updatedAt DESC LIMIT 1',
          [userEmail],
        );
      }
    }
    if (!hospital) throw new UnauthorizedException('No laboratory workspace is linked to this identity.');
    return hospital;
  }

  async getOverview(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const cacheKey = `lab:overview:${hospital.id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const currentMonth = new Date().getMonth();
    
    // Count active patients
    const requests = await this.db.query('SELECT * FROM accessrequest WHERE hospitalId = ? AND status = "APPROVED"', [hospital.id]);
    const activePatients = requests.length;

    // Get all requests for real stats
    const allRequests = await this.db.query('SELECT status, createdAt FROM testrequest WHERE hospitalId = ?', [hospital.id]);
    const totalRequests = allRequests.length;
    
    const pendingTests = allRequests.filter((r: any) => r.status === 'Pending' || r.status === 'Pending Collection').length;
    const completedTests = allRequests.filter((r: any) => r.status === 'Completed').length;
    const inProgressTests = allRequests.filter((r: any) => ['Accepted', 'Tested', 'Report Ready', 'Received in Lab', 'Sample Collected', 'Under Testing'].includes(r.status)).length;
    const completedThisMonth = allRequests.filter((r: any) => r.status === 'Completed' && new Date(r.createdAt).getMonth() === currentMonth).length;

    // Generate recent requests
    const recentReqs = await this.db.query(`
      SELECT t.*, p.name as patientName, h.name as refHospitalName, d.name as refDoctorName
      FROM testrequest t
      LEFT JOIN patient p ON t.patientId = p.id
      LEFT JOIN hospital h ON t.referringHospitalId = h.id
      LEFT JOIN doctor d ON t.doctorId = d.id
      WHERE t.hospitalId = ?
      ORDER BY t.createdAt DESC LIMIT 5
    `, [hospital.id]);

    const recentRequests = recentReqs.map((r: any) => ({
      id: r.id,
      patient: r.patientName || 'Unknown Patient',
      clinicName: r.refHospitalName || 'N/A',
      doctorName: r.refDoctorName || 'N/A',
      tests: r.testType,
      status: r.status
    }));

    const totalPatientsRow = await this.db.queryOne('SELECT COUNT(DISTINCT patientId) as c FROM testrequest WHERE hospitalId = ?', [hospital.id]);
    const totalPatients = Number(totalPatientsRow.c);
    const reportTypeRows = await this.db.query(`SELECT COALESCE(testType, 'Other') AS name, COUNT(*) AS value FROM testrequest WHERE hospitalId = ? GROUP BY testType ORDER BY value DESC LIMIT 6`, [hospital.id]);
    const reportColors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6'];

    const monthlyRows = await this.db.query(`SELECT DATE_FORMAT(createdAt, '%b') AS name, COUNT(DISTINCT patientId) AS patients FROM testrequest WHERE hospitalId = ? AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY name ORDER BY MIN(createdAt)`, [hospital.id]);
    const recentNotifications = await this.db.query('SELECT id, type, title, message, createdAt FROM notification WHERE hospitalId = ? ORDER BY createdAt DESC LIMIT 3', [hospital.id]);

    const result = {
      kpis: {
        totalRequests,
        completedReports: completedTests,
        inProgress: inProgressTests,
        totalPatients,
        pendingReports: pendingTests
      },
      testRequestOverviewData: [
        { name: 'Pending', value: pendingTests, color: '#f59e0b' },
        { name: 'In Progress', value: inProgressTests, color: '#a855f7' },
        { name: 'Completed', value: completedTests, color: '#10b981' }
      ],
      reportsSummaryData: reportTypeRows.map((row, index) => ({ name: row.name, value: Number(row.value), color: reportColors[index % reportColors.length] })),
      patientChartData: monthlyRows.length > 0 ? monthlyRows.map(r => ({ name: r.name, patients: Number(r.patients) })) : [],
      recentTestRequests: recentRequests,
      recentNotifications
    };

    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async getTestRequests(userEmail?: string) {
    try {
      const hospital = await this.getHospitalContext(userEmail);
      const cacheKey = `lab:testrequests:${hospital.id}`;
      const cached = await this.redisService.get(cacheKey);
      // if (cached) return cached; // Temporarily bypass cache to clear old data

      const reqs = await this.db.query(`
        SELECT t.*, p.name as patientName, p.phone as patientPhone, p.dateOfBirth as patientDob, p.gender as patientGender, 
               rh.name as refHospitalName, rh.type as refHospitalType,
               d.name as doctorName, d.department as doctorDepartment
        FROM testrequest t
        LEFT JOIN patient p ON t.patientId = p.id
        LEFT JOIN doctor d ON t.doctorId = d.id
        LEFT JOIN hospital rh ON t.referringHospitalId = rh.id
        WHERE t.hospitalId = ?
        ORDER BY t.createdAt DESC
      `, [hospital.id]);

      const result = reqs.map(r => ({
        id: r.id,
        patientId: r.patientId,
        patientName: r.patientName,
        patientPhone: r.patientPhone || 'N/A',
        patientGender: r.patientGender || 'Unknown',
        patientAge: r.patientDob ? Math.floor((Date.now() - new Date(r.patientDob).getTime()) / 31557600000) + ' yrs' : 'N/A',
        testType: r.testType,
        priority: r.priority,
        status: r.status === 'Pending Collection' ? 'Pending' : r.status,
        date: new Date(r.createdAt).toLocaleDateString(),
        doctorName: r.doctorName ? `Dr. ${r.doctorName.replace(/^(Dr\.?\s*)+/i, '')}` : 'Unknown Doctor',
        doctorDepartment: r.doctorDepartment || 'General',
        clinicName: r.refHospitalName || 'Direct Request',
        clinicType: r.refHospitalType || 'HOSPITAL',
        referringHospitalId: r.referringHospitalId
      }));
      await this.redisService.set(cacheKey, result, 300);
      return result;
    } catch (error: any) {
      console.error('getTestRequests ERROR:', error);
      throw error;
    }
  }

  async updateRequestStatus(userEmail: string | undefined, id: string, status: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const testReq = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ? AND hospitalId = ?', [id, hospital.id]);
    if (!testReq) throw new NotFoundException('Request not found');
    if (testReq.status === status) return { success: true };

    await this.db.query('UPDATE testrequest SET status = ? WHERE id = ?', [status, id]);

    const patient = await this.db.queryOne<any>(
      'SELECT name, email FROM patient WHERE id = ?',
      [testReq.patientId],
    );
    const patientUser = patient?.email
      ? await this.db.queryOne<any>(
          'SELECT id FROM user WHERE LOWER(email) = LOWER(?) LIMIT 1',
          [patient.email],
        )
      : null;
    const patientStatusContent: Record<string, { title: string; message: string; severity: string }> = {
      Accepted: {
        title: 'Lab test request accepted',
        message: `${hospital.name} accepted your ${testReq.testType} test request.`,
        severity: 'Low',
      },
      Tested: {
        title: 'Lab testing completed',
        message: `${hospital.name} completed testing for ${testReq.testType}. Your report will be uploaded soon.`,
        severity: 'Medium',
      },
      Completed: {
        title: 'Lab report ready',
        message: `Your ${testReq.testType} report from ${hospital.name} is ready.`,
        severity: 'Medium',
      },
      Cancelled: {
        title: 'Lab test request rejected',
        message: `${hospital.name} could not accept your ${testReq.testType} test request.`,
        severity: 'High',
      },
    };
    const patientContent = patientStatusContent[status];
    if (patientUser && patientContent) {
      await this.db.query(
        `INSERT INTO notification
         (id, userId, type, title, message, isRead, actionRequired, actionUrl,
          severity, createdAt, updatedAt)
         VALUES (?, ?, 'LAB_STATUS', ?, ?, 0, 1, '/patient/lab-tests', ?, NOW(3), NOW(3))`,
        [
          uuidv4(),
          patientUser.id,
          patientContent.title,
          patientContent.message,
          patientContent.severity,
        ],
      );
    }

    // Notify referring hospital/clinic about status changes
    if (testReq.referringHospitalId) {
      const refHospital = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [testReq.referringHospitalId]);
      const patientName = patient?.name || 'Unknown';

      if (status === 'Accepted') {
        await this.db.query(
          'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?, ?)',
          [uuidv4(), testReq.referringHospitalId, 'LAB_STATUS', 'Lab Test Accepted', `${hospital.name} has accepted the ${testReq.testType} test request for patient ${patientName}.`, 'Low', new Date(), new Date()]
        );
      } else if (status === 'Tested') {
        await this.db.query(
          'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?, ?)',
          [uuidv4(), testReq.referringHospitalId, 'LAB_STATUS', 'Lab Test Completed', `${hospital.name} has completed testing for ${testReq.testType} for patient ${patientName}. Report will be uploaded soon.`, 'Medium', new Date(), new Date()]
        );
      } else if (status === 'Completed') {
        await this.db.query(
          'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?, ?)',
          [uuidv4(), testReq.referringHospitalId, 'LAB_STATUS', 'Lab Test Completed', `${hospital.name} completed the ${testReq.testType} test for ${patientName}. The verified report will appear after file upload.`, 'Medium', new Date(), new Date()]
        );

      } else if (status === 'Cancelled') {
        await this.db.query(
          'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, true, ?, ?, ?)',
          [uuidv4(), testReq.referringHospitalId, 'LAB_STATUS', 'Lab Test Rejected', `${hospital.name} has rejected the ${testReq.testType} test request for patient ${patientName}.`, 'High', new Date(), new Date()]
        );
      }
    }
    
    await this.redisService.del(`lab:overview:${hospital.id}`);
    await this.redisService.del(`lab:testrequests:${hospital.id}`);
    await this.redisService.del(`lab:samples:${hospital.id}`);
    
    return { success: true };
  }

  async getReports(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const records = await this.db.query(`
      SELECT m.*, p.name as patientName
      FROM medicalrecord m
      LEFT JOIN patient p ON m.patientId = p.id
      WHERE m.hospitalId = ? AND m.type = 'LAB_REPORT'
      ORDER BY m.date DESC
    `, [hospital.id]);

    return records.map(r => ({
      id: r.id,
      patientId: r.patientId,
      patientName: r.patientName,
      title: r.title,
      category: r.description || 'Lab Report',
      date: new Date(r.date).toLocaleDateString(),
      size: r.fileSize ? `${(Number(r.fileSize) / 1048576).toFixed(1)} MB` : 'Stored securely',
      status: r.status || 'Available'
      ,fileUrl: r.fileUrl
    }));
  }

  async uploadReport(userEmail: string | undefined, data: any, file?: Express.Multer.File) {
    const hospital = await this.getHospitalContext(userEmail);
    const fileUrl = file?.filename || String(data.fileUrl || '').trim();
    if (!fileUrl) throw new BadRequestException('A real report file is required.');
    let patient = await this.db.queryOne('SELECT * FROM patient WHERE id = ? OR name = ?', [data.patientId, data.patientId]);
    if (!patient) throw new Error("Patient not found. Please verify the ID or Name.");

    const recId = uuidv4();
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, hospitalId, title, type, description, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [recId, patient.id, hospital.id, data.title, 'LAB_REPORT', data.category, fileUrl, new Date(), new Date()]
    );

    let linkedRequest: any = null;
    if (data.linkedRequestId) {
      linkedRequest = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ?', [data.linkedRequestId]);
      await this.db.query('UPDATE testrequest SET status = "Completed" WHERE id = ?', [data.linkedRequestId]);
    }

    // 1. Notify the PATIENT
    if (patient) {
      const userForNotif = patient.email ? await this.db.queryOne('SELECT id FROM user WHERE email = ?', [patient.email]) : 
                           (patient.phone ? await this.db.queryOne('SELECT id FROM user WHERE phone = ?', [patient.phone]) : null);
      if (userForNotif) {
        await this.db.query(
          'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
          [uuidv4(), userForNotif.id, 'REPORT', 'New Lab Report Uploaded', `${hospital.name} has uploaded a new report: ${data.title}`, new Date(), new Date()]
        );
      }
    }

    // 2. Notify the REFERRING HOSPITAL / CLINIC (the one that sent the request)
    if (linkedRequest && linkedRequest.referringHospitalId) {
      const refHospital = await this.db.queryOne('SELECT * FROM hospital WHERE id = ?', [linkedRequest.referringHospitalId]);
      if (refHospital) {
        await this.db.query(
          'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?, ?)',
          [uuidv4(), refHospital.id, 'LAB_RESULT', 'Lab Report Ready', `${hospital.name} has completed the ${linkedRequest.testType} report for patient ${patient.name}. Report: ${data.title}`, 'Medium', new Date(), new Date()]
        );
      }

      // 3. Also save the report in the REFERRING hospital's medicalrecord so their doctor can see it
      await this.db.query(
        'INSERT INTO medicalrecord (id, patientId, hospitalId, title, type, description, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), patient.id, linkedRequest.referringHospitalId, data.title, 'LAB_REPORT', `From ${hospital.name}: ${data.category || 'Lab Report'}`, fileUrl, new Date(), new Date()]
      );
    }

    await this.redisService.del(`lab:overview:${hospital.id}`);
    return { id: recId };
  }


  async searchPatients(userEmail: string | undefined, query: string) {
    if (!query || query.length < 3) return [];
    const hospital = await this.getHospitalContext(userEmail);
    
    const patients = await this.db.query(
      `SELECT p.*,
              (SELECT ar.status
               FROM accessrequest ar
               WHERE ar.patientId = p.id AND ar.hospitalId = ?
               ORDER BY ar.updatedAt DESC LIMIT 1) AS accessStatus,
              (SELECT MAX(m.date) FROM medicalrecord m WHERE m.patientId = p.id) AS lastTest
       FROM patient p
       WHERE p.name LIKE ? OR p.id LIKE ? OR p.phone LIKE ? OR p.email LIKE ?
       ORDER BY p.updatedAt DESC
       LIMIT 10`,
      [hospital.id, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return patients.map(p => {
      return {
        id: p.id,
        name: p.name,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : null,
        gender: p.gender || 'Unknown',
        phone: p.phone || 'N/A',
        email: p.email || 'N/A',
        lastTest: p.lastTest ? new Date(p.lastTest).toLocaleDateString() : 'N/A',
        accessStatus: p.accessStatus || 'NOT_REQUESTED',
      };
    });
  }

  async getPatients(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const patients = await this.db.query(
      `SELECT p.*,
              (SELECT ar.status
               FROM accessrequest ar
               WHERE ar.patientId = p.id AND ar.hospitalId = ?
               ORDER BY ar.updatedAt DESC LIMIT 1) AS accessStatus,
              (SELECT MAX(m.date) FROM medicalrecord m WHERE m.patientId = p.id) AS lastTest
       FROM patient p
       ORDER BY p.updatedAt DESC
       LIMIT 50`,
      [hospital.id]
    );

    return patients.map(p => {
      return {
        id: p.id,
        name: p.name,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 30,
        gender: p.gender || 'Unknown',
        phone: p.phone || 'N/A',
        email: p.email || 'N/A',
        lastTest: p.lastTest ? new Date(p.lastTest).toLocaleDateString() : 'N/A',
        accessStatus: p.accessStatus || 'NOT_REQUESTED',
      };
    });
  }

  async requestAccess(userEmail: string | undefined, patientId: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const patient = await this.db.queryOne<any>('SELECT id, name, email FROM patient WHERE id = ?', [patientId]);
    if (!patient) throw new NotFoundException('Patient not found');
    const existing = await this.db.queryOne<any>(
      'SELECT id FROM accessrequest WHERE patientId = ? AND hospitalId = ? ORDER BY updatedAt DESC LIMIT 1',
      [patientId, hospital.id],
    );
    const now = new Date();
    if (existing) {
      await this.db.query(
        `UPDATE accessrequest
         SET status = 'PENDING', requestDate = ?, updatedAt = ?
         WHERE id = ?`,
        [now, now, existing.id],
      );
    } else {
      await this.db.query(
        'INSERT INTO accessrequest (id, patientId, hospitalId, status, updatedAt, requestDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), patientId, hospital.id, 'PENDING', now, now, now],
      );
    }
    if (patient.email) {
      const patientUser = await this.db.queryOne<any>(
        'SELECT id FROM user WHERE LOWER(email) = LOWER(?)',
        [patient.email],
      );
      if (patientUser) {
        await this.db.query(
          `INSERT INTO notification
             (id, userId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
           VALUES (?, ?, 'ACCESS_REQUEST', 'New laboratory access request', ?, 0, 1, 'Medium', ?, ?)`,
          [uuidv4(), patientUser.id, `${hospital.name} requested access to your medical records.`, now, now],
        );
      }
    }
    return { success: true };
  }

  async getPatientRecords(userEmail: string | undefined, patientId: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const access = await this.db.queryOne<any>(
      `SELECT status FROM accessrequest
       WHERE patientId = ? AND hospitalId = ?
       ORDER BY updatedAt DESC LIMIT 1`,
      [patientId, hospital.id],
    );
    const hasApprovedAccess = String(access?.status || '').toUpperCase() === 'APPROVED';

    const records = await this.db.query(`
      SELECT m.*, h.name as hospitalName 
      FROM medicalrecord m
      LEFT JOIN hospital h ON m.hospitalId = h.id
      WHERE m.patientId = ?
        AND (? = 1 OR m.hospitalId = ?)
      ORDER BY m.date DESC
    `, [patientId, hasApprovedAccess ? 1 : 0, hospital.id]);

    return records.map(r => ({
      id: r.id,
      name: String(r.type).toUpperCase() === 'PRESCRIPTION' ? formatPrescriptionId(r.title || r.id) : r.title,
      date: new Date(r.date).toLocaleDateString(),
      facility: r.hospitalName || 'Unknown Facility',
      type: r.type,
      fileUrl: r.fileUrl
    }));
  }

  async getNotifications(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    return this.db.query('SELECT * FROM notification WHERE hospitalId = ? ORDER BY createdAt DESC', [hospital.id]);
  }

  async markAllNotificationsAsRead(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId = ?', [hospital.id]);
    return { success: true };
  }

  async markNotificationAsRead(userEmail: string | undefined, id: string) {
    const hospital = await this.getHospitalContext(userEmail);
    await this.db.query('UPDATE notification SET isRead = true WHERE id = ? AND hospitalId = ?', [id, hospital.id]);
    return { success: true };
  }

  async deleteNotification(userEmail: string | undefined, id: string) {
    const hospital = await this.getHospitalContext(userEmail);
    await this.db.query('DELETE FROM notification WHERE id = ? AND hospitalId = ?', [id, hospital.id]);
    return { success: true };
  }

  async getProfile(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    return {
      id: hospital.id,
      name: hospital.name,
      phone: hospital.phone || '',
      address: hospital.address || '',
      type: hospital.type || 'LAB',
      email: hospital.email,
      licenseNo: hospital.licenseNumber || '',
      established: hospital.createdAt,
      logoUrl: (await this.db.queryOne('SELECT value FROM setting WHERE `key` = ?', [`profile.logo.lab.${hospital.id}`]))?.value || '',
    };
  }

  // --- Samples APIs ---
  async getSamples(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const cacheKey = `lab:samples:${hospital.id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const reqs = await this.db.query(`
      SELECT t.*, p.name as patientName 
      FROM testrequest t
      LEFT JOIN patient p ON t.patientId = p.id
      WHERE t.hospitalId = ?
      ORDER BY t.createdAt DESC
    `, [hospital.id]);

    const result = reqs.map(r => ({
      id: r.sampleId || r.id, // Display sampleId if exists, else id
      testRequestId: r.id,
      sampleType: r.testType,
      patientName: r.patientName || 'Unknown Patient',
      patientId: r.patientId,
      test: r.testType,
      date: r.sampleCollectedAt ? new Date(r.sampleCollectedAt).toLocaleDateString() : new Date(r.createdAt).toLocaleDateString(),
      status: r.status,
      assignedTo: r.assignedTo,
      rejectionReason: r.rejectionReason
    }));
    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async updateSampleStatus(userEmail: string | undefined, testRequestId: string, status: string, rejectionReason?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const testReq = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ? AND hospitalId = ?', [testRequestId, hospital.id]);
    if (!testReq) throw new NotFoundException('Sample request not found');

    let updateQuery = 'UPDATE testrequest SET status = ?';
    let params: any[] = [status];

    if (status === 'Sample Collected' && !testReq.sampleId) {
      const sampleId = 'SMP-' + uuidv4().substring(0, 8).toUpperCase();
      updateQuery += ', sampleId = ?, sampleCollectedAt = CURRENT_TIMESTAMP(3)';
      params.push(sampleId);
    }
    
    if (status === 'Rejected' && rejectionReason) {
      updateQuery += ', rejectionReason = ?';
      params.push(rejectionReason);
    }

    updateQuery += ' WHERE id = ?';
    params.push(testRequestId);

    await this.db.query(updateQuery, params);

    // Add history record
    await this.db.query(`
      INSERT INTO testrequest_status_history (id, testRequestId, status, updatedBy)
      VALUES (?, ?, ?, ?)
    `, [uuidv4(), testRequestId, status, 'Lab Technician']);

    await this.redisService.del(`lab:samples:${hospital.id}`);
    await this.redisService.del(`lab:overview:${hospital.id}`);
    await this.redisService.del(`lab:testrequests:${hospital.id}`);

    return { success: true };
  }

  async assignSample(userEmail: string | undefined, testRequestId: string, assignee: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const testReq = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ? AND hospitalId = ?', [testRequestId, hospital.id]);
    if (!testReq) throw new NotFoundException('Sample request not found');

    await this.db.query('UPDATE testrequest SET assignedTo = ? WHERE id = ?', [assignee, testRequestId]);
    await this.redisService.del(`lab:samples:${hospital.id}`);
    return { success: true };
  }

  async uploadSampleReport(userEmail: string | undefined, testRequestId: string, file: Express.Multer.File, data: any) {
    if (!file) throw new Error("No report file provided");
    
    const hospital = await this.getHospitalContext(userEmail);
    const testReq = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ? AND hospitalId = ?', [testRequestId, hospital.id]);
    if (!testReq) throw new NotFoundException('Sample request not found');

    // 1. Update status to Completed
    await this.updateSampleStatus(userEmail, testRequestId, 'Completed');

    // 2. Create Medical Record for Referring Hospital
    const fileUrl = file.filename;
    
    if (testReq.referringHospitalId) {
      await this.db.query(`
        INSERT INTO medicalrecord (id, patientId, hospitalId, title, description, type, fileUrl, date, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        testReq.patientId,
        testReq.referringHospitalId,
        testReq.testType + ' Report',
        `From ${hospital.name}: Lab Report`,
        'LAB_REPORT',
        fileUrl,
        new Date(),
        new Date(),
        new Date()
      ]);
    }

    // 3. Create Medical Record for Lab Dashboard
    await this.db.query(`
      INSERT INTO medicalrecord (id, patientId, hospitalId, title, description, type, fileUrl, date, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      uuidv4(),
      testReq.patientId,
      hospital.id,
      testReq.testType + ' Report',
      `Sent to referring hospital`,
      'LAB_REPORT',
      fileUrl,
      new Date(),
      new Date(),
      new Date()
    ]);

    // Notifications are owned by the authenticated user record, not patient IDs.
    const patient = await this.db.queryOne<any>('SELECT email FROM patient WHERE id = ?', [testReq.patientId]);
    const patientUser = patient?.email
      ? await this.db.queryOne<any>('SELECT id FROM user WHERE LOWER(email) = LOWER(?)', [patient.email])
      : null;
    if (patientUser) {
      await this.db.query(`
        INSERT INTO notification (id, userId, title, message, type, isRead, actionRequired, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        patientUser.id,
        'Lab Report Ready',
        `Your lab report for ${testReq.testType} is ready.`,
        'Report',
        false,
        false,
        new Date(),
        new Date()
      ]);
    }

    return { success: true, fileUrl };
  }

  async updateProfile(userEmail: string | undefined, data: any) {
    const hospital = await this.getHospitalContext(userEmail);
    await this.db.query(
      'UPDATE hospital SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [data.name, data.email, data.phone, data.address, hospital.id]
    );
    return { success: true };
  }

  async uploadProfileLogo(userEmail: string | undefined, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Select an image to upload.');
    if (!file.mimetype?.startsWith('image/')) throw new BadRequestException('Profile image must be an image file.');
    const hospital = await this.getHospitalContext(userEmail);
    const logoUrl = `/uploads/${file.filename}`;
    await this.db.query('INSERT INTO setting (`key`, value, updatedAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updatedAt = VALUES(updatedAt)', [`profile.logo.lab.${hospital.id}`, logoUrl, new Date()]);
    return { logoUrl };
  }
}
