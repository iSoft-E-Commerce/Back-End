import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, PaginatedUsers } from 'src/types/types';
import { User } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async changeUserRole(changeStatusDto: ChangeStatusDto): Promise<Message> {
    const userProfile = await this.userRepository.findOne({
      where: { id: changeStatusDto.userId },
    });
    if (!userProfile) {
      throw new NotFoundException(`Current user does not exist.`);
    }
    try {
      await this.userRepository.update(changeStatusDto.userId, {
        role: changeStatusDto.role.toLowerCase(),
      });
      return { message: 'User Role has been successfully updated.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when changing user Role.',
      );
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Current user does not exist.`);
    }
    return user;
  }

  async getPaginatedUsers(
    limit: number,
    skip: number,
  ): Promise<PaginatedUsers> {
    const usersTotal = await this.userRepository.find();
    if (!usersTotal.length) {
      throw new NotFoundException('Users not found.');
    }

    const itemsPerPage = await this.userRepository.find({
      skip,
      take: limit,
    });

    if (!itemsPerPage.length) {
      throw new NotFoundException('Users not found.');
    }

    return { itemsPerPage, total: usersTotal.length, skip };
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        where: [
          { firstName: ILike(`%${query.trim()}%`) },
          { lastName: ILike(`%${query}%`) },
          { email: ILike(`%${query}%`) },
        ],
      });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred when searching users.',
      );
    }
  }

  async deleteUser(id: number): Promise<Message> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Current user does not exist.`);
    }

    try {
      await this.userRepository.delete(user.id);

      return { message: 'User has been deleted' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when deleting the user.',
      );
    }
  }
}
