import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Characteristics } from 'src/types/types';
import { Color, ProductPrice } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: ProductPrice })
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

  @ApiProperty()
  @IsNumber()
  typeId: number;

  @ApiProperty({ type: Characteristics, isArray: true })
  @IsOptional()
  characteristics: Characteristics[];

  @ApiProperty({ type: Characteristics, isArray: true })
  @IsOptional()
  additionalCharacteristics?: Characteristics[];
}
