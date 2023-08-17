import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Product } from '../../product/entities/product.entity';

export class MergeWishlistDto {
  @ApiProperty({
    default: [],
    description: 'LocalStorage Wishlist Products might be empty',
    example: [
      {
        id: 1,
        createdAt: '2023-06-20T10:28:07.465Z',
        updatedAt: '2023-06-20T10:28:07.465Z',
        name: 'IPhone TEST4',
        description: 'IPhone TEST4 256gb black',
        price: {
          price: 3000,
          discount: 100,
        },
        isAvailable: true,
        isNewProduct: false,
        color: 'black',
        memory: '256Gb',
        size: null,
        img: 'testIMG.com',
        characteristics: {
          Память: '256Gb',
          Гарантия: '12мес',
        },
        additionalCharacteristics: null,
      },
    ],
  })
  @IsArray()
  localWishlistProducts: Product[];
}
