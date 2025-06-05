import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  IMerchantsRepository,
  MerchantWithRelations,
  Pagination,
} from '../../application/interfaces/merchants.repository';
import { merchant } from '@prisma/client';
import { CreateMerchantDto } from '../../application/dto/create-merchant.dto';
import { UpdateMerchantDto } from '../../application/dto/update-merchant.dto';
import { FiltersMerchantDto } from '../../application/dto/filters-merchant.dto';

@Injectable()
export class MerchantsPrismaRepository implements IMerchantsRepository {
  constructor(private prisma: PrismaService) {}

  private async setSessionUser(updatedBy: string) {
    await this.prisma
      .$executeRaw`SELECT set_config('olsoftware.current_user', ${updatedBy}, false)`;
  }

  async create(dto: CreateMerchantDto, updatedBy: string): Promise<merchant> {
    await this.setSessionUser(updatedBy);
    return this.prisma.merchant.create({
      data: dto,
    });
  }

  async list(filters: FiltersMerchantDto): Promise<Pagination<merchant>> {
    const {
      page = 1,
      limit = 5,
      business_name,
      status,
      registration_date,
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (business_name)
      where.business_name = { contains: business_name, mode: 'insensitive' };
    if (status) where.status = status;
    if (registration_date)
      where.registration_date = new Date(registration_date);

    const [items, totalItems] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { business_name: 'asc' },
      }),
      this.prisma.merchant.count({ where }),
    ]);
    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async findById(id: number): Promise<merchant | null> {
    return this.prisma.merchant.findUnique({ where: { id_merchant: id } });
  }

  async update(
    id: number,
    dto: UpdateMerchantDto,
    updatedBy: string,
  ): Promise<merchant> {
    await this.ensureExists(id);
    await this.setSessionUser(updatedBy);
    return this.prisma.merchant.update({
      where: { id_merchant: id },
      data: dto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.merchant.delete({ where: { id_merchant: id } });
  }

  async changeStatus(
    id: number,
    status: 'ACTIVE' | 'INACTIVE',
    updatedBy: string,
  ): Promise<merchant> {
    await this.ensureExists(id);
    await this.setSessionUser(updatedBy);
    return this.prisma.merchant.update({
      where: { id_merchant: id },
      data: { status },
    });
  }

  async getMerchantsForReport(): Promise<MerchantWithRelations[]> {
    return this.prisma.merchant.findMany({
      where: { status: 'ACTIVE' },
      include: {
        municipality: true,
        establishment: {
          select: {
            income: true,
            employee_count: true,
          },
        },
      },
      orderBy: { business_name: 'asc' },
    }) as unknown as Promise<MerchantWithRelations[]>;
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.merchant.count({
      where: { id_merchant: id },
    });
    if (!exists) throw new NotFoundException(`Merchant ${id} not found`);
  }
}
