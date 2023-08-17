import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

export class CreateOrderDataDto {
  @ApiProperty({ description: 'id = baskedDeviceId from user Basket.' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Quantity Each product in Basket' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Product })
  @IsObject()
  product: Product;
}
