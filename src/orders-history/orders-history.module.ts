import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { OrderData } from './entities/order-data.entity';
import { OrdersHistory } from './entities/orders-history.entity';
import { OrdersHistoryController } from './orders-history.controller';
import { OrdersHistoryService } from './orders-history.service';
import { Basket } from 'src/basket/entities/basket.entity';
import { BasketDevice } from 'src/basket/entities/basket-device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersHistory,
      OrderData,
      User,
      Product,
      Basket,
      BasketDevice,
      User,
    ]),
    JwtModule,
  ],
  providers: [OrdersHistoryService],
  controllers: [OrdersHistoryController],
  exports: [OrdersHistoryService],
})
export class OrdersHistoryModule {}
