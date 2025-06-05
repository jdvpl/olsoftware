import { Controller, Get, UseGuards } from '@nestjs/common';
import { DatabaseRolesGuard } from '../shared/guards/database-roles.guard';
import { MunicipalitiesService } from './municipalities.service';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('valores')
@UseGuards(DatabaseRolesGuard)
export class MunicipalitiesController {
  constructor(private service: MunicipalitiesService) {}

  @Roles('ADMIN', 'AUX_REG')
  @Get('municipios')
  async findAll() {
    try {
      const municipalities = await this.service.getAll();
      return {
        success: true,
        data: municipalities,
        message: 'Municipios obtenidos exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error al obtener los municipios',
        error: error.message,
      };
    }
  }
}
