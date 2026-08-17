import { BadRequestException, Injectable } from '@nestjs/common';
import { MysqlService } from '../../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
  constructor(private db: MysqlService) {}

  private normalizedRole(role: unknown) {
    return String(role || '').trim().toUpperCase().replace(/[\s_-]+/g, '');
  }

  private isManagedTeamRole(role: unknown) {
    return new Set([
      'ADMIN', 'SALES', 'SALESMANAGER', 'ACCOUNTS', 'ACCOUNTSMANAGER',
      'SUPPORT', 'SUPPORTTEAM', 'SUPPORTMANAGER',
    ]).has(this.normalizedRole(role));
  }

  async getOverview() {
    const [users, hospitals, labs, doctors, reports, admins, currentUsers, previousUsers, paidRevenue, monthlyRows, yearlyRows] = await Promise.all([
      this.db.queryOne('SELECT COUNT(*) AS c FROM user'),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM hospital WHERE LOWER(type) NOT LIKE '%lab%'`),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM hospital WHERE LOWER(type) LIKE '%lab%'`),
      this.db.queryOne('SELECT COUNT(*) AS c FROM doctor'),
      this.db.queryOne('SELECT COUNT(*) AS c FROM medicalrecord'),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM user WHERE role IN ('Admin','SuperAdmin') AND status = 'Active'`),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM user WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COUNT(*) AS c FROM user WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS total FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL')`),
      this.db.query(`SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, SUM(totalAmount) AS amount FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY monthKey`),
      this.db.query(`SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, SUM(totalAmount) AS amount FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(CURDATE(), '%Y-01-01') AND date < DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-01-01'), INTERVAL 1 YEAR) GROUP BY monthKey`),
    ]);
    const number = (row: any) => Number(row?.c || 0);
    const format = (value: number) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
    const current = number(currentUsers), previous = number(previousUsers);
    const growth = previous === 0 ? (current === 0 ? '0%' : 'New') : `${current >= previous ? '+' : ''}${Math.round(((current - previous) / previous) * 100)}%`;
    const monthly = new Map(monthlyRows.map(row => [row.monthKey, Number(row.amount || 0)]));
    const revenueData = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (5 - index)); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; return { month: date.toLocaleDateString('en-US', { month: 'short' }), amount: monthly.get(key) || 0 }; });
    const maxRevenue = Math.max(...revenueData.map(row => row.amount), 1);
    const yearly = new Map(yearlyRows.map(row => [row.monthKey, Number(row.amount || 0)]));
    const currentYear = new Date().getFullYear();
    const yearlyRevenueData = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(currentYear, index, 1);
      const key = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
      return { month: date.toLocaleDateString('en-US', { month: 'short' }), amount: yearly.get(key) || 0 };
    });
    const maxYearlyRevenue = Math.max(...yearlyRevenueData.map(row => row.amount), 1);
    const composition = [
      { region: 'Registered users', count: number(users), color: 'bg-blue-500' },
      { region: 'Doctors', count: number(doctors), color: 'bg-emerald-500' },
      { region: 'Hospitals & clinics', count: number(hospitals), color: 'bg-indigo-500' },
      { region: 'Laboratories', count: number(labs), color: 'bg-amber-500' },
    ];
    const maxCount = Math.max(...composition.map(row => row.count), 1);
    return {
      stats: { totalUsers: format(number(users)), totalHospitals: format(number(hospitals)), totalLabs: format(number(labs)), totalDoctors: format(number(doctors)), totalReports: format(number(reports)), activeAdmins: format(number(admins)), monthlyGrowth: growth, platformRevenue: `₹${Number(paidRevenue?.total || 0).toLocaleString('en-IN')}` },
      revenueData: revenueData.map(row => ({ ...row, percent: Math.round((row.amount / maxRevenue) * 100) })),
      yearlyRevenueData: yearlyRevenueData.map(row => ({ ...row, percent: Math.round((row.amount / maxYearlyRevenue) * 100) })),
      userDistribution: composition.map(row => ({ ...row, users: format(row.count), percent: Math.round((row.count / maxCount) * 100) })),
    };
  }

  private async getOverviewLegacy() {
    const totalUsersRow = await this.db.queryOne('SELECT COUNT(*) as c FROM patient');
    const totalHospitalsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM hospital WHERE LOWER(type) LIKE "%hospital%" OR LOWER(type) LIKE "%clinic%"');
    const totalLabsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM hospital WHERE LOWER(type) LIKE "%lab%"');
    const totalDoctorsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM doctor');
    const totalReportsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM medicalrecord');
    const activeAdminsRow = await this.db.queryOne('SELECT COUNT(*) as c FROM user WHERE role = "Admin" OR role = "SuperAdmin"');

    const formatNumber = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
    };

    return {
      stats: {
        totalUsers: formatNumber(Number(totalUsersRow.c)),
        totalHospitals: formatNumber(Number(totalHospitalsRow.c)),
        totalLabs: formatNumber(Number(totalLabsRow.c)),
        totalDoctors: formatNumber(Number(totalDoctorsRow.c)),
        totalReports: formatNumber(Number(totalReportsRow.c)),
        activeAdmins: formatNumber(Number(activeAdminsRow.c)),
        monthlyGrowth: "+15.4%",
        platformRevenue: "₹4.5M",
      },
      revenueData: [40, 70, 45, 90, 65, 100],
      userDistribution: [
        { region: 'North Region', users: '12.4k', percent: 85, color: 'bg-blue-500' },
        { region: 'South Region', users: '8.2k', percent: 65, color: 'bg-emerald-500' },
        { region: 'West Region',  users: '5.1k', percent: 45, color: 'bg-amber-500' },
        { region: 'East Region',  users: '2.8k', percent: 25, color: 'bg-rose-500' },
      ]
    };
  }

  async getFacilities() {
    const facilities = await this.db.query('SELECT id, name, email, type, address, createdAt, status, isVerified FROM hospital ORDER BY createdAt DESC');
    
    return facilities.map(f => {
      let mappedType = f.type ? f.type.toUpperCase() : 'HOSPITAL';
      if (mappedType.includes('LAB')) mappedType = 'Labs';
      else if (mappedType.includes('CLINIC')) mappedType = 'Clinic';
      else if (mappedType.includes('PHARMACY')) mappedType = 'Pharmacy';
      else mappedType = 'Hospital';

      return {
        id: f.id,
        name: f.name,
        email: f.email || 'No email provided',
        type: mappedType,
        location: f.address,
        joined: new Date(f.createdAt).toISOString().split('T')[0],
        registrationDate: new Date(f.createdAt).toISOString().split('T')[0],
        status: f.status === 'Active' && f.isVerified ? 'Active' : f.status,
        isVerified: !!f.isVerified
      };
    });
  }

  async getFacilityDetails(id: string) {
    const facility = await this.db.queryOne('SELECT * FROM hospital WHERE id = ?', [id]);
    if (!facility) throw new BadRequestException('Facility not found');

    const [doctors, departments, patientCount, reportsCount, appointmentsCount, invoices] = await Promise.all([
      this.db.query(`
        SELECT d.id, d.name, d.specialization, d.email, d.phone, d.status, d.shift,
          (SELECT COUNT(DISTINCT ar.patientId) FROM accessrequest ar
            WHERE ar.doctorId = d.id AND ar.hospitalId = d.hospitalId) AS patientsCount
        FROM doctor d
        WHERE d.hospitalId = ?
        ORDER BY d.name ASC
      `, [id]),
      this.db.query(`
        SELECT COALESCE(NULLIF(specialization, ''), 'General') AS name, COUNT(*) AS doctors
        FROM doctor WHERE hospitalId = ?
        GROUP BY COALESCE(NULLIF(specialization, ''), 'General')
        ORDER BY doctors DESC, name ASC
      `, [id]),
      this.db.queryOne(`
        SELECT COUNT(DISTINCT patientId) AS c FROM (
          SELECT patientId FROM accessrequest WHERE hospitalId = ?
          UNION SELECT patientId FROM medicalrecord WHERE hospitalId = ?
          UNION SELECT a.patientId FROM appointment a INNER JOIN doctor d ON d.id = a.doctorId WHERE d.hospitalId = ?
          UNION SELECT patientId FROM testrequest WHERE hospitalId = ? OR referringHospitalId = ?
        ) linkedPatients
      `, [id, id, id, id, id]),
      this.db.queryOne('SELECT COUNT(*) AS c FROM medicalrecord WHERE hospitalId = ?', [id]),
      this.db.queryOne('SELECT COUNT(*) AS c FROM appointment a INNER JOIN doctor d ON d.id = a.doctorId WHERE d.hospitalId = ?', [id]),
      this.db.queryOne('SELECT COUNT(*) AS c, COALESCE(SUM(totalAmount), 0) AS total FROM invoice WHERE hospitalId = ?', [id]),
    ]);

    return {
      ...facility,
      doctors: doctors.map(doctor => ({ ...doctor, patientsCount: Number(doctor.patientsCount || 0) })),
      departments: departments.map(department => ({ ...department, doctors: Number(department.doctors || 0) })),
      metrics: {
        doctors: doctors.length,
        departments: departments.length,
        patients: Number(patientCount?.c || 0),
        reports: Number(reportsCount?.c || 0),
        appointments: Number(appointmentsCount?.c || 0),
        invoices: Number(invoices?.c || 0),
        billedAmount: Number(invoices?.total || 0),
      },
    };
  }

  async updateFacility(id: string, updateData: { status?: string, isVerified?: boolean }) {
    const facility = await this.db.queryOne('SELECT id FROM hospital WHERE id = ?', [id]);
    if (!facility) throw new BadRequestException('Facility not found.');
    if (updateData.status && updateData.isVerified !== undefined) {
      await this.db.query('UPDATE hospital SET status = ?, isVerified = ? WHERE id = ?', [updateData.status, updateData.isVerified, id]);
    } else if (updateData.status) {
      await this.db.query('UPDATE hospital SET status = ? WHERE id = ?', [updateData.status, id]);
    } else if (updateData.isVerified !== undefined) {
      await this.db.query('UPDATE hospital SET isVerified = ? WHERE id = ?', [updateData.isVerified, id]);
    }
    return { success: true };
  }

  async archiveFacility(id: string) {
    const facility = await this.db.queryOne('SELECT id FROM hospital WHERE id = ?', [id]);
    if (!facility) throw new BadRequestException('Facility not found.');
    await this.db.query('UPDATE hospital SET status = ?, updatedAt = ? WHERE id = ?', ['Suspended', new Date(), id]);
    return { success: true, status: 'Suspended' };
  }

  async getAnalytics() {
    const [facilities, revenue, records, appointmentDays, testDays, revenueRows, tickets] = await Promise.all([
      this.db.queryOne(`SELECT COUNT(*) AS c FROM hospital WHERE status = 'Active' AND isVerified = true`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount),0) AS total FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne('SELECT COUNT(*) AS c FROM medicalrecord'),
      this.db.query(`SELECT DATE(createdAt) AS day, COUNT(*) AS c FROM appointment WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY DATE(createdAt)`),
      this.db.query(`SELECT DATE(createdAt) AS day, COUNT(*) AS c FROM testrequest WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY DATE(createdAt)`),
      this.db.query(`SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, SUM(totalAmount) AS revenue FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY monthKey`),
      this.db.query('SELECT id, ticketId, subject, priority, status, updatedAt FROM support_ticket ORDER BY updatedAt DESC LIMIT 5'),
    ]);
    const key = (value: any) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
    const appointments = new Map(appointmentDays.map(row => [key(row.day), Number(row.c)]));
    const tests = new Map(testDays.map(row => [key(row.day), Number(row.c)]));
    const apiUsageData = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate() - (6-index)); const day = key(date); return { name: date.toLocaleDateString('en-US',{weekday:'short'}), requests: (appointments.get(day)||0) + (tests.get(day)||0) }; });
    const monthly = new Map(revenueRows.map(row => [row.monthKey, Number(row.revenue || 0)]));
    const revenueData = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (5-index)); const monthKey = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`; return { month: date.toLocaleDateString('en-US',{month:'short'}), revenue: monthly.get(monthKey)||0 }; });
    return {
      kpis: { systemUptime: null, monthlyRevenue: Number(revenue?.total || 0), activeFacilities: Number(facilities?.c || 0), storedRecords: Number(records?.c || 0) },
      apiUsageData,
      revenueData,
      recentLogs: tickets.map(ticket => ({ id: ticket.id, type: String(ticket.priority).toLowerCase() === 'high' ? 'warning' : 'info', message: ticket.subject, source: `${ticket.ticketId} · ${ticket.status}`, time: new Date(ticket.updatedAt).toLocaleString('en-IN') })),
    };
  }

  private async getAnalyticsLegacy() {
    const activeFacilitiesRow = await this.db.queryOne('SELECT COUNT(*) as c FROM hospital WHERE status = "Active" AND isVerified = true');

    return {
      kpis: {
        systemUptime: 99.9,
        monthlyRevenue: 4500000,
        activeFacilities: Number(activeFacilitiesRow.c),
        storageUsedGb: 512,
        storageTotalGb: 1024
      },
      apiUsageData: [
        { name: 'Mon', requests: 12000 }, { name: 'Tue', requests: 15000 }, { name: 'Wed', requests: 13500 },
        { name: 'Thu', requests: 18000 }, { name: 'Fri', requests: 22000 }, { name: 'Sat', requests: 19000 }, { name: 'Sun', requests: 14000 }
      ],
      revenueData: [
        { month: 'Jan', revenue: 2000000 }, { month: 'Feb', revenue: 2500000 }, { month: 'Mar', revenue: 3200000 },
        { month: 'Apr', revenue: 3800000 }, { month: 'May', revenue: 4100000 }, { month: 'Jun', revenue: 4500000 }
      ],
      recentLogs: [
        { id: 1, type: 'error', message: 'Database connection timeout', source: 'db-cluster-1', time: '10 mins ago' },
        { id: 2, type: 'warning', message: 'High memory usage detected', source: 'worker-node-3', time: '1 hour ago' },
        { id: 3, type: 'info', message: 'Automated backup completed', source: 'backup-service', time: '3 hours ago' },
        { id: 4, type: 'info', message: 'New platform version deployed', source: 'ci-cd-pipeline', time: 'Yesterday' }
      ]
    };
  }

  async getAdmins() {
    const admins = await this.db.query(`
      SELECT u.id, u.name, u.email, u.role, u.phone, u.status, u.createdAt,
        (SELECT MAX(a.createdAt) FROM audit_log a
          WHERE CONVERT(a.user_email USING utf8mb4) COLLATE utf8mb4_unicode_ci = CONVERT(u.email USING utf8mb4) COLLATE utf8mb4_unicode_ci
          AND UPPER(a.action_type) = 'LOGIN') AS lastLogin
      FROM user u
      WHERE u.role IN (
        'Admin', 'ADMIN', 'SuperAdmin', 'Super Admin', 'SUPER_ADMIN',
        'Sales Manager', 'SALES',
        'Accounts Manager', 'ACCOUNTS',
        'Support Team', 'Support Manager', 'SUPPORT'
      )
      ORDER BY u.createdAt DESC
    `);
    const displayRole = (role: unknown) => {
      const normalized = String(role || '').trim().toUpperCase().replaceAll('_', ' ');
      if (normalized === 'SALES' || normalized === 'SALES MANAGER') return 'Sales Manager';
      if (normalized === 'ACCOUNTS' || normalized === 'ACCOUNTS MANAGER') return 'Accounts Manager';
      if (normalized === 'SUPPORT' || normalized === 'SUPPORT TEAM' || normalized === 'SUPPORT MANAGER') return 'Support Team';
      if (normalized === 'SUPERADMIN' || normalized === 'SUPER ADMIN') return 'Super Admin';
      return 'Admin';
    };
    return admins.map(admin => ({ ...admin, role: displayRole(admin.role), createdBy: 'Not recorded' }));
  }

  async getAdminLogs(id: string) {
    const admin = await this.db.queryOne(
      'SELECT id, name, email, role, status, createdAt, updatedAt FROM user WHERE id = ?',
      [id],
    );
    if (!admin) return [];

    const auditRows = await this.db.query(
      'SELECT id, action_type, entity_type, details, ip_address, createdAt FROM audit_log WHERE LOWER(user_email) = LOWER(?) ORDER BY createdAt DESC LIMIT 50',
      [admin.email],
    );
    const logs = auditRows.map(row => ({
      id: row.id,
      action: row.details || `${row.action_type} ${row.entity_type}`,
      type: row.action_type,
      timestamp: row.createdAt,
      ipAddress: row.ip_address || 'Not recorded',
    }));

    const createdAt = new Date(admin.createdAt);
    const updatedAt = new Date(admin.updatedAt);
    logs.push({
      id: `account-created-${admin.id}`,
      action: `${admin.role} account created for ${admin.name}`,
      type: 'CREATE',
      timestamp: createdAt,
      ipAddress: 'System',
    });
    if (updatedAt.getTime() > createdAt.getTime() + 1000) {
      logs.push({
        id: `account-updated-${admin.id}`,
        action: `Account updated · Current status: ${admin.status || 'Active'}`,
        type: 'UPDATE',
        timestamp: updatedAt,
        ipAddress: 'System',
      });
    }

    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }

  async getAuditLogs() {
    const rows = await this.db.query('SELECT * FROM audit_log ORDER BY createdAt DESC LIMIT 100');
    return rows.map(row => ({ 
      id: row.id, 
      action_type: row.action_type, 
      user_email: row.user_email, 
      entity_type: row.entity_type,
      details: row.details, 
      ip_address: row.ip_address,
      created_at: row.createdAt 
    }));
  }

  async getPlatformSettings() {
    const rows = await this.db.query(`SELECT \`key\`, value FROM setting WHERE \`key\` LIKE 'platform.%'`);
    return rows.reduce((settings: Record<string, any>, row: any) => { const key = String(row.key).replace(/^platform\./, ''); const value = row.value === 'true' ? true : row.value === 'false' ? false : /^\d+$/.test(String(row.value)) ? Number(row.value) : row.value; settings[key] = value; return settings; }, {});
  }

  async savePlatformSettings(data: Record<string, any>) {
    for (const [key, value] of Object.entries(data)) {
      await this.db.query('INSERT INTO setting (`key`, value, updatedAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updatedAt = VALUES(updatedAt)', [`platform.${key}`, String(value), new Date()]);
    }
    return this.getPlatformSettings();
  }

  async getPlatformNotifications() {
    const rows = await this.db.query('SELECT id, type, severity, title, message, isRead, actionRequired, createdAt FROM notification WHERE hospitalId IS NULL ORDER BY createdAt DESC LIMIT 100');
    return rows.map(row => {
      const sourceType = String(row.type || '').toLowerCase();
      const isSupportTicket = sourceType.startsWith('support_ticket');
      return {
        id: row.id,
        type: String(row.severity || row.type || 'info').toLowerCase(),
        source_type: sourceType,
        title: row.title,
        message: row.message,
        is_read: Boolean(row.isRead),
        action_url: isSupportTicket
          ? '/management/super-admin/support'
          : row.actionRequired
            ? '/management/super-admin/overview'
            : null,
        created_at: row.createdAt,
      };
    });
  }

  async updatePlatformNotifications(id?: string, markAll = false) {
    if (markAll) await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId IS NULL');
    else if (id) await this.db.query('UPDATE notification SET isRead = true WHERE id = ? AND hospitalId IS NULL', [id]);
    return { success: true };
  }

  async createAdmin(data: any) {
    if (!this.isManagedTeamRole(data.role || 'Admin')) {
      throw new BadRequestException('Only Admin, Sales, Accounts, or Support team roles can be created here.');
    }
    const existing = await this.db.queryOne('SELECT id FROM user WHERE email = ?', [data.email]);
    if (existing) {
      return { success: false, error: "Email already in use" };
    }
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const createdAt = new Date();
    await this.db.query('INSERT INTO user (id, name, email, phone, role, password, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, data.fullName, data.email, data.phone || null, data.role || 'Admin', hashedPassword, 'Active', createdAt, createdAt]
    );
    return { 
      success: true, 
      admin: {
        id,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role || 'Admin',
        status: 'Active',
        lastLogin: null,
        createdAt,
        createdBy: 'Not recorded',
      }
    };
  }

  async updateAdminStatus(id: string, status: string) {
    const admin = await this.db.queryOne('SELECT id, role FROM user WHERE id = ?', [id]);
    if (!admin || !this.isManagedTeamRole(admin.role)) {
      throw new BadRequestException('This management account cannot be changed from Team Management.');
    }
    const allowedStatuses = new Set(['Active', 'Inactive', 'Pending', 'Rejected', 'Suspended']);
    if (!allowedStatuses.has(status)) throw new BadRequestException('Invalid account status.');
    await this.db.query('UPDATE user SET status = ?, updatedAt = ? WHERE id = ?', [status, new Date(), id]);
    return { success: true };
  }

  async deleteAdmin(id: string) {
    const admin = await this.db.queryOne('SELECT id, role FROM user WHERE id = ?', [id]);
    if (!admin || !this.isManagedTeamRole(admin.role)) {
      throw new BadRequestException('This management account cannot be removed from Team Management.');
    }
    await this.db.query('UPDATE user SET status = ?, updatedAt = ? WHERE id = ?', ['Inactive', new Date(), id]);
    return { success: true, status: 'Inactive' };
  }

  async getAllUsers() {
    const patients = await this.db.query(
      `SELECT p.id, p.name, p.email, p.phone, p.createdAt, u.id AS accountUserId
       FROM patient p
       LEFT JOIN user u ON LOWER(u.email) = LOWER(p.email)
       ORDER BY p.createdAt DESC`,
    );
    const doctors = await this.db.query(
      `SELECT d.id, d.name, d.email, d.phone, d.address, d.status, d.createdAt,
              u.id AS accountUserId
       FROM doctor d
       LEFT JOIN user u ON LOWER(u.email) = LOWER(d.email)
       ORDER BY d.createdAt DESC`,
    );
    const activityRows = await this.db.query(
      `SELECT
         userId,
         COUNT(*) AS sessionCount,
         SUM(
           durationSeconds +
           CASE
             WHEN endedAt IS NULL AND lastSeenAt >= DATE_SUB(NOW(3), INTERVAL 2 MINUTE)
             THEN LEAST(GREATEST(TIMESTAMPDIFF(SECOND, lastSeenAt, NOW(3)), 0), 120)
             ELSE 0
           END
         ) AS totalSeconds,
         MAX(lastSeenAt) AS lastActiveAt,
         MAX(startedAt) AS latestSessionStartedAt,
         MAX(
           CASE
             WHEN endedAt IS NULL AND lastSeenAt >= DATE_SUB(NOW(3), INTERVAL 2 MINUTE)
             THEN 1 ELSE 0
           END
         ) AS isOnline
       FROM user_activity_session
       GROUP BY userId`,
    );
    const activityByUser = new Map(
      activityRows.map((row: any) => [row.userId, row]),
    );
    const withActivity = (profile: any) => {
      const activity: any = activityByUser.get(profile.accountUserId);
      return {
        accountUserId: profile.accountUserId || null,
        totalTimeSeconds: Number(activity?.totalSeconds || 0),
        sessionCount: Number(activity?.sessionCount || 0),
        lastActiveAt: activity?.lastActiveAt || null,
        latestSessionStartedAt: activity?.latestSessionStartedAt || null,
        isOnline: Boolean(Number(activity?.isOnline || 0)),
      };
    };

    const formattedUsers = [
      ...patients.map(p => ({
        id: p.id,
        name: p.name || 'Unknown Patient',
        email: p.email || 'No email provided',
        phone: p.phone || '',
        type: 'Patient',
        location: 'Not specified',
        joined: new Date(p.createdAt).toISOString().split('T')[0],
        status: 'Active',
        isVerified: true,
        ...withActivity(p),
      })),
      ...doctors.map(d => ({
        id: d.id,
        name: d.name || 'Unknown Doctor',
        email: d.email || 'No email provided',
        phone: d.phone || '',
        type: 'Doctor',
        location: d.address || 'Not specified',
        joined: new Date(d.createdAt).toISOString().split('T')[0],
        status: d.status || 'Active',
        isVerified: d.status === 'Active',
        ...withActivity(d),
      }))
    ];

    // Sort by joined date descending
    formattedUsers.sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime());

    return formattedUsers;
  }

  async updateUserStatus(id: string, status: string, isVerified?: boolean) {
    try {
      await this.db.query('UPDATE doctor SET status = ? WHERE id = ?', [status, id]);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }

  async deleteUser(id: string) {
    try {
      await this.db.query('DELETE FROM patient WHERE id = ?', [id]);
      await this.db.query('DELETE FROM doctor WHERE id = ?', [id]);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
}
