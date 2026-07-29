import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PUBLIC_SIGNUP_ROLES, SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { allocatePatientId } from '../patient-id';
import { MailService } from './mail.service';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private db: MysqlService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, role, name } = signupDto;
    const userRole = role || 'PATIENT';

    // Public signup must never create privileged management accounts. Keep this
    // service-level check even when validation is bypassed by an internal caller.
    if (!(PUBLIC_SIGNUP_ROLES as readonly string[]).includes(userRole)) {
      throw new BadRequestException('Invalid email or password');
    }

    // Email already exist karta hai?
    const existingUser = await this.db.queryOne('SELECT * FROM user WHERE email = ?', [email]);

    if (existingUser) {
      throw new ConflictException('Is email se account pehle se exist karta hai');
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // User create karo
    const userId = uuidv4();
    const now = new Date();
    
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        'INSERT INTO user (id, email, password, role, name, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, email, hashedPassword, userRole, name, 'Active', now],
      );

      const normalizedRole = userRole.toUpperCase();
      if (normalizedRole === 'PATIENT') {
        const patientId = await allocatePatientId(connection, name, now);
        await connection.execute(
          'INSERT INTO patient (id, name, email, phone, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [patientId, name, email, '', now],
        );
      } else if (['HOSPITAL', 'LAB', 'CLINIC', 'DOCTOR'].includes(normalizedRole)) {
        const facilityType = normalizedRole === 'LAB' ? 'LAB' : normalizedRole === 'HOSPITAL' ? 'HOSPITAL' : 'CLINIC';
        let facilityId = uuidv4();
        
        if (facilityType === 'LAB') {
          let prefix = (name || 'LA').replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
          if (prefix.length < 2) prefix = (prefix + 'LA').substring(0, 2);
          
          const [rows] = await connection.execute(
            `SELECT id FROM hospital WHERE type = 'LAB' AND id LIKE ? AND LENGTH(id) = 6 ORDER BY id DESC LIMIT 1`,
            [`${prefix}%`]
          );
          
          let nextNum = 1;
          const dbRows = rows as any[];
          if (dbRows && dbRows.length > 0) {
            const lastId = dbRows[0].id;
            const lastNumStr = lastId.substring(2);
            const lastNum = parseInt(lastNumStr, 10);
            if (!isNaN(lastNum)) {
              nextNum = lastNum + 1;
            }
          }
          facilityId = `${prefix}${String(nextNum).padStart(4, '0')}`;
        }

        await connection.execute(
          'INSERT INTO hospital (id, name, email, phone, type, status, isVerified, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [facilityId, name, email, '', facilityType, 'Pending', false, now],
        );
        await connection.execute('UPDATE user SET hospitalId = ? WHERE id = ?', [facilityId, userId]);

        if (normalizedRole === 'CLINIC' || normalizedRole === 'DOCTOR') {
          await connection.execute(
            'INSERT INTO doctor (id, name, email, phone, hospitalId, specialization, department, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), name, email, '', facilityId, 'General Medicine', 'General Medicine', 'Active', now],
          );
        }
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
    return this.createLoginResponse(
      { id: userId, email, name, role: userRole, status: 'Active' },
      'Your account has been created successfully.',
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateCredentials(loginDto);

    user.role = await this.resolvePortalRole(user);

    if (!this.isPublicAuthRole(user.role)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createLoginResponse(user);
  }

  async managementLogin(loginDto: LoginDto) {
    const user = await this.validateCredentials(loginDto);

    if (!this.isManagementRole(user.role)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createLoginResponse(user);
  }

  /**
   * Legacy records can contain a portal role that disagrees with the linked
   * facility (for example a laboratory saved as HOSPITAL). The facility link is
   * the authoritative tenant boundary, so derive only the portal-facing role
   * from its type. This changes neither ownership nor database data.
   */
  private async resolvePortalRole(user: any): Promise<string> {
    if (this.isManagementRole(user.role) || !user.hospitalId) {
      return user.role;
    }

    const facility = await this.db.queryOne<{ type: string | null }>(
      'SELECT type FROM hospital WHERE id = ? LIMIT 1',
      [user.hospitalId],
    );
    const facilityType = (facility?.type || '').toUpperCase();

    if (facilityType === 'LAB' || facilityType === 'LABORATORY') {
      return 'LABORATORY';
    }
    if (facilityType === 'HOSPITAL') {
      return 'HOSPITAL';
    }
    if (facilityType === 'CLINIC') {
      return 'CLINIC';
    }

    return user.role;
  }

  private async validateCredentials(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // User dhundo
    const user = await this.db.queryOne('SELECT * FROM user WHERE email = ?', [email]);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Account active hai?
    if (user.status && user.status !== 'Active') {
      throw new UnauthorizedException('Your account is inactive. Please contact an administrator for assistance.');
    }

    // Agar hospital se linked hai, toh check karo ki hospital suspended toh nahi hai
    if (user.hospitalId) {
      const hospital = await this.db.queryOne('SELECT status FROM hospital WHERE id = ? LIMIT 1', [user.hospitalId]);
      if (hospital && hospital.status === 'Suspended') {
        throw new UnauthorizedException("Your hospital's access has been suspended. Please contact the system administrator for assistance.");
      }
    }

    // Password verify karo
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private async createLoginResponse(user: any, message = 'Login successful!') {
    const sessionId = uuidv4();
    await this.db.query(
      `INSERT INTO user_activity_session
        (id, userId, startedAt, lastSeenAt, durationSeconds, createdAt, updatedAt)
       VALUES (?, ?, NOW(3), NOW(3), 0, NOW(3), NOW(3))`,
      [sessionId, user.id],
    );
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      sessionId,
    };

    return {
      message,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    };
  }

  async recordHeartbeat(userId: string, sessionId?: string) {
    if (!sessionId) {
      return { tracked: false };
    }

    const result: any = await this.db.query(
      `UPDATE user_activity_session
       SET durationSeconds = durationSeconds +
             LEAST(GREATEST(TIMESTAMPDIFF(SECOND, lastSeenAt, NOW(3)), 0), 120),
           lastSeenAt = NOW(3),
           updatedAt = NOW(3)
       WHERE id = ? AND userId = ? AND endedAt IS NULL`,
      [sessionId, userId],
    );
    return { tracked: Number(result?.affectedRows || 0) > 0 };
  }

  async endSession(userId: string, sessionId?: string) {
    if (!sessionId) {
      return { ended: false };
    }

    const result: any = await this.db.query(
      `UPDATE user_activity_session
       SET durationSeconds = durationSeconds +
             LEAST(GREATEST(TIMESTAMPDIFF(SECOND, lastSeenAt, NOW(3)), 0), 120),
           lastSeenAt = NOW(3),
           endedAt = NOW(3),
           updatedAt = NOW(3)
       WHERE id = ? AND userId = ? AND endedAt IS NULL`,
      [sessionId, userId],
    );
    return { ended: Number(result?.affectedRows || 0) > 0 };
  }

  async requestPasswordReset(rawEmail: string) {
    const email = String(rawEmail || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Please enter a valid email address.');
    }

    const genericResponse = {
      message: 'If this email is registered, a 6-digit OTP has been sent.',
    };
    const user = await this.db.queryOne<any>(
      'SELECT id, email FROM user WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email],
    );
    if (!user) return genericResponse;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new ServiceUnavailableException(
        'Password reset email service is not configured.',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    await this.db.query(
      `INSERT INTO password_reset_otp
        (email, userId, otpHash, expiresAt, attempts, verifiedAt, resetTokenHash, resetTokenExpiresAt, createdAt, updatedAt)
       VALUES (?, ?, ?, DATE_ADD(NOW(3), INTERVAL 10 MINUTE), 0, NULL, NULL, NULL, NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE
         userId = VALUES(userId), otpHash = VALUES(otpHash), expiresAt = VALUES(expiresAt),
         attempts = 0, verifiedAt = NULL, resetTokenHash = NULL,
         resetTokenExpiresAt = NULL, updatedAt = NOW(3)`,
      [email, user.id, otpHash],
    );

    try {
      await this.mailService.sendPasswordResetOtp(user.email, otp);
    } catch (error) {
      await this.db.query('DELETE FROM password_reset_otp WHERE email = ?', [email]);
      throw error;
    }
    return genericResponse;
  }

  async verifyPasswordResetOtp(rawEmail: string, rawOtp: string) {
    const email = String(rawEmail || '').trim().toLowerCase();
    const otp = String(rawOtp || '').trim();
    if (!/^\d{6}$/.test(otp)) {
      throw new BadRequestException('Enter the valid 6-digit OTP.');
    }

    const record = await this.db.queryOne<any>(
      `SELECT * FROM password_reset_otp
       WHERE email = ? AND expiresAt > NOW(3) AND attempts < 5
       LIMIT 1`,
      [email],
    );
    if (!record || !(await bcrypt.compare(otp, record.otpHash))) {
      if (record) {
        await this.db.query(
          'UPDATE password_reset_otp SET attempts = attempts + 1, updatedAt = NOW(3) WHERE email = ?',
          [email],
        );
      }
      throw new BadRequestException('OTP is invalid or has expired.');
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
    await this.db.query(
      `UPDATE password_reset_otp
       SET verifiedAt = NOW(3), resetTokenHash = ?,
           resetTokenExpiresAt = DATE_ADD(NOW(3), INTERVAL 10 MINUTE),
           updatedAt = NOW(3)
       WHERE email = ?`,
      [resetTokenHash, email],
    );
    return { message: 'OTP verified.', resetToken };
  }

  async resetPassword(rawEmail: string, resetToken: string, newPassword: string) {
    const email = String(rawEmail || '').trim().toLowerCase();
    if (
      typeof newPassword !== 'string' ||
      newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      throw new BadRequestException(
        'Password must be at least 8 characters and include a letter and number.',
      );
    }

    const tokenHash = createHash('sha256')
      .update(String(resetToken || ''))
      .digest('hex');
    const record = await this.db.queryOne<any>(
      `SELECT userId FROM password_reset_otp
       WHERE email = ? AND verifiedAt IS NOT NULL
         AND resetTokenHash = ? AND resetTokenExpiresAt > NOW(3)
       LIMIT 1`,
      [email, tokenHash],
    );
    if (!record) {
      throw new BadRequestException('Reset session is invalid or has expired.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        'UPDATE user SET password = ?, updatedAt = NOW(3) WHERE id = ?',
        [passwordHash, record.userId],
      );
      await connection.execute(
        'DELETE FROM password_reset_otp WHERE email = ?',
        [email],
      );
      await connection.execute(
        `UPDATE user_activity_session
         SET endedAt = COALESCE(endedAt, NOW(3)), updatedAt = NOW(3)
         WHERE userId = ? AND endedAt IS NULL`,
        [record.userId],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return { message: 'Password reset successful. Please sign in.' };
  }

  private isManagementRole(role: string | null | undefined): boolean {
    const normalizedRole = (role || '').toUpperCase();
    return ['SUPER', 'ADMIN', 'STAFF', 'MANAGEMENT', 'ACCOUNT', 'SALE', 'SUPPORT'].some(
      (managementRole) => normalizedRole.includes(managementRole),
    );
  }

  private isPublicAuthRole(role: string | null | undefined): boolean {
    const normalizedRole = (role || '').toUpperCase();
    const allowedLoginRoles = [
      ...PUBLIC_SIGNUP_ROLES, 
      'LAB_MANAGER', 
      'TECHNICIAN', 
      'LABORATORY'
    ];
    return allowedLoginRoles.includes(normalizedRole as any) || !this.isManagementRole(role);
  }

  /**
   * Helper to store a temporary OTP in Redis for 5 minutes.
   */
  async generateAndStoreOTP(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const cacheKey = `otp:${email}`;
    await this.redisService.set(cacheKey, otp, 300); // 5 mins TTL
    return otp;
  }

  /**
   * Helper to verify the temporary OTP from Redis.
   */
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const cacheKey = `otp:${email}`;
    const storedOtp = await this.redisService.get<string>(cacheKey);
    if (!storedOtp || storedOtp !== otp) {
      return false;
    }
    await this.redisService.del(cacheKey); // clear after successful use
    return true;
  }
}
