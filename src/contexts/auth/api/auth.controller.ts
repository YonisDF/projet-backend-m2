import { Body, Controller, Post } from '@nestjs/common';
import { LoginUsecase } from '../app/usecases/login.usecase';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUsecase) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute(dto.email, dto.password);
    return { access_token: result.accessToken };
  }
}
