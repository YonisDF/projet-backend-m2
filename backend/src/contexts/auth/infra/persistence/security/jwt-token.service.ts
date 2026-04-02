import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded =
        await this.jwtService.verifyAsync<AccessTokenPayload>(token);
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
