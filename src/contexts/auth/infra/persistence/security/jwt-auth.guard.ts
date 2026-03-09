import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;
    if (!auth) throw new UnauthorizedException();

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();

    const payload = await this.jwtTokenService.verifyToken(token);
    (req as any).user = payload;
    return true;
  }
}
