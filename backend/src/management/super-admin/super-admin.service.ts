import { Injectable } from '@nestjs/common';
import { MysqlService } from '../../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
  constructor(private db: MysqlService) {}

  async getOverview() {
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
