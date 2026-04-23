import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { CheckEmailDto } from './dtos/check-email.dto';
import { AuthService } from '../app/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(
      dto.email,
      dto.password,
      dto.displayName ?? null,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Ip() ip: string) {
    return this.authService.login(dto.email, dto.password, {
      deviceId: dto.deviceId,
      userAgent: req.headers['user-agent'] ?? undefined,
      ipAddress: ip,
    });
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.refresh(dto.refreshToken, {
      deviceId: dto.deviceId,
      userAgent: req.headers['user-agent'] ?? undefined,
      ipAddress: ip,
    });
  }

  @Post('check-email')
  async checkEmail(@Body() dto: CheckEmailDto) {
    const result = await this.authService.checkEmailAvailability(dto.email);
    return result;
  }
}
