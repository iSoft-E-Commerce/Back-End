import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/utils/base';
import { Column, Entity } from 'typeorm';
import { SocialMediaDTO } from '../dto/update-contacts.dto';

@Entity()
export class Contacts extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  phone: string;

  @ApiProperty()
  @Column({ nullable: false })
  address: string;

  @ApiProperty()
  @Column({ nullable: false })
  schedule: string;

  @ApiProperty({ type: SocialMediaDTO, isArray: true })
  @Column('jsonb', { default: [] })
  socialMedia: SocialMediaDTO[];
}
