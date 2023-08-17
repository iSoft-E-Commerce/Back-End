import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { ModerateRateDto } from './dto/moderate-rate.dto';
import { Rate } from './entities/rate.entity';
import { Rating } from './entities/rating.entity';
import { Message } from 'src/types/types';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate) private readonly rateRepository: Repository<Rate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createRate(
    userId: number,
    createRateDto: CreateRateDto,
  ): Promise<Rate> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User does not exist.`);
    }

    const productRating = await this.ratingRepository
      .createQueryBuilder('rating')
      .innerJoinAndSelect('rating.product', 'product')
      .leftJoinAndSelect('rating.rating', 'rate')
      .where('product.id = :productId', { productId: createRateDto.productId })
      .getOne();

    if (!productRating) {
      throw new NotFoundException(`This rating does not exist.`);
    }

    try {
      const rate = this.rateRepository.create({
        rate: createRateDto.rate,
        review: createRateDto.review,
        rating: productRating,
        user,
      });

      await this.userRepository.save(user);
      await this.ratingRepository.save(productRating);
      await this.rateRepository.save(rate);

      return instanceToPlain(rate) as Rate;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when saving the rate.',
      );
    }
  }

  async getAllRating(productId: number): Promise<Rate[]> {
    const currProduct = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['rating', 'rating.rating', 'rating.rating.user'],
    });
    if (!currProduct) {
      throw new NotFoundException(`Product does not exist.`);
    }

    const currRating = currProduct.rating;
    if (!currRating) {
      throw new NotFoundException(`Rating does not exist.`);
    }

    const allRates = currRating.rating;
    if (!allRates) {
      throw new NotFoundException(`Rate does not exist.`);
    }
    return instanceToPlain(allRates) as Rate[];
  }

  async getCheckedRating(productId: number): Promise<Rate[]> {
    const currProduct = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['rating', 'rating.rating', 'rating.rating.user'],
    });
    if (!currProduct) {
      throw new NotFoundException(`Product does not exist.`);
    }

    const currRating = currProduct.rating;
    if (!currRating) {
      throw new NotFoundException(`Rating do not exist.`);
    }

    const allRates = currRating.rating;
    if (!allRates) {
      throw new NotFoundException(`Rate does not exist.`);
    }

    const checkedRates = allRates.filter((rate) => rate.isChecked === true);

    return instanceToPlain(checkedRates) as Rate[];
  }

  async moderateUserReview(
    rateId: number,
    moderatorName: string,
    moderateRateDto: ModerateRateDto,
  ): Promise<Message> {
    const isRate = await this.rateRepository.findOne({ where: { id: rateId } });
    if (!isRate) {
      throw new NotFoundException('Current rate does not exist');
    }
    try {
      const rate = await this.rateRepository.update(rateId, {
        isChecked: true,
        moderatorReply: {
          name: moderatorName,
          reply: moderateRateDto.moderatorReply,
        },
      });
      if (rate.affected === 0) {
        throw new BadRequestException('No changes were made.');
      }
      return { message: 'Rate has been successfully moderated.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when moderating the rate.',
      );
    }
  }

  async deleteRate(rateId: number): Promise<Message> {
    const rate = await this.rateRepository.delete(rateId);
    if (rate.affected === 0) {
      throw new BadRequestException('No changes were made.');
    }
    return { message: 'Rate has been deleted.' };
  }
}
