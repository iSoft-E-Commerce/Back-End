import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketDevice } from 'src/basket/entities/basket-device.entity';
import { Basket } from 'src/basket/entities/basket.entity';
import { ContactsService } from 'src/contacts/contacts.service';
import { Contacts } from 'src/contacts/entities/contacts.entity';
import { OrderData } from 'src/orders-history/entities/order-data.entity';
import { OrdersHistory } from 'src/orders-history/entities/orders-history.entity';
import { OrdersHistoryService } from 'src/orders-history/orders-history.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { Rate } from 'src/rate/entities/rate.entity';
import { Rating } from 'src/rate/entities/rating.entity';
import { RateService } from 'src/rate/rate.service';
import { Type } from 'src/type/entities/type.entity';
import { TypeService } from 'src/type/type.service';
import { User } from 'src/user/entities/user.entity';
import { UserQuestion } from 'src/users-questions/entities/question.entity';
import { QuestionService } from 'src/users-questions/question.service';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminContactsController } from './contacts.admin.controller';
import { AdminCurrentTasksController } from './current-tasks.admin.controller';
import { AdminProductController } from './product.admin.controller';
import { AdminQuestionController } from './question.admin.controller';
import { AdminRateController } from './rate.admin.controller';
import { AdminTypeController } from './type.admin.controller';
import { CurrentTasksService } from 'src/current-tasks/current-tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wishlist,
      OrdersHistory,
      Basket,
      BasketDevice,
      Type,
      Rate,
      Rating,
      Product,
      OrderData,
      UserQuestion,
      Contacts,
    ]),
    JwtModule,
  ],
  providers: [
    AdminService,
    TypeService,
    RateService,
    ProductService,
    OrdersHistoryService,
    QuestionService,
    ContactsService,
    CurrentTasksService,
  ],
  controllers: [
    AdminController,
    AdminTypeController,
    AdminRateController,
    AdminProductController,
    AdminQuestionController,
    AdminContactsController,
    AdminCurrentTasksController,
  ],
  exports: [AdminService],
})
export class AdminModule {}
