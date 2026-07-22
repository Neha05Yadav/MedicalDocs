import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ManagementAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(error: any, user: any, _info: any, context: ExecutionContext): TUser {
    if (error || !user) throw error || new UnauthorizedException('Management login required.');
    const role = String(user.role || '').trim().toUpperCase();
    const isManagementRole = ['SUPER', 'ADMIN', 'STAFF', 'MANAGEMENT', 'ACCOUNT', 'SALE', 'SUPPORT']
      .some((allowedRole) => role.includes(allowedRole));
    if (!isManagementRole) throw new ForbiddenException('Management access only.');

    const path = String(context.switchToHttp().getRequest()?.path || '');
    const roleMatchesArea = role.includes('SUPER')
      || (path.startsWith('/api/management/admin') && (role.includes('ADMIN') || role === 'STAFF' || role === 'MANAGEMENT'))
      || (path.startsWith('/api/management/accounts') && role.includes('ACCOUNT'))
      || (path.startsWith('/api/management/sales') && role.includes('SALE'))
      || (path.startsWith('/api/management/support') && role.includes('SUPPORT'))
      || path === '/api/management/status';
    if (!roleMatchesArea) throw new ForbiddenException('You cannot access another management team dashboard.');
    return user as TUser;
  }
}
