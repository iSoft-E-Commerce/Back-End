import { User } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Rating } from './rating.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ModeratorReply {
  @ApiProperty()
  @IsOptional()
  reply: string;

  @ApiProperty()
  @IsOptional()
  name: string;
}

@Entity()
export class Rate extends Base {
  @ApiProperty()
  @Column()
  rate: number;

  @ApiProperty()
  @Column()
  review: string;

  @ApiProperty()
  @Column({ default: false })
  isChecked: boolean;

  @ApiProperty({ type: ModeratorReply })
  @Column('json', { nullable: true })
  moderatorReply: ModeratorReply;

  @ManyToOne(() => Rating, (rating) => rating.rating, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rating: Rating;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.rate, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
