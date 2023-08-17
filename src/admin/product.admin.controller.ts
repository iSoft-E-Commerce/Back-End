import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Query, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
  ApiBadRequestResponse,
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
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import {
  PaginatedProducts,
  Product,
} from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { Message } from 'src/types/types';

@ApiTags('Admin Endpoints')
@Controller('admin')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get paginated products' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Products have been succesfully got',
    type: PaginatedProducts,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Products do not exist' })
  @ApiUnauthorizedResponse({
    description: 'Current user does not have any rights',
  })
  @Get('products')
  @UseGuards(JwtAuthGuard)
  getPaginatedProducts(
    @Request() req,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ): Promise<PaginatedProducts> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.productService.getPaginatedProducts(limit, skip);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Create new product' })
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({ description: 'Product has been succesfully created' })
  @ApiConflictResponse({
    description:
      'Current product already exists or Current user does not have any rights',
  })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiBadRequestResponse({
    description:
      'Name/TypeId/Desc/Color/Price/Characteristics/Img is Required fields.',
  })
  @ApiNotFoundResponse({
    description: 'Type for current product does not exist',
  })
  @Post('product/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createProduct(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.productService.createProduct(createProductDto);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Product has been succesfully updated',
    type: Message,
  })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiNotFoundResponse({ description: 'Current product does not exist' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when updating the product',
  })
  @Put('product-edit/:productId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateProduct(
    @Request() req,
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.productService.updateProduct(productId, updateProductDto);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({ description: 'Product has been deleted', type: Message })
  @ApiConflictResponse({ description: 'Current user does not have any rights' })
  @ApiUnauthorizedResponse({
    description: 'User does not have Token. User Unauthorized.',
  })
  @ApiNotFoundResponse({ description: 'Current product does not exist' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred when deleting the product',
  })
  @Delete('product-delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Request() req, @Param('id') id: number): Promise<Message> {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
      return this.productService.deleteProduct(id);
    } else {
      throw new ConflictException('Current user does not have any rights');
    }
  }
}
