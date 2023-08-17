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
import { WishlistProductDto } from './dto/wishlist-product.dto';
import { WishlistDevice } from './entities/wishlist-device.entity';
import { WishlistService } from './wishlist.service';
import { Message } from 'src/types/types';

@ApiTags('Wishlist Endpoints')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiOperation({ summary: 'Get User`s wishlist products' })
  @ApiOkResponse({
    description: 'User`s wishlist was successfully gotten.',
    type: [WishlistDevice],
  })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiNotFoundResponse({ description: `This wishlist does not exist.` })
  @ApiConflictResponse({ description: 'No possibility to get products' })
  @Get('products')
  @UseGuards(JwtAuthGuard)
  getWishlistProducts(@Request() req): Promise<WishlistDevice[]> {
    if (req.user.role) {
      return this.wishlistService.getWishlistProducts(req.user.id);
    } else {
      throw new ConflictException('No possibility to get products');
    }
  }

  @ApiOperation({ summary: 'Adding device to the wishlist' })
  @ApiCreatedResponse({
    description: 'A device was added into wishlist.',
    type: WishlistDevice,
  })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({ description: 'Wishlist or product is not found.' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({
    description:
      'No possibility to add a device or a product is already in wishlist.',
  })
  @Post('add-device')
  @UseGuards(JwtAuthGuard)
  addDevice(
    @Request() req,
    @Body() wishlistProductDto: WishlistProductDto,
  ): Promise<WishlistDevice> {
    if (req.user.role) {
      return this.wishlistService.addDevice(req.user.id, wishlistProductDto);
    } else {
      throw new ConflictException('No possibility to add a device');
    }
  }

  @ApiOperation({ summary: 'Product deleting from wishlist' })
  @ApiOkResponse({ description: 'This product was deleted.', type: Message })
  @ApiBearerAuth('Token')
  @ApiNotFoundResponse({
    description: 'This product does not exist in wishlist.',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiConflictResponse({
    description: 'Something went wrong when deleting a device.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when deleting the device.',
  })
  @Delete('delete-product')
  @UseGuards(JwtAuthGuard)
  deleteDevice(
    @Request() req,
    @Body() wishlistProductDto: WishlistProductDto,
  ): Promise<Message> {
    if (req.user.role) {
      return this.wishlistService.deleteDevice(req.user.id, wishlistProductDto);
    } else {
      throw new ConflictException(
        'Something went wrong when deleting a device',
      );
    }
  }
}
