import { validate } from 'class-validator';
import { SignupDto } from './signup.dto';

function createSignupDto(role?: string): SignupDto {
  const dto = new SignupDto();
  dto.email = 'user@example.com';
  dto.password = 'secure-password';
  dto.name = 'Test User';
  dto.role = role;
  return dto;
}

describe('SignupDto', () => {
  it.each(['ADMIN', 'SUPER_ADMIN', 'STAFF', 'UNKNOWN'])(
    'rejects the privileged or unknown role %s',
    async (role) => {
      const errors = await validate(createSignupDto(role));

      expect(errors.some((error) => error.property === 'role')).toBe(true);
    },
  );

  it.each(['PATIENT', 'HOSPITAL', 'LAB', 'CLINIC', 'DOCTOR', 'PHARMACY'])(
    'allows the public role %s',
    async (role) => {
      const errors = await validate(createSignupDto(role));

      expect(errors).toHaveLength(0);
    },
  );

  it('allows role to be omitted so the service can default to PATIENT', async () => {
    const errors = await validate(createSignupDto());

    expect(errors).toHaveLength(0);
  });
});
