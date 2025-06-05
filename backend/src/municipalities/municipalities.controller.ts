import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MunicipalitiesService } from './municipalities.service';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('valores')
@UseGuards(JwtAuthGuard)
export class MunicipalitiesController {
  constructor(private service: MunicipalitiesService) {}

  @Roles('ADMIN', 'AUX_REG')
  @Get('municipios')
  findAll() {
    return this.service.getAll();
  }
}
