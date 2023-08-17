import { Product } from 'src/product/entities/product.entity';
import { Base } from 'src/utils/base';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Rate } from './rate.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Rating extends Base {
  @OneToOne(() => Product, (product) => product.rating, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @ApiProperty({ type: () => [Rate] })
  @OneToMany(() => Rate, (rate) => rate.rating)
  @JoinColumn()
  rating: Rate[];
}
