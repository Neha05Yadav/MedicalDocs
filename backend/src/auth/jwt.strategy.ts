import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtSecret } from './auth.module';
import { MysqlService } from '../mysql.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly db: MysqlService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: any) => {
          const cookieHeader = String(request?.headers?.cookie || '');
          const tokenCookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith('token='));
          return tokenCookie ? decodeURIComponent(tokenCookie.slice('token='.length)) : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const account = await this.db.queryOne<any>(
      `SELECT u.id, u.email, u.role, u.status, u.hospitalId,
              h.status AS facilityStatus
       FROM user u
       LEFT JOIN hospital h ON h.id = u.hospitalId
       WHERE u.id = ?
       LIMIT 1`,
      [payload.sub],
    );

    if (!account || String(account.status || '').trim().toUpperCase() !== 'ACTIVE') {
      throw new UnauthorizedException('Unauthorized');
    }

    const facilityStatus = String(account.facilityStatus || '').trim().toUpperCase();
    if (account.hospitalId && ['SUSPENDED', 'INACTIVE', 'REJECTED'].includes(facilityStatus)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      userId: account.id,
      email: account.email,
      role: account.role || payload.role,
      sessionId: payload.sessionId,
      hospitalId: account.hospitalId || null,
    };
  }
}
