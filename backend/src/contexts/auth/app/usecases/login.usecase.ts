import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { UserRepository } from '../ports/user.repository.port';
import type { RefreshTokenRepository } from '../ports/refresh-token.repository.port';
import { CustomTokenService } from '../../infra/persistence/security/custom-token.service';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly customTokenService: CustomTokenService,
  ) {}

  async execute(
    email: string,
    password: string,
    meta: {
      deviceId: string;
      userAgent?: string;
      ipAddress?: string;
    },
  ) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const familyId = crypto.randomUUID();
    const tokenId = crypto.randomUUID();

    const accessToken = this.customTokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = this.customTokenService.signRefreshToken({
      sub: user.id,
      familyId,
      tokenId,
      deviceId: meta.deviceId,
    });

    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.refreshTokens.create({
      userId: user.id,
      familyId,
      tokenId,
      tokenHash,
      deviceId: meta.deviceId,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
      expiresAt: this.customTokenService.getRefreshTokenExpiryDate(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
