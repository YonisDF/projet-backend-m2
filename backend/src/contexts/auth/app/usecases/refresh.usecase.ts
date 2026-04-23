import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import type { UserRepository } from '../ports/user.repository.port';
import type { RefreshTokenRepository } from '../ports/refresh-token.repository.port';
import { CustomTokenService } from '../../infra/persistence/security/custom-token.service';

@Injectable()
export class RefreshUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly customTokenService: CustomTokenService,
  ) {}

  async execute(
    refreshToken: string,
    meta: {
      deviceId: string;
      userAgent?: string;
      ipAddress?: string;
    },
  ) {
    const payload = this.customTokenService.verifyRefreshToken(refreshToken);

    const stored = await this.refreshTokens.findByTokenId(payload.tokenId);
    if (!stored) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (stored.isRevoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const incomingHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    if (stored.tokenHash !== incomingHash) {
      await this.refreshTokens.revokeByFamilyId(stored.familyId);
      throw new UnauthorizedException('Refresh token mismatch');
    }

    if (
      stored.deviceId !== meta.deviceId ||
      payload.deviceId !== meta.deviceId
    ) {
      await this.refreshTokens.revokeByFamilyId(stored.familyId);
      throw new UnauthorizedException('Device mismatch');
    }

    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.refreshTokens.revokeByTokenId(stored.tokenId);

    const newTokenId = crypto.randomUUID();

    const newAccessToken = this.customTokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    const newRefreshToken = this.customTokenService.signRefreshToken({
      sub: user.id,
      familyId: stored.familyId,
      tokenId: newTokenId,
      deviceId: meta.deviceId,
    });

    const newHash = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    await this.refreshTokens.create({
      userId: user.id,
      familyId: stored.familyId,
      tokenId: newTokenId,
      tokenHash: newHash,
      deviceId: meta.deviceId,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
      expiresAt: this.customTokenService.getRefreshTokenExpiryDate(),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
