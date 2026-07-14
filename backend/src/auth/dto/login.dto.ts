import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Valid email address dena zaroori hai' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password!: string;
}
