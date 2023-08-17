import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { LoginUserDto } from 'src/auth/dto/login.dto';
import { Message } from 'src/types/types';
import { Repository } from 'typeorm';
import {
  LocalBasketProduct,
  Product,
} from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { BasketProductDto } from './dto/basket-product.dto';
import { DeleteBasketProductDto } from './dto/delete-basket-product.dto';
import { BasketDevice } from './entities/basket-device.entity';
import { Basket } from './entities/basket.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(BasketDevice)
    private readonly basketDeviceRepository: Repository<BasketDevice>,
  ) {}

  async getBasketProducts(userId: number): Promise<BasketDevice[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      order: { createdAt: 'DESC' },
      relations: [
        'basket',
        'basket.basketDevice',
        'basket.basketDevice.product',
      ],
    });
    if (!user || !user.basket) {
      throw new NotFoundException(`This basket does not exist.`);
    }

    return instanceToPlain(user.basket.basketDevice) as BasketDevice[];
  }

  async addDevice(
    userId: number,
    basketProductDto: BasketProductDto,
  ): Promise<Message> {
    const userBasket = await this.basketRepository
      .createQueryBuilder('basket')
      .innerJoinAndSelect('basket.user', 'user')
      .leftJoinAndSelect('basket.basketDevice', 'basketDevice')
      .leftJoinAndSelect('basketDevice.product', 'product')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userBasket) {
      throw new NotFoundException('This basket does not exist.');
    }
    const product = await this.productRepository.findOne({
      where: { id: basketProductDto.productId },
    });

    if (!product) {
      throw new NotFoundException(`This product does not exist.`);
    }

    const isDeviceInBasket = userBasket.basketDevice.find(
      (item) => item.product.id === product.id,
    );

    try {
      if (!isDeviceInBasket) {
        const newProductInBasket = this.basketDeviceRepository.create({
          product,
          basket: userBasket,
        });
        await this.basketRepository.save(userBasket);
        await this.basketDeviceRepository.save(newProductInBasket);
        return { message: 'Added' };
      } else {
        const updatedQuantity = isDeviceInBasket.quantity + 1;
        await this.basketDeviceRepository.update(isDeviceInBasket.id, {
          quantity: updatedQuantity,
        });
        return { message: 'Product quantity was updated' };
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when adding the device.',
      );
    }
  }

  async deleteDevice(
    userId: number,
    deleteBasketProductDto: DeleteBasketProductDto,
  ): Promise<Message> {
    const { productId, isDelete = false } = deleteBasketProductDto;
    const userBasket = await this.basketRepository
      .createQueryBuilder('basket')
      .innerJoinAndSelect('basket.user', 'user')
      .leftJoinAndSelect('basket.basketDevice', 'basketDevice')
      .leftJoinAndSelect('basketDevice.product', 'product')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userBasket) {
      throw new NotFoundException('This basket does not exist.');
    }

    const isProductInBasket = userBasket.basketDevice.find(
      (item) => item.product.id === productId,
    );

    if (!isProductInBasket) {
      throw new NotFoundException(`This product does not exist in basket.`);
    }

    try {
      if (isDelete) {
        await this.basketDeviceRepository.delete(isProductInBasket.id);
        return { message: 'Product has been deleted.' };
      }

      if (isProductInBasket.quantity > 1) {
        const updatedQuantity = isProductInBasket.quantity - 1;
        await this.basketDeviceRepository.update(isProductInBasket.id, {
          quantity: updatedQuantity,
        });
        return { message: 'Quantity decremented (1).' };
      } else {
        return { message: 'You cannot delete the last product in the basket.' };
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when deleting the device.',
      );
    }
  }

  async mergeBasket(
    userId: number,
    mergeBasketDto: LocalBasketProduct[],
  ): Promise<Message> {
    if (!mergeBasketDto.length) {
      return { message: 'Local basket products is empty.' };
    }
    const userBasket = await this.basketRepository
      .createQueryBuilder('basket')
      .innerJoinAndSelect('basket.user', 'user')
      .leftJoinAndSelect('basket.basketDevice', 'basketDevice')
      .leftJoinAndSelect('basketDevice.product', 'product')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userBasket) {
      throw new NotFoundException('This basket does not exist.');
    }

    try {
      for (const localProduct of mergeBasketDto) {
        const isProductInBasket = userBasket.basketDevice.find(
          (basketDevice) => basketDevice.product.id === localProduct.id,
        );

        if (isProductInBasket) {
          await this.basketDeviceRepository.update(isProductInBasket.id, {
            quantity: isProductInBasket.quantity + localProduct.quantity,
          });
        } else {
          const isProductExist = await this.productRepository.findOne({
            where: { id: localProduct.id },
          });
          if (isProductExist) {
            const newBasketDevice = this.basketDeviceRepository.create({
              product: localProduct,
              quantity: localProduct.quantity,
              basket: userBasket,
            });
            userBasket.basketDevice.push(newBasketDevice);
            await this.basketRepository.save(userBasket);
            await this.basketDeviceRepository.save(newBasketDevice);
          }
        }
      }
      return {
        message:
          'Local basket has been successfully merged with DataBase Basket.',
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when merging the baskets.',
      );
    }
  }
}
