import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, MinLength } from 'class-validator';
import {
  LocalBasketProduct,
  Product,
} from '../../product/entities/product.entity';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Password must be more than 6 symbols!' })
  password: string;

  @ApiProperty({
    type: Product,
    isArray: true,
  })
  @IsArray()
  localWishlistProducts: Product[];

  @ApiProperty({
    type: LocalBasketProduct,
    isArray: true,
  })
  @IsArray()
  localBasketProducts: LocalBasketProduct[];
}
