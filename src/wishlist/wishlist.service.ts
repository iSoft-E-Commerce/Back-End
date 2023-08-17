import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { MergeWishlistDto } from './dto/merge-wishlist.dto';
import { WishlistProductDto } from './dto/wishlist-product.dto';
import { WishlistDevice } from './entities/wishlist-device.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Message } from 'src/types/types';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(WishlistDevice)
    private readonly wishlistDeviceRepository: Repository<WishlistDevice>,
  ) {}

  async getWishlistProducts(userId: number): Promise<WishlistDevice[]> {
    const wishlistDevices = await this.wishlistDeviceRepository
      .createQueryBuilder('wishlistDevice')
      .leftJoinAndSelect('wishlistDevice.product', 'product')
      .leftJoinAndSelect('product.rating', 'rating')
      .leftJoinAndSelect(
        'rating.rating',
        'rate',
        'rate.isChecked = :isChecked',
        { isChecked: true },
      )
      .leftJoinAndSelect('rate.user', 'user')
      .leftJoinAndSelect('wishlistDevice.wishlist', 'wishlist')
      .leftJoinAndSelect('wishlist.user', 'wishlistUser')
      .where('wishlistUser.id = :userId', { userId })
      .getMany();
    if (!wishlistDevices) {
      throw new NotFoundException(`This wishlist does not exist.`);
    }

    return instanceToPlain(wishlistDevices) as WishlistDevice[];
  }

  async addDevice(
    userId: number,
    wishlistProductDto: WishlistProductDto,
  ): Promise<WishlistDevice> {
    const userWishlist = await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .innerJoinAndSelect('wishlist.user', 'user')
      .leftJoinAndSelect('wishlist.wishlistDevice', 'wishlistDevice')
      .leftJoinAndSelect('wishlistDevice.product', 'product')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userWishlist) {
      throw new NotFoundException(`This wishlist does not exist.`);
    }

    const product = await this.productRepository.findOne({
      where: { id: wishlistProductDto.productId },
    });

    if (!product) {
      throw new NotFoundException(`This product does not exist.`);
    }

    const isDeviceInWishlist = userWishlist.wishlistDevice.find(
      (item) => item.product.id === product.id,
    );

    if (isDeviceInWishlist) {
      throw new ConflictException('Product is already in the wishlist');
    }

    try {
      const device = this.wishlistDeviceRepository.create({
        product,
        wishlist: userWishlist,
      });

      await this.wishlistRepository.save(userWishlist);
      await this.wishlistDeviceRepository.save(device);

      return instanceToPlain(device) as WishlistDevice;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when adding the device.',
      );
    }
  }

  async deleteDevice(
    userId: number,
    wishlistProductDto: WishlistProductDto,
  ): Promise<Message> {
    const userWishlist = await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .innerJoinAndSelect('wishlist.user', 'user')
      .leftJoinAndSelect('wishlist.wishlistDevice', 'wishlistDevice')
      .leftJoinAndSelect('wishlistDevice.product', 'product')
      .where('user.id = :userId', { userId })
      .getOne();

    const isProductInWishlist = userWishlist.wishlistDevice.find(
      (item) => item.product.id === wishlistProductDto.productId,
    );
    if (!isProductInWishlist) {
      throw new NotFoundException(`This product does not exist in wishlist.`);
    }
    try {
      await this.wishlistDeviceRepository.delete(isProductInWishlist.id);
      return { message: 'Device has been deleted' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when deleting the device.',
      );
    }
  }

  async mergeWishlist(
    userId: number,
    mergeWishlistDto: MergeWishlistDto,
  ): Promise<Message> {
    if (!mergeWishlistDto.localWishlistProducts.length) {
      return { message: 'Local Wishlist Products is empty.' };
    }
    const userWishlist = await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .innerJoinAndSelect('wishlist.user', 'user')
      .leftJoinAndSelect('wishlist.wishlistDevice', 'wishlistDevice')
      .leftJoinAndSelect('wishlistDevice.product', 'product')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!userWishlist) {
      throw new NotFoundException('This wishlist does not exist.');
    }

    try {
      for (const localProduct of mergeWishlistDto.localWishlistProducts) {
        const isProductInWishlist = userWishlist.wishlistDevice.find(
          (wishlistDevice) => wishlistDevice.product.id === localProduct.id,
        );

        if (!isProductInWishlist) {
          const isProductExist = await this.productRepository.findOne({
            where: { id: localProduct.id },
          });
          if (isProductExist) {
            const newWishlistDevice = this.wishlistDeviceRepository.create({
              product: localProduct,
              wishlist: userWishlist,
            });
            userWishlist.wishlistDevice.push(newWishlistDevice);
            await this.wishlistRepository.save(userWishlist);
            await this.wishlistDeviceRepository.save(newWishlistDevice);
          }
        }
      }
      return {
        message:
          'Local wishlist has been successfully merged with DataBase Wishlist.',
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when merging the wishlists.',
      );
    }
  }
}
