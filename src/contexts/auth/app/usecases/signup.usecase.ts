import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../ports/user.repository.port';
import { JwtTokenService } from '../../infra/persistence/security/jwt-token.service';

@Injectable()
export class SignupUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(props: {
    email: string;
    password: string;
    displayName?: string | null;
  }) {
    const { email, password, displayName } = props;

    const exists = await this.users.existsByEmail(email);
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.users.create({
      email,
      passwordHash,
      displayName,
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtTokenService.generateToken(payload);

    return { accessToken };
  }
}
