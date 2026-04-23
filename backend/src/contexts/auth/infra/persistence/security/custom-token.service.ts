import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  type: 'access';
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  familyId: string;
  tokenId: string;
  deviceId: string;
  exp?: number;
}

type BasePayload = AccessTokenPayload | RefreshTokenPayload;

function base64url(input: Buffer | string): string {
  return (input instanceof Buffer ? input : Buffer.from(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(input: string): Buffer {
  let b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (b64.length % 4);
  if (pad !== 4) {
    b64 += '='.repeat(pad);
  }
  return Buffer.from(b64, 'base64');
}

@Injectable()
export class CustomTokenService {
  private readonly accessSecret =
    process.env.ACCESS_TOKEN_SECRET ?? 'access-secret';
  private readonly refreshSecret =
    process.env.REFRESH_TOKEN_SECRET ?? 'refresh-secret';

  private signRaw(data: string, secret: string): string {
    return base64url(crypto.createHmac('sha256', secret).update(data).digest());
  }

  private createToken(
    payload: BasePayload,
    secret: string,
    ttlSeconds: number,
  ): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);

    const fullPayload = {
      ...payload,
      exp: now + ttlSeconds,
    };

    const headerEncoded = base64url(JSON.stringify(header));
    const payloadEncoded = base64url(JSON.stringify(fullPayload));
    const signature = this.signRaw(
      `${headerEncoded}.${payloadEncoded}`,
      secret,
    );

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  private verifyToken<T extends BasePayload>(
    token: string,
    secret: string,
    expectedType: 'access' | 'refresh',
  ): T {
    const parts = token.split('.');
    // Check if token has 3 parts and correct format
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format');
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    const expectedSignature = this.signRaw(
      `${headerPart}.${payloadPart}`,
      secret,
    );

    // Comparison
    const sigBuf = base64urlDecode(signaturePart);
    const expectedBuf = base64urlDecode(expectedSignature);

    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      throw new UnauthorizedException('Invalid token signature');
    }

    // Decrypt payload
    let payload: T;
    try {
      payload = JSON.parse(base64urlDecode(payloadPart).toString('utf8'));
    } catch {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.type !== expectedType) {
      throw new UnauthorizedException('Invalid token type');
    }

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    return payload;
  }

  signAccessToken(payload: { sub: string; email: string }): string {
    return this.createToken(
      { ...payload, type: 'access' },
      this.accessSecret,
      60 * 15, // 15 minutes
    );
  }

  signRefreshToken(payload: {
    sub: string;
    familyId: string;
    tokenId: string;
    deviceId: string;
  }): string {
    return this.createToken(
      {
        ...payload,
        type: 'refresh',
      },
      this.refreshSecret,
      60 * 60 * 24 * 30, // 30 days expiration
    );
  }

  verifyAccessToken(token: string) {
    return this.verifyToken(token, this.accessSecret, 'access');
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.verifyToken<RefreshTokenPayload>(
      token,
      this.refreshSecret,
      'refresh',
    );
  }

  getRefreshTokenExpiryDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  }
}
