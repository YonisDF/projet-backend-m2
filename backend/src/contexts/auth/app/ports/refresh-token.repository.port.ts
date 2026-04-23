export interface RefreshTokenRepository {
  create(data: {
    userId: string;
    familyId: string;
    tokenId: string;
    tokenHash: string;
    deviceId: string;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
  }): Promise<void>;

  findByTokenId(tokenId: string): Promise<{
    id: string;
    userId: string;
    familyId: string;
    tokenId: string;
    tokenHash: string;
    deviceId: string;
    isRevoked: boolean;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
    createdAt: Date;
  } | null>;

  revokeByFamilyId(familyId: string): Promise<void>;

  revokeByTokenId(tokenId: string): Promise<void>;
}
