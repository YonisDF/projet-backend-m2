import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: { sub: string; email: string }) {
    return await this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }
}
