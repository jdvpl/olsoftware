import { Type } from 'class-transformer';
import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';

export class FiltersMerchantDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  business_name?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
  
  @IsOptional()
  @IsString()
  registration_date?: string;
}
