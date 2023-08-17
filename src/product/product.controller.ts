import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProducts, Product } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiTags('Product Endpoints')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Search Products by description' })
  @ApiOkResponse({
    description: 'Products have been successfully searched',
    type: [Product],
  })
  @ApiNotFoundResponse({ description: 'Product do not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when searching products.',
  })
  @Get('/search')
  searchProducts(@Query('q') query: string): Promise<Product[]> {
    return this.productService.searchProducts(query);
  }

  @ApiOperation({ summary: 'Get paginated new products' })
  @ApiOkResponse({
    description: 'New products have been got',
    type: PaginatedProducts,
  })
  @ApiNotFoundResponse({ description: 'No new products exist' })
  @Get('newProducts')
  getPaginatedNewProducts(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ): Promise<PaginatedProducts> {
    return this.productService.getPaginatedNewProducts(limit, skip);
  }

  @ApiOperation({ summary: 'Get paginated discount products' })
  @ApiOkResponse({
    description: 'Discount products have been got',
    type: PaginatedProducts,
  })
  @ApiNotFoundResponse({ description: 'No discount products exist' })
  @Get('discountProducts')
  getPaginatedDiscountProducts(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ): Promise<PaginatedProducts> {
    return this.productService.getPaginatedDiscountProducts(limit, skip);
  }

  @ApiOperation({ summary: 'Get products by Name' })
  @ApiOkResponse({
    description: 'Products by name have been got',
    type: PaginatedProducts,
  })
  @ApiNotFoundResponse({ description: 'No products by name exist' })
  @ApiQuery({
    name: 'filter',
    required: false,
    example: 'color=Red,Green;memory=128GB',
  })
  @Get('byName/:nameTypeId')
  getProductsByName(
    @Param('nameTypeId') nameTypeId: string,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
  ): Promise<PaginatedProducts> {
    return this.productService.getProductsByName(
      nameTypeId,
      skip,
      limit,
      filter,
    );
  }

  @ApiOperation({ summary: 'Get the same products by Name' })
  @ApiOkResponse({
    description: 'Products by the same name have been got',
    type: [Product],
  })
  @ApiNotFoundResponse({ description: 'No products by name exist' })
  @Get('name/:name')
  getTheSameProducts(@Param('name') name: string): Promise<Product[]> {
    return this.productService.getTheSameProducts(name);
  }

  @ApiOperation({ summary: 'Get products by description' })
  @ApiOkResponse({
    description: 'Products by description have been got',
    type: Product,
  })
  @ApiNotFoundResponse({ description: 'No products by description exist' })
  @Get('byDescription/:description')
  getProductByDescription(
    @Param('description') description: string,
  ): Promise<Product> {
    return this.productService.getProductByDescription(description);
  }
}
