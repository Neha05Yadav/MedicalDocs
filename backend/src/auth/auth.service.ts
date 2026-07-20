import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PUBLIC_SIGNUP_ROLES, SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private db: MysqlService,
    private jwtService: JwtService,
    private redisService: RedisService,
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
        await connection.execute(
          'INSERT INTO patient (id, name, email, phone, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [userId, name, email, '', now],
        );
      } else if (['HOSPITAL', 'LAB', 'CLINIC', 'DOCTOR'].includes(normalizedRole)) {
        const facilityId = uuidv4();
        const facilityType = normalizedRole === 'LAB' ? 'LAB' : normalizedRole === 'HOSPITAL' ? 'HOSPITAL' : 'CLINIC';
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
    
    // JWT token generate karo
    const payload = { email: email, sub: userId, role: userRole };

    return {
      message: 'Account successfully create ho gaya!',
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: email,
        name: name,
        role: userRole,
      },
    };
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
      throw new UnauthorizedException('Aapka account inactive hai. Admin se contact karo');
    }

    // Password verify karo
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private createLoginResponse(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      message: 'Login successful!',
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

  private isManagementRole(role: string | null | undefined): boolean {
    const normalizedRole = (role || '').toUpperCase();
    return ['SUPER', 'ADMIN', 'STAFF', 'ACCOUNT', 'SALE', 'SUPPORT'].some(
      (managementRole) => normalizedRole.includes(managementRole),
    );
  }

  private isPublicAuthRole(role: string | null | undefined): boolean {
    const normalizedRole = (role || '').toUpperCase();
    const allowedLoginRoles = [
      ...PUBLIC_SIGNUP_ROLES, 
      'LAB_MANAGER', 
      'TECHNICIAN', 
      'LABORATORY',
      'ACCOUNTS MANAGER',
      'SALES MANAGER',
      'SUPPORT TEAM'
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
