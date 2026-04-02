import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtTokenService } from '../../infra/persistence/security/jwt-token.service';
import type { UserRepository } from '../ports/user.repository.port';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtTokenService.signAccessToken(payload);

    return { accessToken };
  }
}
