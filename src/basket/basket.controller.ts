import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Post,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BasketService } from './basket.service';
import { BasketProductDto } from './dto/basket-product.dto';
import { DeleteBasketProductDto } from './dto/delete-basket-product.dto';
import { BasketDevice } from './entities/basket-device.entity';
import { Message } from 'src/types/types';

@ApiTags('Basket Endpoints')
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiOperation({ summary: 'Get basket products' })
  @ApiOkResponse({
    description: 'Basket products have been successfully got.',
    type: [BasketDevice],
  })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: "Basket doesn't exist." })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({ description: 'No possibility to get products' })
  @Get('products')
  @UseGuards(JwtAuthGuard)
  getBasketProducts(@Request() req): Promise<BasketDevice[]> {
    if (req.user.role) {
      return this.basketService.getBasketProducts(req.user.id);
    } else {
      throw new ConflictException('No possibility to get products');
    }
  }

  @ApiOperation({ summary: 'Adding products into user basket.' })
  @ApiCreatedResponse({
    description: 'Product added to basket or Product Quantity Updated.',
    type: Message,
  })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: "Basket or Product Doesn't exist" })
  @ApiConflictResponse({ description: 'No possibility to add a device' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when adding the device.',
  })
  @Post('add-device')
  @UseGuards(JwtAuthGuard)
  addDevice(
    @Request() req,
    @Body() basketProductDto: BasketProductDto,
  ): Promise<Message> {
    if (req.user.role) {
      return this.basketService.addDevice(req.user.id, basketProductDto);
    } else {
      throw new ConflictException('No possibility to add a device');
    }
  }

  @ApiOperation({ summary: 'Deleting product from basket.' })
  @ApiOkResponse({
    description: 'Basket product has been deleted.',
    type: Message,
  })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: "Basket or Product Doesn't exist" })
  @ApiConflictResponse({
    description: 'No possibility to delete a device from basket.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when deleting the device.',
  })
  @Delete('delete-device')
  @UseGuards(JwtAuthGuard)
  deleteDevice(
    @Request() req,
    @Body() deleteBasketProductDto: DeleteBasketProductDto,
  ): Promise<Message> {
    if (req.user.role) {
      return this.basketService.deleteDevice(
        req.user.id,
        deleteBasketProductDto,
      );
    } else {
      throw new ConflictException(
        'No possibility to delete a device from basket.',
      );
    }
  }
}
