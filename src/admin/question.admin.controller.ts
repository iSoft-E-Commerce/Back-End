import {
  ConflictException,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Message } from 'src/types/types';
import {
  PaginatedUserQuestions,
  UserQuestion,
} from 'src/users-questions/entities/question.entity';
import { QuestionService } from 'src/users-questions/question.service';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: 'Get paginated users questions' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Questions have been succesfully got',
    type: PaginatedUserQuestions,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Questions do not exist' })
  @ApiUnauthorizedResponse({
    description: 'Current user does not have any rights',
  })
  @Get('users-questions')
  @ApiQuery({ name: 'isChecked', required: false })
  @UseGuards(JwtAuthGuard)
  getPaginatedQuestions(
    @Request() req,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Query('isChecked') isChecked: boolean,
  ): Promise<PaginatedUserQuestions> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.questionService.getPaginatedQuestions(limit, skip, isChecked);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Get user question' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Question has been succesfully got',
    type: UserQuestion,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Question does not exist' })
  @ApiUnauthorizedResponse({
    description: 'Current user does not have any rights',
  })
  @Get('user-question/:questionId')
  @UseGuards(JwtAuthGuard)
  getUserQuestion(
    @Request() req,
    @Param('questionId') questionId: number,
  ): Promise<UserQuestion> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.questionService.getUserQuestion(questionId);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Moderate Question' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Question has been succesfully moderated',
    type: Message,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Question do not exist' })
  @ApiUnauthorizedResponse({
    description: 'Current user does not have any rights',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when moderating user question.',
  })
  @Put('moderate-question/:questionId')
  @UseGuards(JwtAuthGuard)
  moderateQuestion(
    @Request() req,
    @Param('questionId') questionId: number,
  ): Promise<Message> {
    console.log(questionId);
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.questionService.moderateQuestion(questionId);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
