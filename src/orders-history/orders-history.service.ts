import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderData } from './entities/order-data.entity';
import { OrdersHistory } from './entities/orders-history.entity';
import { CreateOrderDataDto } from './dto/create-order-data.dto';
import { BasketDevice } from 'src/basket/entities/basket-device.entity';
import { Basket } from 'src/basket/entities/basket.entity';
import { User } from 'src/user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { Message } from 'src/types/types';

@Injectable()
export class OrdersHistoryService {
  constructor(
    @InjectRepository(OrdersHistory)
    private readonly ordersHistoryReposiry: Repository<OrdersHistory>,
    @InjectRepository(OrderData)
    private readonly orderDataRepository: Repository<OrderData>,
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
    @InjectRepository(BasketDevice)
    private readonly basketDeviceRepository: Repository<BasketDevice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOrdersHistory(userId: number): Promise<OrderData[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders', 'orders.orders'],
    });

    if (!user || !user.orders) {
      throw new NotFoundException(`This orders-history does not exist.`);
    }

    return instanceToPlain(user.orders.orders) as OrderData[];
  }

  async createOrderData(
    userId: number,
    createOrderDataDto: CreateOrderDataDto[],
  ): Promise<Message> {
    const userOrdersHistory = await this.ordersHistoryReposiry
      .createQueryBuilder('ordershistory')
      .innerJoinAndSelect('ordershistory.user', 'user')
      .leftJoinAndSelect('ordershistory.orders', 'orders')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userOrdersHistory) {
      throw new NotFoundException("User's orders history does not exist.");
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
    const newOrderData = this.orderDataRepository.create({
      products: createOrderDataDto,
      orders: userOrdersHistory,
    });
    const basketDevicesId = createOrderDataDto.map((product) => product.id);
    try {
      await this.orderDataRepository.save(newOrderData);
      await this.basketDeviceRepository.delete(basketDevicesId);

      return { message: 'Order data saved into user orders history.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when adding new order to the history.',
      );
    }
  }
}
