import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './shared/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ComerciantesModule } from './merchants/merchants.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, ComerciantesModule, MunicipalitiesModule],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
