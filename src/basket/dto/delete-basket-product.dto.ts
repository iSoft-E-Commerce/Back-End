import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class DeleteBasketProductDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isDelete: boolean;
}
