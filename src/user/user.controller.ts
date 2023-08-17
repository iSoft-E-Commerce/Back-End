import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Message, Token } from 'src/types/types';

@ApiTags('User Endpoints')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'SignUp' })
  @ApiBody({ type: CreateUserDto, description: 'User signup Credentials' })
  @ApiCreatedResponse({
    description: 'User has been successfully created.',
    type: Token,
  })
  @ApiBadRequestResponse({ description: 'This email is already existed!' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when saving the new User.',
  })
  @Post('signup')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto): Promise<Token> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get User Profile' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({ description: 'User Profile has been got.', type: User })
  @ApiNotFoundResponse({ description: 'User is not found.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({
    description: 'Current user does not have any rights.',
  })
  @Get('/account')
  @UseGuards(JwtAuthGuard)
  getUserData(@Request() req): Promise<User> {
    if (req.user.role) {
      return this.userService.getUserData(req.user.id);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Update User Data' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({ description: 'User has been updated.', type: Message })
  @ApiNotFoundResponse({ description: 'User is not found.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occured when updating the user.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({
    description: 'Current user does not have any rights.',
  })
  @Put('/update')
  @UseGuards(JwtAuthGuard)
  updateUserData(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    if (req.user.role) {
      return this.userService.updateUserData(req.user.id, updateUserDto);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
