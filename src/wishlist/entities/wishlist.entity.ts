import { User } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/base';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { WishlistDevice } from './wishlist-device.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist extends Base {
  @OneToOne(() => User, (user) => user.wishlist, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => WishlistDevice, (wishlistDevice) => wishlistDevice.wishlist)
  @JoinColumn()
  wishlistDevice: WishlistDevice[];
}
