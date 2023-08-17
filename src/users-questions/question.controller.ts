import { Body, Controller, Post } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateQuestionDto } from '../users-questions/dto/create-question.dto';
import { QuestionService } from './question.service';
import { Message } from 'src/types/types';

@ApiTags('Question Endpoints')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: `Send user's question` })
  @ApiCreatedResponse({
    description: 'Question has been successfully sent.',
    type: Message,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when sending question.',
  })
  @Post('user-question')
  @UsePipes(new ValidationPipe())
  createUserQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Message> {
    return this.questionService.createUserQuestion(createQuestionDto);
  }
}
