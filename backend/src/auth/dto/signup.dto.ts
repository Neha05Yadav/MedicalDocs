import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Valid email address dena zaroori hai' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password!: string;

  @IsOptional()
  @IsIn(['PATIENT', 'HOSPITAL', 'LAB', 'CLINIC', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'STAFF'], { message: 'Role valid nahi hai' })
  role?: string;

  @IsString({ message: 'Name required hai' })
  @MinLength(2, { message: 'Name kam se kam 2 characters ka hona chahiye' })
  name!: string;
}
