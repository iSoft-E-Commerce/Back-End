import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Characteristics } from 'src/types/types';

export class CreateTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: Characteristics, isArray: true })
  @IsOptional()
  characteristics: Characteristics[];
}
