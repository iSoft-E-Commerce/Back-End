import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BasketModule } from './basket/basket.module';
import { ContactsModule } from './contacts/contacts.module';
import { OrdersHistoryModule } from './orders-history/orders-history.module';
import { ProductModule } from './product/product.module';
import { RateModule } from './rate/rate.module';
import { TypeModule } from './type/type.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './users-questions/question.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CurrentTasksModule } from './current-tasks/current-tasks.module';

@Module({
  imports: [
    UserModule,
    TypeModule,
    AuthModule,
    ProductModule,
    RateModule,
    BasketModule,
    OrdersHistoryModule,
    WishlistModule,
    AdminModule,
    ContactsModule,
    QuestionModule,
    CurrentTasksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        ssl: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
