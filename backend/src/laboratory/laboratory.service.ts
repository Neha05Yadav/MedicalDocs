import { Injectable, NotFoundException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LaboratoryService {
  constructor(private db: MysqlService) {}


  private async getHospitalContext(userEmail?: string): Promise<any> {
    let hospital: any = null;
    if (userEmail) {
      hospital = await this.db.queryOne('SELECT * FROM hospital WHERE email = ? AND type IN ("LABORATORY", "LAB")', [userEmail]);
    }
    if (!hospital) {
      hospital = await this.db.queryOne('SELECT * FROM hospital WHERE type IN ("LABORATORY", "LAB") LIMIT 1');
    }
    if (!hospital) {
      hospital = await this.db.queryOne('SELECT * FROM hospital LIMIT 1');
    }
    if (!hospital) throw new Error("No lab context found");
    return hospital;
  }

  async getOverview(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);

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

    // Patients count mockup
    const totalPatientsRow = await this.db.queryOne('SELECT COUNT(DISTINCT patientId) as c FROM testrequest WHERE hospitalId = ?', [hospital.id]);
    const totalPatients = Number(totalPatientsRow.c);

    return {
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
      reportsSummaryData: [
        { name: 'Blood Test', value: 45, color: '#3b82f6' },
        { name: 'X-Ray', value: 25, color: '#10b981' },
        { name: 'MRI', value: 15, color: '#f59e0b' },
        { name: 'Urine Test', value: 15, color: '#6366f1' }
      ],
      recentTestRequests: recentRequests,
      recentNotifications: []
    };
  }

  async getTestRequests(userEmail?: string) {
    try {
      const hospital = await this.getHospitalContext(userEmail);
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

      return reqs.map(r => ({
        id: r.id,
        patientId: r.patientId,
        patientName: r.patientName,
        patientPhone: r.patientPhone || 'N/A',
        patientGender: r.patientGender || 'Unknown',
        patientAge: r.patientDob ? Math.floor((Date.now() - new Date(r.patientDob).getTime()) / 31557600000) + ' yrs' : 'N/A',
        testType: r.testType,
        priority: r.priority,
        status: r.status,
        date: new Date(r.createdAt).toLocaleDateString(),
        doctorName: r.doctorName ? `Dr. ${r.doctorName}` : 'Unknown Doctor',
        doctorDepartment: r.doctorDepartment || 'General',
        clinicName: r.refHospitalName || 'Direct Request',
        clinicType: r.refHospitalType || 'HOSPITAL',
        referringHospitalId: r.referringHospitalId
      }));
    } catch (error: any) {
      console.error('getTestRequests ERROR:', error);
      throw error;
    }
  }

  async updateRequestStatus(userEmail: string | undefined, id: string, status: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const testReq = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ? AND hospitalId = ?', [id, hospital.id]);
    if (!testReq) throw new NotFoundException('Request not found');

    await this.db.query('UPDATE testrequest SET status = ? WHERE id = ?', [status, id]);

    // Notify referring hospital/clinic about status changes
    if (testReq.referringHospitalId) {
      const refHospital = await this.db.queryOne('SELECT name FROM hospital WHERE id = ?', [testReq.referringHospitalId]);
      const patient = await this.db.queryOne('SELECT name FROM patient WHERE id = ?', [testReq.patientId]);
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
          [uuidv4(), testReq.referringHospitalId, 'LAB_RESULT', 'Lab Result Ready', `The ${testReq.testType} result for patient ${patientName} is ready from ${hospital.name}.`, 'High', new Date(), new Date()]
        );

        const fileUrl = "dummy_lab_report.pdf";
        await this.db.query(`
          INSERT INTO medicalrecord (id, patientId, hospitalId, title, description, type, fileUrl, date, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          uuidv4(), testReq.patientId, testReq.referringHospitalId, testReq.testType + ' Report', `From ${hospital.name}: Lab Report`, 'LAB_REPORT', fileUrl, new Date(), new Date(), new Date()
        ]);

        await this.db.query(`
          INSERT INTO medicalrecord (id, patientId, hospitalId, title, description, type, fileUrl, date, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          uuidv4(), testReq.patientId, hospital.id, testReq.testType + ' Report', `Sent to referring hospital`, 'LAB_REPORT', fileUrl, new Date(), new Date(), new Date()
        ]);

        await this.db.query(`
          INSERT INTO notification (id, userId, title, message, type, isRead, actionRequired, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          uuidv4(), testReq.patientId, 'Lab Report Ready', `Your lab report for ${testReq.testType} is ready.`, 'Report', false, false, new Date(), new Date()
        ]);
      } else if (status === 'Cancelled') {
        await this.db.query(
          'INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, true, ?, ?, ?)',
          [uuidv4(), testReq.referringHospitalId, 'LAB_STATUS', 'Lab Test Rejected', `${hospital.name} has rejected the ${testReq.testType} test request for patient ${patientName}.`, 'High', new Date(), new Date()]
        );
      }
    }
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
      size: '1.2 MB',
      status: 'Sent'
    }));
  }

  async uploadReport(userEmail: string | undefined, data: any, file?: Express.Multer.File) {
    const hospital = await this.getHospitalContext(userEmail);
    let patient = await this.db.queryOne('SELECT * FROM patient WHERE id = ? OR name = ?', [data.patientId, data.patientId]);
    if (!patient) throw new Error("Patient not found. Please verify the ID or Name.");

    const recId = uuidv4();
    await this.db.query(
      'INSERT INTO medicalrecord (id, patientId, hospitalId, title, type, description, fileUrl, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [recId, patient.id, hospital.id, data.title, 'LAB_REPORT', data.category, file?.filename || data.fileUrl || "dummy_report.pdf", new Date(), new Date()]
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
        [uuidv4(), patient.id, linkedRequest.referringHospitalId, data.title, 'LAB_REPORT', `From ${hospital.name}: ${data.category || 'Lab Report'}`, data.fileUrl || "dummy_report.pdf", new Date(), new Date()]
      );
    }

    return { id: recId };
  }


  async searchPatients(userEmail: string | undefined, query: string) {
    if (!query || query.length < 3) return [];
    const hospital = await this.getHospitalContext(userEmail);
    
    const patients = await this.db.query(
      `SELECT * FROM patient WHERE name LIKE ? OR id LIKE ? OR phone LIKE ? LIMIT 10`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return Promise.all(patients.map(async p => {
      const access = await this.db.queryOne('SELECT status FROM accessrequest WHERE patientId = ? AND hospitalId = ? ORDER BY requestDate DESC LIMIT 1', [p.id, hospital.id]);
      return {
        id: p.id,
        name: p.name,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 30,
        gender: p.gender || 'Unknown',
        phone: p.phone || 'N/A',
        email: p.email || 'N/A',
        status: access?.status === 'APPROVED' ? 'Authorized' : access?.status === 'REJECTED' ? 'Unauthorized' : access?.status === 'PENDING' ? 'Pending' : 'Unauthorized'
      };
    }));
  }

  async getPatients(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const patients = await this.db.query(
      `SELECT * FROM patient ORDER BY createdAt DESC LIMIT 50`
    );

    return Promise.all(patients.map(async p => {
      const access = await this.db.queryOne('SELECT status, requestDate FROM accessrequest WHERE patientId = ? AND hospitalId = ? ORDER BY requestDate DESC LIMIT 1', [p.id, hospital.id]);
      return {
        id: p.id,
        name: p.name,
        age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 30,
        gender: p.gender || 'Unknown',
        phone: p.phone || 'N/A',
        email: p.email || 'N/A',
        lastTest: access?.requestDate ? new Date(access.requestDate).toLocaleDateString() : 'N/A',
        status: access?.status === 'APPROVED' ? 'Authorized' : access?.status === 'REJECTED' ? 'Unauthorized' : access?.status === 'PENDING' ? 'Pending' : 'Unauthorized'
      };
    }));
  }

  async requestAccess(userEmail: string | undefined, patientId: string) {
    const hospital = await this.getHospitalContext(userEmail);
    await this.db.query(
      'INSERT INTO accessrequest (id, patientId, hospitalId, status, updatedAt, requestDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), patientId, hospital.id, 'PENDING', new Date(), new Date(), new Date()]
    );
    return { success: true };
  }

  async getPatientRecords(userEmail: string | undefined, patientId: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const auth = await this.db.queryOne('SELECT id FROM accessrequest WHERE patientId = ? AND hospitalId = ? AND status = "APPROVED"', [patientId, hospital.id]);
    if (!auth) throw new Error("Unauthorized to view records for this patient");

    const records = await this.db.query(`
      SELECT m.*, h.name as hospitalName 
      FROM medicalrecord m
      LEFT JOIN hospital h ON m.hospitalId = h.id
      WHERE m.patientId = ?
      ORDER BY m.date DESC
    `, [patientId]);

    return records.map(r => ({
      id: r.id,
      name: r.title,
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
      name: hospital.name,
      contact: hospital.contact || 'N/A',
      location: hospital.location || 'N/A',
      email: hospital.email,
      license: "LAB-2023-9981",
      established: hospital.createdAt
    };
  }

  // --- Samples APIs ---
  async getSamples(userEmail?: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const reqs = await this.db.query(`
      SELECT t.*, p.name as patientName 
      FROM testrequest t
      LEFT JOIN patient p ON t.patientId = p.id
      WHERE t.hospitalId = ?
      ORDER BY t.createdAt DESC
    `, [hospital.id]);

    return reqs.map(r => ({
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

    return { success: true };
  }

  async assignSample(userEmail: string | undefined, testRequestId: string, assignee: string) {
    const hospital = await this.getHospitalContext(userEmail);
    const testReq = await this.db.queryOne('SELECT * FROM testrequest WHERE id = ? AND hospitalId = ?', [testRequestId, hospital.id]);
    if (!testReq) throw new NotFoundException('Sample request not found');

    await this.db.query('UPDATE testrequest SET assignedTo = ? WHERE id = ?', [assignee, testRequestId]);
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

    // Send notification to patient
    await this.db.query(`
      INSERT INTO notification (id, userId, title, message, type, isRead, actionRequired, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      uuidv4(),
      testReq.patientId,
      'Lab Report Ready',
      `Your lab report for ${testReq.testType} is ready.`,
      'Report',
      false,
      false,
      new Date(),
      new Date()
    ]);

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
}
