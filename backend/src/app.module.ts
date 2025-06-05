import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './shared/prisma/prisma.service';
import { DatabaseRolesGuard } from './shared/guards/database-roles.guard';
import { AuthModule } from './auth/auth.module';
import { ComerciantesModule } from './merchants/merchants.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';

@Module({
  imports: [AuthModule, ComerciantesModule, MunicipalitiesModule],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: DatabaseRolesGuard,
    },
  ],
})
export class AppModule {}
