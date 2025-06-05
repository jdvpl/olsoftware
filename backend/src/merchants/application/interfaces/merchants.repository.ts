import { merchant } from '@prisma/client';
import { CreateMerchantDto } from '../dto/create-merchant.dto';
import { UpdateMerchantDto } from '../dto/update-merchant.dto';
import { FiltersMerchantDto } from '../dto/filters-merchant.dto';

export interface Pagination<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export type MerchantWithRelations = merchant & {
  municipality?: { nombre: string } | null;
  establishment: Array<{
    income: number | any;
    employees_count: number | any;
  }>;
};

export interface IMerchantsRepository {
  create(dto: CreateMerchantDto, updatedBy: string): Promise<merchant>;
  list(filters: FiltersMerchantDto): Promise<Pagination<merchant>>;
  findById(id: number): Promise<merchant | null>;
  update(
    id: number,
    dto: UpdateMerchantDto,
    updatedBy: string,
  ): Promise<merchant>;
  remove(id: number): Promise<void>;
  changeStatus(
    id: number,
    status: 'ACTIVE' | 'INACTIVE',
    updatedBy: string,
  ): Promise<merchant>;
  getMerchantsForReport(): Promise<MerchantWithRelations[]>;
}
