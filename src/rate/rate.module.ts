import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Rate } from './entities/rate.entity';
import { Rating } from './entities/rating.entity';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rate, Rating, Product, User]), JwtModule],
  providers: [RateService],
  controllers: [RateController],
  exports: [RateService],
})
export class RateModule {}
