import { Injectable } from '@nestjs/common';
import { LoginUsecase } from '../usecases/login.usecase';
import { SignupUsecase } from '../usecases/signup.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly signupUsecase: SignupUsecase,
  ) {}

  async login(email: string, password: string) {
    return this.loginUsecase.execute(email, password);
  }

  async signup(email: string, password: string, displayName: string | null) {
    return this.signupUsecase.execute({ email, password, displayName });
  }
}
