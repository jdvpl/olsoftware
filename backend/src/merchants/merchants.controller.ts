import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../shared/decorators/roles.decorator';
import { MerchantsUseCase } from './application/merchants.use-case';
import { CreateMerchantDto } from './application/dto/create-merchant.dto';
import { UpdateMerchantDto } from './application/dto/update-merchant.dto';
import { FiltersMerchantDto } from './application/dto/filters-merchant.dto';
import { DatabaseRolesGuard } from '../shared/guards/database-roles.guard';

@Controller('comerciantes')
@UseGuards(DatabaseRolesGuard)
export class MerchantsController {
  constructor(private uc: MerchantsUseCase) {}

  @Roles('ADMIN', 'AUX_REG')
  @Get()
  async list(@Query() q: FiltersMerchantDto) {
    const result = await this.uc.list(q);
    return {
      success: true,
      data: result,
      message: 'Comerciantes obtenidos exitosamente',
    };
  }

  @Roles('ADMIN') // Changed from @Roles('ADMIN', 'AUX_REG')
  @Get('reporte/csv')
  async downloadReport(@Res() res: Response) {
    try {
      const csvContent = await this.uc.generateMerchantsReport();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="comerciantes_activos.csv"',
      );

      return res.status(HttpStatus.OK).send(csvContent);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al generar el reporte',
        error: error.message,
      });
    }
  }

  @Roles('ADMIN', 'AUX_REG')
  @Get(':id')
  async find(@Param('id') id: string) {
    const merchant = await this.uc.find(+id);
    if (!merchant) {
      return {
        success: false,
        data: null,
        message: 'Comerciante no encontrado',
      };
    }
    return {
      success: true,
      data: merchant,
      message: 'Comerciante encontrado exitosamente',
    };
  }

  @Roles('ADMIN', 'AUX_REG')
  @Post()
  async create(@Body() dto: CreateMerchantDto, @Req() req) {
    try {
      const merchant = await this.uc.create(dto, req.user.email);
      return {
        success: true,
        data: merchant,
        message: 'Comerciante creado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error al crear el comerciante',
        error: error.message,
      };
    }
  }

  @Roles('ADMIN', 'AUX_REG')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantDto,
    @Req() req,
  ) {
    try {
      const merchant = await this.uc.update(+id, dto, req.user.email);
      return {
        success: true,
        data: merchant,
        message: 'Comerciante actualizado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error al actualizar el comerciante',
        error: error.message,
      };
    }
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.uc.delete(+id);
      return {
        success: true,
        data: null,
        message: 'Comerciante eliminado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error al eliminar el comerciante',
        error: error.message,
      };
    }
  }

  @Roles('ADMIN', 'AUX_REG')
  @Patch(':id/estado')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'INACTIVE',
    @Req() req,
  ) {
    try {
      const merchant = await this.uc.setStatus(+id, status, req.user.email);
      return {
        success: true,
        data: merchant,
        message: 'Estado del comerciante actualizado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error al actualizar el estado del comerciante',
        error: error.message,
      };
    }
  }
}
