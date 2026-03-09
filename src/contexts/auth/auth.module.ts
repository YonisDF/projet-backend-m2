import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { LoginUsecase } from './app/usecases/login.usecase';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './infra/persistence/security/jwt-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/persistence/entities/user.entity';
import { JwtAuthGuard } from './infra/persistence/security/jwt-auth.guard';
import { TypeOrmUserRepository } from './infra/persistence/repositories/typeorm-user.repository';
import { UsersService } from './app/services/users.service';
import { AuthService } from './app/services/auth.service';
import { SignupUsecase } from './app/usecases/signup.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUsecase,
    SignupUsecase,
    UsersService,
    AuthService,
    JwtTokenService,
    JwtAuthGuard,
    TypeOrmUserRepository,
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [JwtAuthGuard, JwtTokenService],
})
export class AuthModule {}
