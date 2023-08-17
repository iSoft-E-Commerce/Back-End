import { ApiProperty } from '@nestjs/swagger';
import { OrdersHistory } from 'src/orders-history/entities/orders-history.entity';
import { Product } from 'src/product/entities/product.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, ManyToOne } from 'typeorm';

export class OrderDataProduct {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: () => Product })
  product: Product;
}

@Entity()
export class OrderData extends Base {
  @ManyToOne(() => OrdersHistory, (orders) => orders.orders, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  orders: OrdersHistory;

  @ApiProperty({ type: OrderDataProduct, isArray: true })
  @Column('jsonb', { nullable: true })
  products: OrderDataProduct[];
}
