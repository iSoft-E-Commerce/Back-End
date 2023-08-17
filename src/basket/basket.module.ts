import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { BasketDevice } from './entities/basket-device.entity';
import { Basket } from './entities/basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Basket, BasketDevice, User, Product]),
    JwtModule,
  ],
  providers: [BasketService],
  controllers: [BasketController],
  exports: [BasketService],
})
export class BasketModule {}
