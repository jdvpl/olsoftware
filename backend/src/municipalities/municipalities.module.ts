import { Module } from '@nestjs/common';
import { MunicipalitiesService } from './municipalities.service';
import { MunicipalitiesController } from './municipalities.controller';
import { PrismaService } from '../shared/prisma/prisma.service';

@Module({
  controllers: [MunicipalitiesController],
  providers: [MunicipalitiesService, PrismaService],
})
export class MunicipalitiesModule {}
