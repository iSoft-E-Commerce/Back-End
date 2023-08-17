import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Rating } from 'src/rate/entities/rating.entity';
import { Type } from 'src/type/entities/type.entity';
import { Characteristics } from 'src/types/types';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export class ProductPrice {
  @ApiProperty()
  price: number;

  @ApiProperty({ default: null, nullable: true })
  @IsOptional()
  discount?: number | null;
}
export class Color {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: false })
  color: string;
}

@Entity()
export class Product extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  description: string;

  @ApiProperty({ type: ProductPrice })
  @Column('jsonb', { nullable: false })
  price: ProductPrice;

  @ApiProperty()
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty()
  @Column({ default: false })
  isNewProduct: boolean;

  @ApiProperty({ type: Color })
  @Column('jsonb', { nullable: false })
  color: Color;

  @ApiProperty()
  @Column({ nullable: false })
  colorName: string;

  @ApiProperty()
  @Column({ nullable: true })
  memory: string;

  @ApiProperty()
  @Column({ nullable: false })
  img: string;

  @ManyToOne(() => Type, (type) => type.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  type: Type;

  @ApiProperty({ type: () => Rating })
  @OneToOne(() => Rating, (rating) => rating.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rating: Rating;

  @ApiProperty({ type: Characteristics, isArray: true })
  @Column('jsonb', { nullable: true })
  characteristics: Characteristics[];

  @ApiProperty({ type: Characteristics, isArray: true })
  @Column('jsonb', { nullable: true })
  additionalCharacteristics: Characteristics[];
}

export class LocalBasketProduct extends Product {
  @ApiProperty()
  quantity: number;
}

export class FilteredProducts {
  @ApiProperty({ type: Product, isArray: true })
  memory: Product[];

  @ApiProperty({ type: Product, isArray: true })
  colors: Product[];

  @ApiProperty({ type: Product, isArray: true })
  name: Product[];
}

export class PaginatedProducts {
  @ApiProperty({ type: Product, isArray: true })
  itemsPerPage: Product[];

  @ApiProperty()
  skip: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: FilteredProducts })
  filteredProducts?: FilteredProducts;
}
