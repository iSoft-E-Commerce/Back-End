import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BasketService } from 'src/basket/basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketDevice } from 'src/basket/entities/basket-device.entity';
import { Basket } from 'src/basket/entities/basket.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { WishlistDevice } from '../wishlist/entities/wishlist-device.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { WishlistService } from '../wishlist/wishlist.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([
      Basket,
      BasketDevice,
      User,
      Product,
      Wishlist,
      WishlistDevice,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    BasketService,
    LocalStrategy,
    WishlistService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
