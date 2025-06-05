import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEmail,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsNumber()
  id_municipio: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  optional_email?: string;

  @IsDateString()
  registration_date: Date;

  @IsIn(['ACTIVE', 'INACTIVE'])
  status: 'ACTIVE' | 'INACTIVE';
}
