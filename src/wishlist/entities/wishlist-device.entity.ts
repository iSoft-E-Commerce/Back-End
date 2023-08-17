import { Product } from 'src/product/entities/product.entity';
import { Base } from 'src/utils/base';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class WishlistDevice extends Base {
  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.wishlistDevice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishlist: Wishlist;
}
