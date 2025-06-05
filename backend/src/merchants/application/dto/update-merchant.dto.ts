// src/comerciantes/application/dto/update-merchant.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsIn,
  IsNumber,
} from 'class-validator';

export class UpdateMerchantDto {
  @IsOptional()
  @IsString()
  business_name?: string;
  @IsOptional()
  @IsNumber()
  id_municipio?: number;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsEmail()
  optional_email?: string;
  @IsOptional()
  @IsDateString()
  registration_date?: Date;
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
}
