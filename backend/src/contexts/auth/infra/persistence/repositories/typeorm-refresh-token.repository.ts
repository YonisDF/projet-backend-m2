import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepository } from '../../../app/ports/refresh-token.repository.port';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: Repository<RefreshTokenEntity>,
  ) {}

  async create(data: {
    userId: string;
    familyId: string;
    tokenId: string;
    tokenHash: string;
    deviceId: string;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
  }): Promise<void> {
    const entity = this.repo.create({
      ...data,
      isRevoked: false,
    });

    await this.repo.save(entity);
  }

  async findByTokenId(tokenId: string) {
    return this.repo.findOne({
      where: { tokenId },
    });
  }

  async revokeByFamilyId(familyId: string): Promise<void> {
    await this.repo.update({ familyId }, { isRevoked: true });
  }

  async revokeByTokenId(tokenId: string): Promise<void> {
    await this.repo.update({ tokenId }, { isRevoked: true });
  }
}
