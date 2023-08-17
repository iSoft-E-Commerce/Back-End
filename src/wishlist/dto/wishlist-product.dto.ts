import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WishlistProductDto {
  @ApiProperty()
  @IsNumber()
  productId: number;
}
