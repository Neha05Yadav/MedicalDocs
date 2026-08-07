import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('uuid', () => ({ v4: () => 'generated-user-id' }));
jest.mock('bcrypt', () => ({
  compare: jest.fn(async () => true),
  hash: jest.fn(async () => 'password-hash'),
}));

import { AuthService } from './auth.service';

describe('AuthService role boundaries', () => {
  const db = {
    queryOne: jest.fn(),
    query: jest.fn(),
  };
  const jwtService = { sign: jest.fn(() => 'signed-token') };
  const redisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
  const mailService = { sendMail: jest.fn() };
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(db as any, jwtService as any, redisService as any, mailService as any);
  });

  it.each(['ADMIN', 'SUPER_ADMIN', 'STAFF', 'SUPPORT_AGENT'])(
    'blocks %s registration through public signup',
    async (role) => {
      await expect(
        service.signup({
          email: 'manager@example.com',
          password: 'secure-password',
          name: 'Manager',
          role,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(db.query).not.toHaveBeenCalled();
    },
  );

  it('blocks a management account on normal auth login', async () => {
    db.queryOne.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'hash',
      name: 'Admin',
      role: 'SUPER_ADMIN',
      status: 'Active',
    });

    await expect(
      service.login({ email: 'admin@example.com', password: 'password' }),
    ).rejects.toMatchObject({
      constructor: UnauthorizedException,
      message: 'Invalid email or password',
    });
  });

  it('blocks a patient account on management login', async () => {
    db.queryOne.mockResolvedValue({
      id: 'patient-1',
      email: 'patient@example.com',
      password: 'hash',
      name: 'Patient',
      role: 'PATIENT',
      status: 'Active',
    });

    await expect(
      service.managementLogin({
        email: 'patient@example.com',
        password: 'password',
      }),
    ).rejects.toMatchObject({
      constructor: UnauthorizedException,
      message: 'Invalid email or password',
    });
  });
});
