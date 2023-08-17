import { ApiProperty } from '@nestjs/swagger';
import { OrderData } from 'src/orders-history/entities/order-data.entity';
import { User } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/base';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class OrdersHistory extends Base {
  @OneToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderData, (orderData) => orderData.orders)
  @JoinColumn()
  orders: OrderData[];
}
