import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthPrismaRepository } from './infrastructure/prisma/auth.prisma.repository';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../shared/prisma/prisma.service';
import { envs } from 'src/shared/env/envs';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.SECRET_JWT,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    LoginUseCase,
    JwtAuthGuard,
    {
      provide: 'IAuthRepository',
      useClass: AuthPrismaRepository,
    },
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
