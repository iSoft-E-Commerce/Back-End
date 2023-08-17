import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/utils/base';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserQuestion extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, default: '' })
  question: string;

  @ApiProperty()
  @Column({ nullable: false, default: '' })
  fullName: string;

  @ApiProperty()
  @Column({ default: false })
  isChecked: boolean;
}

export class PaginatedUserQuestions {
  @ApiProperty({ type: UserQuestion, isArray: true })
  itemsPerPage: UserQuestion[];
  @ApiProperty()
  skip: number;
  @ApiProperty()
  total: number;
}
