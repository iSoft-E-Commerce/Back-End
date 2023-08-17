import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Basket } from 'src/basket/entities/basket.entity';
import { OrdersHistory } from 'src/orders-history/entities/orders-history.entity';
import { Rate } from 'src/rate/entities/rate.entity';
import { Base } from 'src/utils/base';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends Base {
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ default: '' })
  firstName: string;

  @ApiProperty()
  @Column({ default: '' })
  lastName: string;

  @ApiProperty()
  @Column({ default: '' })
  phone: string;

  @ApiProperty()
  @Column({ default: '' })
  img: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: 'user' })
  role: string;

  @OneToOne(() => Basket, (basket) => basket.user, {
    cascade: true,
  })
  basket: Basket;

  @OneToOne(() => OrdersHistory, (history) => history.user, {
    cascade: true,
  })
  orders: OrdersHistory;

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user, {
    cascade: true,
  })
  wishlist: Wishlist;

  @OneToMany(() => Rate, (rate) => rate.user)
  rate: Rate[];
}
