import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private db: MysqlService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, role, name } = signupDto;

    // Email already exist karta hai?
    const existingUser = await this.db.queryOne('SELECT * FROM user WHERE email = ?', [email]);

    if (existingUser) {
      throw new ConflictException('Is email se account pehle se exist karta hai');
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // User create karo
    const userId = uuidv4();
    const userRole = role || 'PATIENT';
    const now = new Date();
    
    await this.db.query(
      'INSERT INTO user (id, email, password, role, name, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, userRole, name, now]
    );
    
    // JWT token generate karo (bug fix: ab plain password se login() nahi call hoga)
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

    // JWT token generate karo
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
}
