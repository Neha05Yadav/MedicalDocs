import { Injectable } from '@nestjs/common';
import { MysqlService } from '../../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
  constructor(private db: MysqlService) {}

  async getOverview() {
    const [users, hospitals, labs, doctors, reports, admins, currentUsers, previousUsers, paidRevenue, monthlyRows] = await Promise.all([
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
    ]);
    const number = (row: any) => Number(row?.c || 0);
    const format = (value: number) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
    const current = number(currentUsers), previous = number(previousUsers);
    const growth = previous === 0 ? (current === 0 ? '0%' : 'New') : `${current >= previous ? '+' : ''}${Math.round(((current - previous) / previous) * 100)}%`;
    const monthly = new Map(monthlyRows.map(row => [row.monthKey, Number(row.amount || 0)]));
    const revenueData = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (5 - index)); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; return { month: date.toLocaleDateString('en-US', { month: 'short' }), amount: monthly.get(key) || 0 }; });
    const maxRevenue = Math.max(...revenueData.map(row => row.amount), 1);
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

  async updateFacility(id: string, updateData: { status?: string, isVerified?: boolean }) {
    if (updateData.status && updateData.isVerified !== undefined) {
      await this.db.query('UPDATE hospital SET status = ?, isVerified = ? WHERE id = ?', [updateData.status, updateData.isVerified, id]);
    } else if (updateData.status) {
      await this.db.query('UPDATE hospital SET status = ? WHERE id = ?', [updateData.status, id]);
    } else if (updateData.isVerified !== undefined) {
      await this.db.query('UPDATE hospital SET isVerified = ? WHERE id = ?', [updateData.isVerified, id]);
    }
    return { success: true };
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
    const admins = await this.db.query('SELECT id, name, email, role, phone, status, updatedAt as lastLogin FROM user WHERE role IN ("Admin", "SuperAdmin") ORDER BY createdAt DESC');
    return admins;
  }

  async getAuditLogs() {
    const rows = await this.db.query('SELECT id, type, title, message, createdAt FROM notification ORDER BY createdAt DESC LIMIT 100');
    return rows.map(row => ({ id: row.id, action_type: String(row.type || 'INFO').toUpperCase(), user_email: 'system', details: `${row.title || 'Notification'}: ${row.message || ''}`, created_at: row.createdAt }));
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
    return rows.map(row => ({ id: row.id, type: String(row.severity || row.type || 'info').toLowerCase(), title: row.title, message: row.message, is_read: Boolean(row.isRead), action_url: row.actionRequired ? '/management/support/notifications' : null, created_at: row.createdAt }));
  }

  async updatePlatformNotifications(id?: string, markAll = false) {
    if (markAll) await this.db.query('UPDATE notification SET isRead = true WHERE hospitalId IS NULL');
    else if (id) await this.db.query('UPDATE notification SET isRead = true WHERE id = ? AND hospitalId IS NULL', [id]);
    return { success: true };
  }

  async createAdmin(data: any) {
    const existing = await this.db.queryOne('SELECT id FROM user WHERE email = ?', [data.email]);
    if (existing) {
      return { success: false, error: "Email already in use" };
    }
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.db.query('INSERT INTO user (id, name, email, phone, role, password, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, data.fullName, data.email, data.phone || null, data.role || 'Admin', hashedPassword, 'Active', new Date(), new Date()]
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
        lastLogin: new Date()
      }
    };
  }

  async updateAdminStatus(id: string, status: string) {
    await this.db.query('UPDATE user SET status = ?, updatedAt = ? WHERE id = ? AND role IN ("Admin", "SuperAdmin")', [status, new Date(), id]);
    return { success: true };
  }

  async deleteAdmin(id: string) {
    await this.db.query('DELETE FROM user WHERE id = ? AND role IN ("Admin", "SuperAdmin")', [id]);
    return { success: true };
  }

  async getAllUsers() {
    const patients = await this.db.query('SELECT id, name, email, createdAt FROM patient ORDER BY createdAt DESC');
    const doctors = await this.db.query('SELECT id, name, email, address, status, createdAt FROM doctor ORDER BY createdAt DESC');
    const hospitals = await this.db.query('SELECT id, name, email, type, address, status, isVerified, createdAt FROM hospital ORDER BY createdAt DESC');

    const formattedUsers = [
      ...patients.map(p => ({
        id: p.id,
        name: p.name || 'Unknown Patient',
        email: p.email || 'No email provided',
        type: 'Patient',
        location: 'Not specified',
        joined: new Date(p.createdAt).toISOString().split('T')[0],
        status: 'Active',
        isVerified: true
      })),
      ...doctors.map(d => ({
        id: d.id,
        name: d.name || 'Unknown Doctor',
        email: d.email || 'No email provided',
        type: 'Doctor',
        location: d.address || 'Not specified',
        joined: new Date(d.createdAt).toISOString().split('T')[0],
        status: d.status || 'Active',
        isVerified: d.status === 'Active'
      })),
      ...hospitals.map(h => {
        let mappedType = h.type ? h.type.toUpperCase() : 'HOSPITAL';
        if (mappedType.includes('LAB')) mappedType = 'Labs';
        else if (mappedType.includes('CLINIC')) mappedType = 'Clinic';
        else mappedType = 'Hospital';

        return {
          id: h.id,
          name: h.name || 'Unknown Facility',
          email: h.email || 'No email provided',
          type: mappedType,
          location: h.address || 'Not specified',
          joined: new Date(h.createdAt).toISOString().split('T')[0],
          status: h.status || 'Pending',
          isVerified: !!h.isVerified
        };
      })
    ];

    // Sort by joined date descending
    formattedUsers.sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime());

    return formattedUsers;
  }

  async updateUserStatus(id: string, status: string, isVerified?: boolean) {
    // We don't know the type, so we try updating all tables that have status
    try {
      await this.db.query('UPDATE doctor SET status = ? WHERE id = ?', [status, id]);
      if (isVerified !== undefined) {
        await this.db.query('UPDATE hospital SET status = ?, isVerified = ? WHERE id = ?', [status, isVerified, id]);
      } else {
        await this.db.query('UPDATE hospital SET status = ? WHERE id = ?', [status, id]);
      }
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }

  async deleteUser(id: string) {
    try {
      await this.db.query('DELETE FROM patient WHERE id = ?', [id]);
      await this.db.query('DELETE FROM doctor WHERE id = ?', [id]);
      await this.db.query('DELETE FROM hospital WHERE id = ?', [id]);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
}
