import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('management/login')
  async managementLogin(@Body() loginDto: LoginDto) {
    return this.authService.managementLogin(loginDto);
  }
}
