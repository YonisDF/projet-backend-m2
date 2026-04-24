import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './api/auth.controller';
import { UserEntity } from './infra/persistence/entities/user.entity';
import { RefreshTokenEntity } from './infra/persistence/entities/refresh-token.entity';
import { JwtAuthGuard } from './infra/persistence/security/jwt-auth.guard';
import { CustomTokenService } from './infra/persistence/security/custom-token.service';
import { TypeOrmUserRepository } from './infra/persistence/repositories/typeorm-user.repository';
import { TypeOrmRefreshTokenRepository } from './infra/persistence/repositories/typeorm-refresh-token.repository';
import { UsersService } from './app/services/users.service';
import { AuthService } from './app/services/auth.service';
import { LoginUsecase } from './app/usecases/login.usecase';
import { SignupUsecase } from './app/usecases/signup.usecase';
import { RefreshUsecase } from './app/usecases/refresh.usecase';
import { EmailBloomFilterService } from './app/services/email-bloom-filter.service';
import { CheckEmailAvailabilityUsecase } from './app/usecases/check-email-availability.usecase';
import { EmailBloomWarmupService } from './app/services/email-bloom-filter-warmup.service';
import { LocalCacheService } from '../../core/local-cache/services/local-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity])],
  controllers: [AuthController],
  providers: [
    LoginUsecase,
    SignupUsecase,
    RefreshUsecase,
    CheckEmailAvailabilityUsecase,
    UsersService,
    AuthService,
    JwtAuthGuard,
    CustomTokenService,
    EmailBloomFilterService,
    EmailBloomWarmupService,
    LocalCacheService,
    TypeOrmUserRepository,
    TypeOrmRefreshTokenRepository,
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'RefreshTokenRepository',
      useClass: TypeOrmRefreshTokenRepository,
    },
  ],
  exports: [JwtAuthGuard, CustomTokenService],
})
export class AuthModule {}
