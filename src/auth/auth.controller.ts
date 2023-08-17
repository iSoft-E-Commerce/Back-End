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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BasketService } from 'src/basket/basket.service';
import { LoginType } from 'src/types/types';
import { WishlistService } from '../wishlist/wishlist.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Auth Endpoints (Login & GetProfile)')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly basketService: BasketService,
    private readonly wishlistService: WishlistService,
  ) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({ description: 'User logged in.', type: LoginType })
  @ApiUnauthorizedResponse({ description: 'Incorrect Email or Password.' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginType> {
    const { localBasketProducts, localWishlistProducts } = loginUserDto;

    try {
      await this.basketService.mergeBasket(req.user.id, localBasketProducts);
      await this.wishlistService.mergeWishlist(req.user.id, {
        localWishlistProducts,
      });
      return this.authService.login(req.user);
    } catch (err) {
      throw new ConflictException('Error when Merge Basket or Wishlist.');
    }
  }

  @ApiOperation({ description: 'Get User Profile' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Profile has been successfully got.',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: 'Need User Token for Getting User Profile',
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
