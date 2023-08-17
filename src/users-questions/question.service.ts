import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/types/types';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../users-questions/dto/create-question.dto';
import {
  PaginatedUserQuestions,
  UserQuestion,
} from '../users-questions/entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(UserQuestion)
    private readonly userQuestionRepository: Repository<UserQuestion>,
  ) {}

  async createUserQuestion(
    createQuestion: CreateQuestionDto,
  ): Promise<Message> {
    try {
      const newQuestion = this.userQuestionRepository.create(createQuestion);
      await this.userQuestionRepository.save(newQuestion);

      return { message: 'Question has been successfully sent.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when changing user Role.',
      );
    }
  }

  async getUserQuestion(questionId: number): Promise<UserQuestion> {
    const userQuestion = await this.userQuestionRepository.findOne({
      where: { id: questionId },
    });
    if (!userQuestion) {
      throw new NotFoundException('Question not found.');
    }
    return userQuestion;
  }

  async getPaginatedQuestions(
    limit: number,
    skip: number,
    isChecked: boolean = false,
  ): Promise<PaginatedUserQuestions> {
    const usersQuestionsTotal = await this.userQuestionRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        isChecked,
      },
    });

    if (!usersQuestionsTotal) {
      throw new NotFoundException('Questions not found.');
    }

    const itemsPerPage = await this.userQuestionRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        isChecked,
      },
      skip,
      take: limit,
    });

    if (!itemsPerPage) {
      throw new NotFoundException('Questions not found.');
    }

    return {
      itemsPerPage,
      total: usersQuestionsTotal.length,
      skip,
    };
  }

  async moderateQuestion(questionId: number): Promise<Message> {
    const question = await this.userQuestionRepository.findOne({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found.');
    }
    try {
      await this.userQuestionRepository.update(question.id, {
        isChecked: true,
      });

      return { message: 'Question has been successfully moderated.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when moderating user question.',
      );
    }
  }
}
