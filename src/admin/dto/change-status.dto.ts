import { ApiProperty } from '@nestjs/swagger';

export class ChangeStatusDto {
  @ApiProperty({ description: 'Role: Admin / Editor / User' })
  role: string;

  @ApiProperty({ description: 'User ID' })
  userId: number;
}
