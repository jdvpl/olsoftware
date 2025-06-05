import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { DatabaseRolesGuard } from './shared/guards/database-roles.guard';

@Module({
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: DatabaseRolesGuard,
    },
  ],
})
export class AppModule {}
