import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRateDto {
  @ApiProperty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsString()
  review: string;

  @ApiProperty()
  @IsNumber()
  productId: number;
}
