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
  findAll() {
    return this.service.getAll();
  }
}
