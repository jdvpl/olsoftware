import { Module } from '@nestjs/common';
import { MerchantsController } from './merchants.controller';
import { MerchantsUseCase } from './application/merchants.use-case';
import { MerchantsPrismaRepository } from './infrastructure/prisma/merchants.prisma.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

@Module({
  controllers: [MerchantsController],
  providers: [
    PrismaService,
    MerchantsUseCase,
    { provide: 'IMerchantsRepository', useClass: MerchantsPrismaRepository },
  ],
})
export class ComerciantesModule {}
