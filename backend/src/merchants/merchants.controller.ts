// src/comerciantes/merchants.controller.ts
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
} from '@nestjs/common';
import { Roles } from '../shared/decorators/roles.decorator';
import { MerchantsUseCase } from './application/merchants.use-case';
import { CreateMerchantDto } from './application/dto/create-merchant.dto';
import { UpdateMerchantDto } from './application/dto/update-merchant.dto';
import { FiltersMerchantDto } from './application/dto/filters-merchant.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comerciantes')
@UseGuards(JwtAuthGuard)
export class MerchantsController {
  constructor(private uc: MerchantsUseCase) {}

  @Get()
  list(@Query() q: FiltersMerchantDto) {
    return this.uc.list(q);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.uc.find(+id);
  }

  @Roles('ADMIN', 'AUX_REG')
  @Post()
  create(@Body() dto: CreateMerchantDto, @Req() req) {
    return this.uc.create(dto, req.user.email);
  }

  @Roles('ADMIN', 'AUX_REG')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMerchantDto, @Req() req) {
    return this.uc.update(+id, dto, req.user.email);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uc.delete(+id);
  }

  @Roles('ADMIN')
  @Patch(':id/estado')
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'INACTIVE',
    @Req() req,
  ) {
    return this.uc.setStatus(+id, status, req.user.email);
  }
}
