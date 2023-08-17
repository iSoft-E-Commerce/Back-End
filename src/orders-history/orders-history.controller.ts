import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
import { CreateOrderDataDto } from './dto/create-order-data.dto';
import { OrderData } from './entities/order-data.entity';
import { OrdersHistoryService } from './orders-history.service';
import { Message } from 'src/types/types';

@ApiTags('Orders-history edpoints')
@Controller('orders-history')
export class OrdersHistoryController {
  constructor(private readonly ordersHistoryService: OrdersHistoryService) {}

  @ApiOperation({ summary: 'Get order-history' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Order-history has been successfully got',
    type: [OrderData],
  })
  @ApiNotFoundResponse({ description: 'This orders-history does not exist.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getOrdersHistory(@Request() req): Promise<OrderData[]> {
    if (req.user.role) {
      return this.ordersHistoryService.getOrdersHistory(req.user.id);
    }
  }

  @ApiOperation({ summary: 'Add order-data' })
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    description: 'Order data saved into user orders history.',
    type: Message,
  })
  @ApiBody({
    type: [CreateOrderDataDto],
    description:
      'Each object in Array, it is each product in Basket (BasketDevice). You can get product in the Basket (id / quantity / product) from everyone User for testing Endpoint.',
  })
  @ApiConflictResponse({ description: 'No possibility to create order data.' })
  @ApiNotFoundResponse({
    description: 'Users or basket orders history does not exist.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when adding new order to the history.',
  })
  @Post('create-order-data')
  @UseGuards(JwtAuthGuard)
  createOrderData(
    @Request() req,
    @Body() createOrderDataDto: CreateOrderDataDto[],
  ): Promise<Message> {
    if (req.user.role) {
      return this.ordersHistoryService.createOrderData(
        req.user.id,
        createOrderDataDto,
      );
    } else {
      throw new ConflictException('No possibility to create order data');
    }
  }
}
