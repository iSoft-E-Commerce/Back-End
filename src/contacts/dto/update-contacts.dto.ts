import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SocialMediaDTO {
  @ApiProperty()
  @IsString()
  img: string;

  @ApiProperty()
  @IsString()
  link: string;
}

export class UpdateContactsDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  schedule: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ default: null, nullable: true })
  @IsOptional()
  contactsId: number;

  @ApiProperty({ type: SocialMediaDTO, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaDTO)
  socialMedia: SocialMediaDTO[];
}
