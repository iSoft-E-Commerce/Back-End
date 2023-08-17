import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Basket } from 'src/basket/entities/basket.entity';
import { OrdersHistory } from 'src/orders-history/entities/orders-history.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { Message, Token } from 'src/types/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
    @InjectRepository(OrdersHistory)
    private readonly orderHistoryRepository: Repository<OrdersHistory>,
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Token> {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) {
      throw new BadRequestException('This email is already existed!');
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = this.userRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
      });

      const basket = this.basketRepository.create();
      const orderHistory = this.orderHistoryRepository.create();
      const wishList = this.wishListRepository.create();

      basket.user = newUser;
      orderHistory.user = newUser;
      wishList.user = newUser;

      newUser.basket = basket;
      newUser.orders = orderHistory;
      newUser.wishlist = wishList;

      await this.userRepository.save(newUser);

      const token = this.jwtService.sign({ email: createUserDto.email });

      return { token };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when saving the new User.',
      );
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getUserData(userId: number): Promise<User> {
    const userData = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userData) {
      throw new NotFoundException(`Current user does not exist.`);
    }
    return instanceToPlain(userData) as User;
  }

  async updateUserData(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    const userProfile = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userProfile) {
      throw new NotFoundException(`Current user does not exist.`);
    }
    try {
      await this.userRepository.update(userId, { ...updateUserDto });
      return { message: 'User has been successfully updated.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when updating the user.',
      );
    }
  }
}
