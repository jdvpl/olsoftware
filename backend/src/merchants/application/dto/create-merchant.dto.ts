import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEmail,
  IsDateString,
  IsIn,
  IsBoolean,
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
  optional_email?: string;

  @IsDateString()
  registration_date: Date;

  @IsIn(['ACTIVE', 'INACTIVE'])
  status: 'ACTIVE' | 'INACTIVE';


  @IsOptional()
  @IsBoolean()
  has_establishments?: boolean;
}
