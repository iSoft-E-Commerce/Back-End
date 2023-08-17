import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ModerateRateDto {
  @ApiProperty({
    example: 'Дякуємо за відгук',
    nullable: true,
  })
  @IsOptional()
  moderatorReply: string | null;
}
