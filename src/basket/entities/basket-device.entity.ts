import { Product } from 'src/product/entities/product.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Basket } from './basket.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BasketDevice extends Base {
  @ApiProperty()
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty()
  @ManyToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Basket, (basket) => basket.basketDevice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  basket: Basket;
}
