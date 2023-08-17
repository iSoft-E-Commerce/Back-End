import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}
