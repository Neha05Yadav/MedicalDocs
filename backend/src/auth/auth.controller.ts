import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password/request')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot-password/verify')
  async verifyPasswordResetOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyPasswordResetOtp(body.email, body.otp);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot-password/reset')
  async resetPassword(
    @Body() body: { email: string; resetToken: string; newPassword: string },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.resetToken,
      body.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('activity/heartbeat')
  async heartbeat(@Req() request: any) {
    return this.authService.recordHeartbeat(
      request.user.userId,
      request.user.sessionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() request: any) {
    return this.authService.endSession(
      request.user.userId,
      request.user.sessionId,
    );
  }
}
