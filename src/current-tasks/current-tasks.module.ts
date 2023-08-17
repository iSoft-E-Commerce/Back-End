import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rate } from 'src/rate/entities/rate.entity';
import { Rating } from 'src/rate/entities/rating.entity';
import { UserQuestion } from 'src/users-questions/entities/question.entity';
import { Product } from '../product/entities/product.entity';
import { CurrentTasksController } from './current-tasks.controller';
import { CurrentTasksService } from './current-tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, UserQuestion, Rating, Rate]),
    JwtModule,
  ],
  providers: [CurrentTasksService],
  controllers: [CurrentTasksController],
  exports: [CurrentTasksService],
})
export class CurrentTasksModule {}
