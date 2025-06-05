import { Inject, Injectable } from '@nestjs/common';
import {
  IMerchantsRepository,
  Pagination,
} from './interfaces/merchants.repository';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { FiltersMerchantDto } from './dto/filters-merchant.dto';
import { merchant } from '@prisma/client';

export interface MerchantReportData {
  business_name: string;
  municipality: string;
  phone: string;
  optional_email: string;
  registration_date: Date;
  status: string;
  total_establishments: number;
  total_income: number;
  total_employees: number;
}

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

  async generateMerchantsReport(): Promise<string> {
    const merchantsData = await this.getMerchantsReportData();
    return this.convertToCSV(merchantsData);
  }

  private async getMerchantsReportData(): Promise<MerchantReportData[]> {
    const merchants = await this.repo.getMerchantsForReport();

    return merchants.map((merchant) => ({
      business_name: merchant.business_name,
      municipality: merchant.municipality?.nombre || '',
      phone: merchant.phone || '',
      optional_email: merchant.optional_email || '',
      registration_date: merchant.registration_date,
      status: merchant.status,
      total_establishments: merchant.establishment.length,
      total_income: merchant.establishment.reduce(
        (sum, est) =>
          sum +
          (typeof est.income === 'object'
            ? est.income.toNumber()
            : est.income || 0),
        0,
      ),
      total_employees: merchant.establishment.reduce(
        (sum, est) =>
          sum +
          (typeof est.employees_count === 'object'
            ? est.employees_count.toNumber()
            : est.employees_count || 0),
        0,
      ),
    }));
  }

  private convertToCSV(data: MerchantReportData[]): string {
    const headers = [
      'Nombre o Razón Social',
      'Municipio',
      'Teléfono',
      'Correo Electrónico',
      'Fecha de Registro',
      'Estado',
      'Cantidad de Establecimientos',
      'Total Ingresos',
      'Cantidad de Empleados',
    ];

    const csvContent = [
      headers.join('|'),
      ...data.map((row) =>
        [
          row.business_name,
          row.municipality,
          row.phone,
          row.optional_email,
          row.registration_date.toISOString().split('T')[0],
          row.status,
          row.total_establishments.toString(),
          row.total_income.toFixed(2),
          row.total_employees.toString(),
        ].join('|'),
      ),
    ];

    return csvContent.join('\n');
  }
}
