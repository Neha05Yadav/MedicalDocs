import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { MysqlService } from '../../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { formatPrescriptionRecord } from '../../prescription-id';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private db: MysqlService) {}

  private normalizeRole(role: unknown) {
    return String(role || '').trim().toUpperCase().replace(/[\s_-]+/g, '');
  }

  private validateDelegatedRole(role: unknown) {
    const normalized = this.normalizeRole(role);
    const allowed = new Set([
      'ADMIN', 'DOCTOR', 'HOSPITAL', 'CLINIC', 'LAB', 'LABORATORY',
      'PHARMACY', 'TECHNICIAN', 'SALES', 'SALESMANAGER', 'ACCOUNTS',
      'ACCOUNTSMANAGER', 'SUPPORT', 'SUPPORTTEAM', 'SUPPORTMANAGER',
    ]);
    if (!allowed.has(normalized)) {
      throw new BadRequestException('This role cannot be assigned from Admin Access Management.');
    }
  }

  private async assertAdminManageableUser(userId: string) {
    const user = await this.db.queryOne('SELECT id, role FROM user WHERE id = ?', [userId]);
    if (!user) throw new BadRequestException('User account not found.');
    if (this.normalizeRole(user.role) === 'SUPERADMIN') {
      throw new BadRequestException('Super Admin accounts can only be managed by the Super Admin workspace.');
    }
    return user;
  }

  async getOverview() {
    const totalPatientsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM patient');
    const totalDoctorsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM doctor');
    const totalHospitalsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM hospital'); 
    const totalReportsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM medicalrecord');
    
    const invoices = await this.db.query('SELECT totalAmount FROM invoice WHERE status = "Paid"');
    const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const userDistributionData = [
      { name: 'Patients', value: Number(totalPatientsRow.c), color: '#3b82f6' },
      { name: 'Doctors', value: Number(totalDoctorsRow.c), color: '#10b981' },
      { name: 'Hospitals', value: Number(totalHospitalsRow.c), color: '#8b5cf6' }
    ];

    const [dailyReports, dailyTests, monthlyReports, monthlyTests] = await Promise.all([
      this.db.query(`SELECT DATE(createdAt) AS day, COUNT(*) AS c FROM medicalrecord WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 13 DAY) GROUP BY DATE(createdAt)`),
      this.db.query(`SELECT DATE(createdAt) AS day, COUNT(*) AS c FROM testrequest WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 13 DAY) GROUP BY DATE(createdAt)`),
      this.db.query(`SELECT WEEK(createdAt, 3) - WEEK(DATE_FORMAT(CURDATE(), '%Y-%m-01'), 3) + 1 AS weekNo, COUNT(*) AS c FROM medicalrecord WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') GROUP BY weekNo`),
      this.db.query(`SELECT WEEK(createdAt, 3) - WEEK(DATE_FORMAT(CURDATE(), '%Y-%m-01'), 3) + 1 AS weekNo, COUNT(*) AS c FROM testrequest WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') GROUP BY weekNo`),
    ]);
    const dayKey = (value: any) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
    const reportsByDay = new Map(dailyReports.map(row => [dayKey(row.day), Number(row.c)]));
    const testsByDay = new Map(dailyTests.map(row => [dayKey(row.day), Number(row.c)]));
    const calendarWeek = (weekOffset: number) => {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      const daysSinceMonday = (weekStart.getDay() + 6) % 7;
      weekStart.setDate(weekStart.getDate() - daysSinceMonday + (weekOffset * 7));
      return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart); date.setDate(weekStart.getDate() + index);
      const key = dayKey(date);
      return { name: date.toLocaleDateString('en-US', { weekday: 'short' }), date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), reports: reportsByDay.get(key) || 0, tests: testsByDay.get(key) || 0 };
      });
    };
    const reportsByWeek = new Map(monthlyReports.map(row => [Number(row.weekNo), Number(row.c)]));
    const testsByWeek = new Map(monthlyTests.map(row => [Number(row.weekNo), Number(row.c)]));
    const activityDataByPeriod = {
      'This Week': calendarWeek(0),
      'Last Week': calendarWeek(-1),
      'This Month': Array.from({ length: 5 }, (_, index) => ({ name: `Week ${index + 1}`, date: `Week ${index + 1}`, reports: reportsByWeek.get(index + 1) || 0, tests: testsByWeek.get(index + 1) || 0 })),
    };

    const recentHospitals = await this.db.query(`SELECT id, name, createdAt FROM hospital ORDER BY createdAt DESC LIMIT 2`);
    const recentDocs = await this.db.query(`SELECT id, name, createdAt FROM doctor ORDER BY createdAt DESC LIMIT 2`);
    const recentActivities = [
      ...recentHospitals.map(h => ({
        id: `hospital-${h.id}`,
        type: 'New Hospital',
        title: 'New Hospital Registered',
        description: `${h.name} joined the network`,
        time: new Date(h.createdAt).toLocaleTimeString(),
        status: 'completed'
      })),
      ...recentDocs.map(d => ({
        id: `doctor-${d.id}`,
        type: 'New Doctor',
        title: 'New Doctor Registered',
        description: `Dr. ${d.name.replace(/^(Dr\.?\s*)+/i, '')} joined the network`,
        time: new Date(d.createdAt).toLocaleTimeString(),
        status: 'completed'
      }))
    ];

    return {
      kpis: {
        patients: Number(totalPatientsRow.c),
        doctors: Number(totalDoctorsRow.c),
        hospitals: Number(totalHospitalsRow.c),
        reports: Number(totalReportsRow.c),
        revenue: totalRevenue
      },
      userDistributionData,
      activityDataByPeriod,
      recentActivities
    };
  }

  private generateHospitalId(name: string, phone: string) {
    const initials = name.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2);
    const safePhone = phone || '000';
    const last3Phone = safePhone.length >= 3 ? safePhone.slice(-3) : safePhone.padStart(3, '0');
    const last2Year = new Date().getFullYear().toString().slice(-2);
    return `${initials}${last3Phone}${last2Year}`;
  }

  async getAllHospitals() {
    const hospitals = await this.db.query('SELECT * FROM hospital WHERE type = "HOSPITAL"');
    
    return Promise.all(hospitals.map(async h => {
      const docCount = await this.db.queryOne('SELECT COUNT(*) as c FROM doctor WHERE hospitalId = ?', [h.id]);
      const recCount = await this.db.queryOne('SELECT COUNT(*) as c FROM medicalrecord WHERE hospitalId = ?', [h.id]);
      const invCount = await this.db.queryOne('SELECT COUNT(*) as c FROM invoice WHERE hospitalId = ?', [h.id]);
      return {
        ...h,
        _count: {
          doctor: Number(docCount.c),
          medicalrecord: Number(recCount.c),
          invoice: Number(invCount.c)
        }
      };
    }));
  }

  async createHospital(data: any) {
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const email = String(data.email || '').trim().toLowerCase();
    if (!name || !phone || !email) {
      throw new BadRequestException('Hospital name, email and phone are required.');
    }

    const facilityType = String(data.type || '').toUpperCase() === 'LAB' ? 'LAB' : 'HOSPITAL';
    const existingByEmail = await this.db.queryOne(
      'SELECT * FROM hospital WHERE LOWER(email) = ? LIMIT 1',
      [email],
    );
    const existingByPhone = await this.db.queryOne(
      'SELECT * FROM hospital WHERE phone = ? LIMIT 1',
      [phone],
    );
    if (existingByPhone && existingByPhone.id !== existingByEmail?.id) {
      throw new ConflictException('A facility with this phone already exists.');
    }
    const existingUser = await this.db.queryOne('SELECT * FROM user WHERE LOWER(email) = ? LIMIT 1', [email]);

    // Old builds could save hospitals as type "General". A retry should repair
    // that pending workspace instead of trapping the user behind a duplicate error.
    if (existingByEmail) {
      if (String(existingByEmail.status).toUpperCase() !== 'PENDING') {
        throw new ConflictException('A facility with this email already exists.');
      }
      if (existingUser && existingUser.hospitalId && existingUser.hospitalId !== existingByEmail.id) {
        throw new ConflictException('This email belongs to another account.');
      }

      const temporaryPassword = String(data.password || 'password123');
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);
      const now = new Date();
      const connection = await this.db.getPool().getConnection();
      try {
        await connection.beginTransaction();
        await connection.execute(
          `UPDATE hospital
           SET name = ?, email = ?, phone = ?, address = ?, licenseNumber = ?,
               type = ?, updatedAt = ?
           WHERE id = ?`,
          [name, email, phone, data.address || existingByEmail.address, data.licenseNumber || existingByEmail.licenseNumber, facilityType, now, existingByEmail.id],
        );
        if (existingUser) {
          await connection.execute(
            `UPDATE user SET name = ?, phone = ?, password = ?, role = ?,
              hospitalId = ?, status = 'Active', updatedAt = ? WHERE id = ?`,
            [`${name} Admin`, phone, passwordHash, facilityType === 'LAB' ? 'LABORATORY' : 'HOSPITAL', existingByEmail.id, now, existingUser.id],
          );
        } else {
          const userId = uuidv4();
          await connection.execute(
            `INSERT INTO user
              (id, name, email, phone, password, role, hospitalId, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)`,
            [userId, `${name} Admin`, email, phone, passwordHash, facilityType === 'LAB' ? 'LABORATORY' : 'HOSPITAL', existingByEmail.id, now, now],
          );
        }
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      return {
        success: true,
        recovered: true,
        hospital: { id: existingByEmail.id, name, email, type: facilityType, status: 'Pending' },
        adminUser: { id: existingUser?.id, email },
      };
    }
    if (existingUser) throw new ConflictException('A user with this email already exists.');

    let hId = this.generateHospitalId(name, phone);
    if (await this.db.queryOne('SELECT id FROM hospital WHERE id = ?', [hId])) {
      hId = `${hId}-${uuidv4().slice(0, 4).toUpperCase()}`;
    }

    const uId = uuidv4();
    const temporaryPassword = String(data.password || 'password123');
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    const now = new Date();
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO hospital
          (id, name, email, phone, address, licenseNumber, type, status, isVerified, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', false, ?, ?)`,
        [hId, name, email, phone, data.address || null, data.licenseNumber || null, facilityType, now, now],
      );
      await connection.execute(
        `INSERT INTO user
          (id, name, email, phone, password, role, hospitalId, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)`,
        [uId, `${name} Admin`, email, phone, passwordHash, facilityType === 'LAB' ? 'LABORATORY' : 'HOSPITAL', hId, now, now],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    return {
      success: true,
      hospital: { id: hId, name, email, type: facilityType, status: 'Pending' },
      adminUser: { id: uId, email },
    };
  }

  async verifyHospital(id: string) {
    await this.db.query('UPDATE hospital SET isVerified = true, status = "Active" WHERE id = ?', [id]);
    return { success: true };
  }

  async updateHospitalStatus(id: string, status: string) {
    await this.db.query('UPDATE hospital SET status = ? WHERE id = ?', [status, id]);
    return { success: true };
  }

  async updateHospital(id: string, data: any) {
    await this.db.query(
      'UPDATE hospital SET name = ?, email = ?, phone = ?, address = ?, licenseNumber = ? WHERE id = ?',
      [data.name, data.email, data.phone, data.address, data.licenseNumber, id]
    );
    return { success: true };
  }

  async getAllLabs() {
    const labs = await this.db.query('SELECT * FROM hospital WHERE type = "LAB"');
    return Promise.all(labs.map(async l => {
      const trCount = await this.db.queryOne('SELECT COUNT(*) as c FROM testrequest WHERE hospitalId = ?', [l.id]);
      const sCount = await this.db.queryOne('SELECT COUNT(*) as c FROM sample WHERE hospitalId = ?', [l.id]);
      const uCount = await this.db.queryOne('SELECT COUNT(*) as c FROM user WHERE hospitalId = ?', [l.id]);
      const recentActivity = await this.db.query(`SELECT id, testType, status, updatedAt FROM testrequest WHERE hospitalId = ? ORDER BY updatedAt DESC LIMIT 3`, [l.id]);
      return {
        ...l,
        recentActivity: recentActivity.map(row => ({ id: row.id, title: row.status === 'Completed' ? 'Test completed' : 'Test request updated', desc: `${row.testType || 'Laboratory test'} · ${row.status}`, time: new Date(row.updatedAt).toLocaleString('en-IN') })),
        _count: {
          testrequest: Number(trCount.c),
          sample: Number(sCount.c),
          user: Number(uCount.c)
        }
      };
    }));
  }

  async getAllReports() {
    const reports = await this.db.query(`
      SELECT m.*, p.name as patientName, h.name as hospitalName 
      FROM medicalrecord m
      LEFT JOIN patient p ON m.patientId = p.id
      LEFT JOIN hospital h ON m.hospitalId = h.id
      ORDER BY m.createdAt DESC
    `);
    
    return reports.map(r => ({
      ...formatPrescriptionRecord(r),
      patient: { id: r.patientId, name: r.patientName },
      hospital: { id: r.hospitalId, name: r.hospitalName }
    }));
  }

  async getReportPatients() {
    const rows = await this.db.query(`
      SELECT
        p.id AS patientId, p.name AS patientName, p.email AS patientEmail,
        p.phone AS patientPhone, p.dateOfBirth, p.gender, p.bloodGroup,
        p.createdAt AS patientCreatedAt,
        m.id AS reportId, m.title, m.description, m.type, m.category,
        m.fileUrl, m.date AS reportDate, m.status AS reportStatus,
        m.createdAt AS reportCreatedAt, m.hospitalId,
        h.name AS hospitalName, h.type AS hospitalType
      FROM patient p
      LEFT JOIN medicalrecord m ON m.patientId = p.id
      LEFT JOIN hospital h ON h.id = m.hospitalId
      ORDER BY p.name ASC, COALESCE(m.date, m.createdAt) DESC
    `);

    const patients = new Map<string, any>();
    for (const row of rows) {
      if (!patients.has(row.patientId)) {
        const birthDate = row.dateOfBirth ? new Date(row.dateOfBirth) : null;
        const age = birthDate && !Number.isNaN(birthDate.getTime())
          ? Math.max(0, Math.floor((Date.now() - birthDate.getTime()) / 31557600000))
          : null;
        patients.set(row.patientId, {
          id: row.patientId,
          name: row.patientName,
          email: row.patientEmail || null,
          phone: row.patientPhone || null,
          dateOfBirth: row.dateOfBirth || null,
          age,
          gender: row.gender || 'Not specified',
          bloodGroup: row.bloodGroup || 'Unknown',
          registeredAt: row.patientCreatedAt,
          reportCount: 0,
          lastReportAt: null,
          reports: [],
        });
      }
      if (row.reportId) {
        const patient = patients.get(row.patientId);
        const report = {
          id: row.reportId,
          title: row.title || row.type || 'Medical report',
          description: row.description || null,
          type: row.type || row.category || 'DOCUMENT',
          category: row.category || row.type || 'General',
          fileUrl: row.fileUrl || null,
          date: row.reportDate || row.reportCreatedAt,
          createdAt: row.reportCreatedAt,
          status: row.reportStatus || 'Available',
          hospital: {
            id: row.hospitalId || null,
            name: row.hospitalName || 'Patient uploaded',
            type: row.hospitalType || 'Personal',
          },
        };
        patient.reports.push(report);
        patient.reportCount += 1;
        if (!patient.lastReportAt) patient.lastReportAt = report.date;
      }
    }
    return Array.from(patients.values());
  }

  async updateReportStatus(reportId: string, status: string) {
    await this.db.query('UPDATE medicalrecord SET status = ? WHERE id = ?', [status, reportId]);
    return { success: true };
  }

  async deleteReport(reportId: string) {
    await this.db.query('DELETE FROM medicalrecord WHERE id = ?', [reportId]);
    return { success: true };
  }

  async getAdminNotifications() {
    return this.db.query('SELECT * FROM notification WHERE hospitalId IS NULL ORDER BY createdAt DESC');
  }

  async markNotificationAsRead(id: string) {
    await this.db.query('UPDATE notification SET isRead = true WHERE id = ? AND hospitalId IS NULL', [id]);
    return { success: true };
  }

  async markAllAdminNotificationsAsRead() {
    await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId IS NULL AND isRead = false');
    return { success: true };
  }

  async createAdminNotification(data: any) {
    const now = new Date();
    await this.db.query(
      'INSERT INTO notification (id, title, message, type, severity, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, false, ?, ?)',
      [uuidv4(), data.title, data.message, data.type || 'System', data.severity || 'Low', now, now]
    );
    return { success: true };
  }

  async deleteNotification(id: string) {
    await this.db.query('DELETE FROM notification WHERE id = ? AND hospitalId IS NULL', [id]);
    return { success: true };
  }

  async getAnalytics() {
    const requestedTests = await this.db.query('SELECT testType, COUNT(id) as c FROM testrequest GROUP BY testType ORDER BY c DESC LIMIT 6');
    const requestedTestsData = requestedTests.map(t => ({
      name: t.testType,
      count: Number(t.c)
    }));
    const [patientMonths, doctorMonths, facilityMonths, reportMonths] = await Promise.all([
      this.db.query(`SELECT DATE_FORMAT(createdAt, '%Y-%m') AS monthKey, COUNT(*) AS count FROM patient WHERE createdAt >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(createdAt, '%Y-%m')`),
      this.db.query(`SELECT DATE_FORMAT(createdAt, '%Y-%m') AS monthKey, COUNT(*) AS count FROM doctor WHERE createdAt >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(createdAt, '%Y-%m')`),
      this.db.query(`SELECT DATE_FORMAT(createdAt, '%Y-%m') AS monthKey, SUM(CASE WHEN UPPER(type) IN ('LAB','LABORATORY','INDEPENDENT LAB') THEN 0 ELSE 1 END) AS hospitals, SUM(CASE WHEN UPPER(type) IN ('LAB','LABORATORY','INDEPENDENT LAB') THEN 1 ELSE 0 END) AS labs FROM hospital WHERE createdAt >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(createdAt, '%Y-%m')`),
      this.db.query(`SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, COUNT(*) AS uploaded, SUM(CASE WHEN UPPER(COALESCE(status,'')) = 'VERIFIED' THEN 1 ELSE 0 END) AS verified FROM medicalrecord WHERE date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(date, '%Y-%m')`),
    ]);
    const toMap = (rows: any[]) => new Map(rows.map(row => [row.monthKey, row]));
    const patientMap = toMap(patientMonths), doctorMap = toMap(doctorMonths), facilityMap = toMap(facilityMonths), reportMap = toMap(reportMonths);
    const months = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (5 - index)); return { key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`, label: date.toLocaleDateString('en-US', { month: 'short' }) }; });
    const growthData = months.map(month => ({ month: month.label, patients: Number(patientMap.get(month.key)?.count || 0), doctors: Number(doctorMap.get(month.key)?.count || 0), hospitals: Number(facilityMap.get(month.key)?.hospitals || 0), labs: Number(facilityMap.get(month.key)?.labs || 0) }));
    const reportStatsData = months.map(month => ({ name: month.label, uploaded: Number(reportMap.get(month.key)?.uploaded || 0), verified: Number(reportMap.get(month.key)?.verified || 0) }));

    return { growthData, requestedTestsData, reportStatsData };
  }

  async getSettings() {
    const settings = await this.db.query('SELECT * FROM setting');
    const result: any = {};
    settings.forEach(s => {
      try {
        result[s.key] = JSON.parse(s.value);
      } catch (e) {
        result[s.key] = s.value;
      }
    });
    return result;
  }

  async updateSettings(data: any) {
    for (const key of Object.keys(data)) {
      const value = typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]);
      const existing = await this.db.queryOne('SELECT * FROM setting WHERE `key` = ?', [key]);
      if (existing) {
        await this.db.query('UPDATE setting SET value = ?, updatedAt = ? WHERE `key` = ?', [value, new Date(), key]);
      } else {
        await this.db.query('INSERT INTO setting (`key`, value, updatedAt) VALUES (?, ?, ?)', [key, value, new Date()]);
      }
    }
    return { success: true };
  }

  async getAllUsers() {
    const patients = await this.db.query('SELECT id, name, email, phone, createdAt FROM patient');
    const doctors = await this.db.query('SELECT id, name, email, phone, createdAt FROM doctor');
    const admins = await this.db.query('SELECT id, name, email, role, createdAt FROM user');

    return { patients, doctors, admins };
  }

  async getLabStaff(labId: string) {
    return this.db.query('SELECT id, name, email, role, status, phone FROM user WHERE hospitalId = ?', [labId]);
  }

  async updateStaffStatus(userId: string, status: string) {
    await this.assertAdminManageableUser(userId);
    await this.db.query('UPDATE user SET status = ? WHERE id = ?', [status, userId]);
    return { success: true };
  }

  async getLabServices(labId: string) {
    return this.db.query('SELECT * FROM labservice WHERE hospitalId = ?', [labId]);
  }

  async updateLabServiceStatus(serviceId: string, status: string) {
    await this.db.query('UPDATE labservice SET status = ? WHERE id = ?', [status, serviceId]);
    return { success: true };
  }

  async getRoles() {
    const roles = await this.db.query('SELECT * FROM systemrole');
    
    return Promise.all(roles.map(async (role) => {
      const countRow = await this.db.queryOne('SELECT COUNT(*) as c FROM user WHERE role = ?', [role.name]);
      return {
        ...role,
        modules: JSON.parse(role.modules || '[]'),
        usersCount: Number(countRow.c)
      };
    }));
  }

  async createOrUpdateRole(data: any) {
    const modulesJson = JSON.stringify(data.modules);
    const existing = await this.db.queryOne('SELECT * FROM systemrole WHERE name = ?', [data.name]);
    
    if (existing) {
      await this.db.query(
        'UPDATE systemrole SET description = ?, color = ?, icon = ?, modules = ? WHERE name = ?',
        [data.desc || existing.description, data.color || existing.color, data.icon || existing.icon, modulesJson, data.name]
      );
    } else {
      await this.db.query(
        'INSERT INTO systemrole (id, name, description, color, icon, modules, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), data.name, data.desc || '', data.color || 'blue', data.icon || 'Shield', modulesJson, new Date()]
      );
    }
    return { success: true };
  }

  async getAccessUsers() {
    return this.db.query(`SELECT u.id, u.name, u.email, u.phone, u.role, u.status,
      u.createdAt, u.updatedAt as lastLogin, h.name as organization
      FROM user u
      LEFT JOIN hospital h ON u.hospitalId = h.id
      WHERE UPPER(u.role) NOT LIKE '%PATIENT%'
        AND REPLACE(REPLACE(REPLACE(UPPER(u.role), '_', ''), '-', ''), ' ', '') <> 'SUPERADMIN'`);
  }

  async provisionUser(data: any) {
    this.validateDelegatedRole(data.role);
    const uuidv4 = require('uuid').v4;
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    await this.db.query(
      'INSERT INTO user (id, name, email, phone, password, role, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), data.name, data.email, data.phone, hash, data.role, new Date()]
    );
    return { success: true };
  }

  async updateUserRole(userId: string, role: string) {
    await this.assertAdminManageableUser(userId);
    this.validateDelegatedRole(role);
    await this.db.query('UPDATE user SET role = ? WHERE id = ?', [role, userId]);
    return { success: true };
  }

  async resetUserPassword(userId: string) {
    await this.assertAdminManageableUser(userId);
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    await this.db.query('UPDATE user SET password = ? WHERE id = ?', [hash, userId]);
    return { success: true };
  }

  async deleteUser(userId: string) {
    await this.assertAdminManageableUser(userId);
    await this.db.query('DELETE FROM user WHERE id = ?', [userId]);
    return { success: true };
  }

  // ---- Subscriptions Routes ----
  async getSubscriptionPlans() {
    const plans = await this.db.query('SELECT * FROM subscriptionplan ORDER BY price ASC');
    return plans.map(p => {
      let featuresArray = [];
      if (typeof p.features === 'string') {
        try {
          featuresArray = JSON.parse(p.features);
        } catch (e) {
          featuresArray = p.features.split(',').map((f: string) => f.trim());
        }
      } else if (Array.isArray(p.features)) {
        featuresArray = p.features;
      }
      return { ...p, features: featuresArray };
    });
  }

  async createSubscriptionPlan(data: any) {
    const id = require('crypto').randomUUID();
    const features = JSON.stringify(data.features || []);
    const now = new Date();
    await this.db.query(
      'INSERT INTO subscriptionplan (id, name, price, target, features, popular, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, data.name, data.price, data.target || null, features, data.popular ? 1 : 0, now, now]
    );
    return { plan: { id, ...data, createdAt: now, updatedAt: now } };
  }

  async deleteSubscriptionPlan(id: string) {
    await this.db.query('DELETE FROM subscriptionplan WHERE id = ?', [id]);
    return { success: true };
  }
}
