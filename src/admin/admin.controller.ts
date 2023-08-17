import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderData } from 'src/orders-history/entities/order-data.entity';
import { OrdersHistoryService } from 'src/orders-history/orders-history.service';
import { Message, PaginatedUsers } from 'src/types/types';
import { User } from 'src/user/entities/user.entity';
import { AdminService } from './admin.service';
import { ChangeStatusDto } from './dto/change-status.dto';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly ordersHistoryService: OrdersHistoryService,
  ) {}

  @ApiOperation({ summary: 'Get order history' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Order-history has been successfully got',
    type: [OrderData],
  })
  @ApiNotFoundResponse({ description: 'This orders-history does not exist.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({ description: 'User does not have any rights.' })
  @Get('user-orders/:userId')
  @UseGuards(JwtAuthGuard)
  getOrdersHistory(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<OrderData[]> {
    if (req.user.role === 'admin') {
      return this.ordersHistoryService.getOrdersHistory(userId);
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({
    description: 'User has been successfully got',
    type: User,
  })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: 'Current user does not exist.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({
    description: 'Current user does not have any rights.',
  })
  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Request() req, @Param('id') id: number): Promise<User> {
    if (req.user.role === 'admin') {
      return this.adminService.getUserById(id);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Get Paginated Users' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Paginated users have been successfully got',
    type: PaginatedUsers,
  })
  @ApiNotFoundResponse({ description: 'Users do not exist.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({ description: 'User does not have any rights.' })
  @Get('users')
  @UseGuards(JwtAuthGuard)
  getPaginatedUsers(
    @Request() req,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ): Promise<PaginatedUsers> {
    if (req.user.role === 'admin') {
      return this.adminService.getPaginatedUsers(limit, skip);
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }

  @ApiOperation({ summary: 'Search Users by firstName-lastName-email' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Users have been successfully searched',
    type: [User],
  })
  @ApiNotFoundResponse({ description: 'Users do not exist.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({ description: 'User does not have any rights.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when searching users.',
  })
  @Get('users/search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Request() req, @Query('q') query: string): Promise<User[]> {
    if (req.user.role === 'admin') {
      return this.adminService.searchUsers(query);
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }

  @ApiOperation({ summary: 'Change User Role' })
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({ description: 'User role has been changed.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when saving the new User.',
    type: Message,
  })
  @ApiUnauthorizedResponse({ description: 'User has bad credentials.' })
  @Post('user-role')
  @UseGuards(JwtAuthGuard)
  changeUserRole(
    @Request() req,
    @Body() changeStatusDto: ChangeStatusDto,
  ): Promise<Message> {
    if (req.user.role === 'admin') {
      return this.adminService.changeUserRole(changeStatusDto);
    } else {
      throw new ConflictException('User does not have any rights.');
    }
  }

  @ApiOperation({ summary: 'User deleting' })
  @ApiOkResponse({
    description: 'User has been successfully deleted.',
    type: Message,
  })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: 'Current user does not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when deleting the user.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({
    description: 'Current user does not have any rights.',
  })
  @Delete('delete-user/:id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Request() req, @Param('id') id: number): Promise<Message> {
    if (req.user.role === 'admin') {
      return this.adminService.deleteUser(id);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
