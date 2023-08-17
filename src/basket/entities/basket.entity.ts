import { User } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/base';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BasketDevice } from './basket-device.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Basket extends Base {
  @ApiProperty()
  @OneToOne(() => User, (user) => user.basket, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;

  @ApiProperty()
  @OneToMany(() => BasketDevice, (basketDevice) => basketDevice.basket)
  @JoinColumn()
  basketDevice: BasketDevice[];
}
