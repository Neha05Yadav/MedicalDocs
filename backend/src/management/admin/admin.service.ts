import { Injectable } from '@nestjs/common';
import { MysqlService } from '../../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { formatPrescriptionRecord } from '../../prescription-id';

@Injectable()
export class AdminService {
  constructor(private db: MysqlService) {}

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
        description: `Dr. ${d.name} joined the network`,
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
    const hId = this.generateHospitalId(data.name, data.phone);
    await this.db.query(
      'INSERT INTO hospital (id, name, email, phone, address, licenseNumber, type, status, isVerified, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [hId, data.name, data.email, data.phone, data.address, data.licenseNumber, data.type || 'HOSPITAL', 'Pending', false, new Date()]
    );

    const uId = uuidv4();
    const email = data.email || `admin@${data.name.replace(/\s+/g, '').toLowerCase()}.com`;
    await this.db.query(
      'INSERT INTO user (id, name, email, phone, password, role, hospitalId, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uId, `${data.name} Admin`, email, data.phone, 'password123', 'HOSPITAL', hId, new Date()]
    );

    return { hospital: { id: hId }, adminUser: { id: uId } };
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
    await this.db.query('UPDATE notification SET isRead = true WHERE id = ?', [id]);
    return { success: true };
  }

  async markAllAdminNotificationsAsRead() {
    await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId IS NULL AND isRead = false');
    return { success: true };
  }

  async createAdminNotification(data: any) {
    await this.db.query(
      'INSERT INTO notification (id, title, message, type, severity, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), data.title, data.message, data.type || 'System', data.severity || 'Low', new Date()]
    );
    return { success: true };
  }

  async deleteNotification(id: string) {
    await this.db.query('DELETE FROM notification WHERE id = ?', [id]);
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
    return this.db.query('SELECT u.id, u.name, u.email, u.phone, u.role, u.status, u.createdAt, u.updatedAt as lastLogin, h.name as organization FROM user u LEFT JOIN hospital h ON u.hospitalId = h.id WHERE UPPER(u.role) NOT LIKE "%PATIENT%"');
  }

  async provisionUser(data: any) {
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
    await this.db.query('UPDATE user SET role = ? WHERE id = ?', [role, userId]);
    return { success: true };
  }

  async resetUserPassword(userId: string) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    await this.db.query('UPDATE user SET password = ? WHERE id = ?', [hash, userId]);
    return { success: true };
  }

  async deleteUser(userId: string) {
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
    await this.db.query(
      'INSERT INTO subscriptionplan (id, name, price, target, features, popular) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.name, data.price, data.target, features, data.popular ? 1 : 0]
    );
    return { plan: { id, ...data } };
  }

  async deleteSubscriptionPlan(id: string) {
    await this.db.query('DELETE FROM subscriptionplan WHERE id = ?', [id]);
    return { success: true };
  }
}
