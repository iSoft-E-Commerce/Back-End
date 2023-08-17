import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Characteristics } from 'src/types/types';
import { Color, ProductPrice } from '../entities/product.entity';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  colorName: string;

  @ApiProperty({ type: ProductPrice })
  @IsOptional()
  @IsNotEmptyObject()
  price: ProductPrice;

  @ApiProperty({ type: Color })
  @IsNotEmptyObject()
  color: Color;

  @ApiProperty()
  @IsOptional()
  @IsString()
  memory: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  img: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isNewProduct: boolean;

  @ApiProperty({ type: Characteristics, isArray: true })
  @IsOptional()
  characteristics: Characteristics[];

  @ApiProperty({ type: Characteristics, isArray: true })
  @IsOptional()
  additionalCharacteristics?: Characteristics[];
}
