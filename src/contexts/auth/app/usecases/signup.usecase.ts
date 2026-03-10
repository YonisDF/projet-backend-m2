import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../ports/user.repository.port';

@Injectable()
export class SignupUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
  ) {}

  async execute(props: {
    email: string;
    password: string;
    displayName: string | null;
  }) {
    const { email, password, displayName } = props;

    const exists = await this.users.existsByEmail(email);
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.users.create({
      email,
      passwordHash,
      displayName,
    });
  }
}
