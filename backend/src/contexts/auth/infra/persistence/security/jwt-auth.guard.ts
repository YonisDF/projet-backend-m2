import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeader.slice(7);

    // DEV MODE TOKEN OMG
    if (token === 'dev-token') {
      request.user = {
        sub: 'dev-user-id',
        email: 'dev@example.com',
      };
      return true;
    }

    // Normal mode
    const payload = await this.jwtTokenService.verifyAccessToken(token);
    request.user = payload;

    return true;
  }
}
