import { Injectable } from '@nestjs/common';
import { LoginUsecase } from '../usecases/login.usecase';
import { SignupUsecase } from '../usecases/signup.usecase';
import { RefreshUsecase } from '../usecases/refresh.usecase';
import { CheckEmailAvailabilityUsecase } from '../usecases/check-email-availability.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly signupUsecase: SignupUsecase,
    private readonly refreshUsecase: RefreshUsecase,
    private readonly checkEmailUsecase: CheckEmailAvailabilityUsecase,
  ) {}

  async login(
    email: string,
    password: string,
    meta: {
      deviceId: string;
      userAgent?: string;
      ipAddress?: string;
    },
  ) {
    return this.loginUsecase.execute(email, password, meta);
  }

  async signup(email: string, password: string, displayName: string | null) {
    return this.signupUsecase.execute({ email, password, displayName });
  }

  async refresh(
    refreshToken: string,
    meta: {
      deviceId: string;
      userAgent?: string;
      ipAddress?: string;
    },
  ) {
    return this.refreshUsecase.execute(refreshToken, meta);
  }

  checkEmailAvailability(email: string) {
    return this.checkEmailUsecase.execute(email);
  }
}
