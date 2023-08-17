import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/rate/entities/rating.entity';
import { CurrentTasks, RatingTasks } from 'src/types/types';
import { UserQuestion } from 'src/users-questions/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrentTasksService {
  constructor(
    @InjectRepository(UserQuestion)
    private readonly userQuestionRepository: Repository<UserQuestion>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async getCurrentTasks(): Promise<CurrentTasks> {
    try {
      const questions = await this.userQuestionRepository.find({
        where: { isChecked: false },
      });

      const tasks = await this.ratingRepository
        .createQueryBuilder('rating')
        .leftJoinAndSelect('rating.product', 'product')
        .leftJoinAndSelect('rating.rating', 'rate')
        .getMany();
      if (!tasks) {
        throw new NotFoundException(`Product does not exist.`);
      }

      const ratingTasks: RatingTasks[] = tasks.reduce((result, task) => {
        const uncheckedRatings = task.rating.filter(
          (rating) => !rating.isChecked,
        );
        if (uncheckedRatings.length > 0) {
          result.push({
            productDescription: task.product.description,
            rating: uncheckedRatings.length,
            productImg: task.product.img,
          });
        }
        return result;
      }, []);

      return { ratingTasks, questions: questions.length };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when getting current tasks.',
      );
    }
  }
}
