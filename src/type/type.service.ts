import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';
import { Message } from 'src/types/types';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type) private readonly typeRepository: Repository<Type>,
  ) {}

  async getTypes(): Promise<Type[]> {
    const types = await this.typeRepository.find();
    return types;
  }

  async createType(createTypeDto: CreateTypeDto): Promise<Type> {
    const isTypeExist = await this.typeRepository.findOne({
      where: { name: ILike(createTypeDto.name) },
    });
    if (isTypeExist) {
      throw new ConflictException('Current type already exists');
    }

    try {
      const type = this.typeRepository.create({
        name: createTypeDto.name,
        characteristics: createTypeDto.characteristics,
      });

      const savedType = await this.typeRepository.save(type);

      return savedType;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when saving the type.',
      );
    }
  }

  async updateType(id: number, updateTypeDto: UpdateTypeDto): Promise<Message> {
    const type = await this.typeRepository.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException('Current type not found');
    }
    try {
      await this.typeRepository.update(type.id, updateTypeDto);
      return { message: 'Type has been updated' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when updating the type.',
      );
    }
  }

  async deleteType(id: number): Promise<Message> {
    const type = await this.typeRepository.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException('Current type not found');
    }
    try {
      await this.typeRepository.delete(type.id);
      return { message: 'Type has been deleted' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when deleting the type.',
      );
    }
  }
}
