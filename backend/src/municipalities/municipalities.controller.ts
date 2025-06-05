import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MunicipalitiesService } from './municipalities.service';

@Controller('valores')
@UseGuards(JwtAuthGuard)
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Get('municipios')
  findAll() {
    return this.municipalitiesService.getAll();
  }
}
