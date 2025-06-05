import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class MunicipalitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.municipality.findMany({
      select: {
        id_municipio: true,
        nombre: true,
        id_department: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
