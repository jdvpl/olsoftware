import { Inject, Injectable } from '@nestjs/common';
import {
  IMerchantsRepository,
  Pagination,
} from './interfaces/merchants.repository';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { FiltersMerchantDto } from './dto/filters-merchant.dto';
import { merchant } from '@prisma/client';

@Injectable()
export class MerchantsUseCase {
  constructor(
    @Inject('IMerchantsRepository') private repo: IMerchantsRepository,
  ) {}

  create(dto: CreateMerchantDto, actor: string): Promise<merchant> {
    return this.repo.create(dto, actor);
  }

  list(filters: FiltersMerchantDto): Promise<Pagination<merchant>> {
    return this.repo.list(filters);
  }

  find(id: number): Promise<merchant | null> {
    return this.repo.findById(id);
  }

  update(id: number, dto: UpdateMerchantDto, actor: string): Promise<merchant> {
    return this.repo.update(id, dto, actor);
  }

  delete(id: number): Promise<void> {
    return this.repo.remove(id);
  }

  setStatus(
    id: number,
    status: 'ACTIVE' | 'INACTIVE',
    actor: string,
  ): Promise<merchant> {
    return this.repo.changeStatus(id, status, actor);
  }
}
