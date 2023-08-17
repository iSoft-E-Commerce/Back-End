import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/rate/entities/rating.entity';
import { Type } from 'src/type/entities/type.entity';
import { Message } from 'src/types/types';
import { colorFilter, memoryFilter, nameFilter } from 'src/utils/filterUtils';
import { ILike, In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProducts, Product } from './entities/product.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        where: [
          { description: ILike(`%${query.trim().replace(/\s+/g, ' ')}%`) },
        ],
      });

      return products;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred when searching products.',
      );
    }
  }

  async getPaginatedProducts(
    limit: number,
    skip: number,
  ): Promise<PaginatedProducts> {
    const productsTotal = await this.productRepository.find();
    const itemsPerPage = await this.productRepository.find({
      skip,
      take: limit,
    });

    const result = { itemsPerPage, total: productsTotal.length, skip };

    return result;
  }

  async getPaginatedNewProducts(
    limit: number,
    skip: number,
  ): Promise<PaginatedProducts> {
    const total = await this.productRepository.count({
      where: { isNewProduct: true },
    });

    const newProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.rating', 'rating')
      .leftJoinAndSelect(
        'rating.rating',
        'rate',
        'rate.isChecked = :isChecked',
        {
          isChecked: true,
        },
      )
      .leftJoinAndSelect('rate.user', 'user')
      .where('product.isNewProduct = :isNewProduct', { isNewProduct: true })
      .orderBy('product.isAvailable', 'DESC')
      .addOrderBy('product.updatedAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const result = {
      itemsPerPage: instanceToPlain(newProducts) as Product[],
      total,
      skip,
    };

    return result;
  }

  async getPaginatedDiscountProducts(
    limit: number,
    skip: number,
  ): Promise<PaginatedProducts> {
    const productRepository =
      this.productRepository.createQueryBuilder('product');

    const discountProducts = productRepository.where(
      'product.price ->> :field IS NOT NULL',
      { field: 'discount' },
    );

    const total = await discountProducts.getCount();

    const itemsPerPage = await discountProducts
      .leftJoinAndSelect('product.rating', 'rating')
      .leftJoinAndSelect(
        'rating.rating',
        'rate',
        'rate.isChecked = :isChecked',
        { isChecked: true },
      )
      .orderBy('product.isAvailable', 'DESC')
      .addOrderBy('product.updatedAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getMany();

    const result = {
      itemsPerPage: instanceToPlain(itemsPerPage) as Product[],
      total,
      skip,
    };

    return result;
  }

  async getProductsByName(
    nameTypeId: string,
    skip: number,
    limit: number,
    filter: string,
  ): Promise<PaginatedProducts> {
    const type = await this.typeRepository.findOne({
      where: { name: nameTypeId },
    });
    if (!type) {
      throw new NotFoundException(`Type do not exist.`);
    }
    let whereClause = { type: { id: type.id } };
    const productsForFilter = await this.productRepository.find({
      where: whereClause,
    });

    if (!productsForFilter) {
      throw new NotFoundException(`Products do not exist.`);
    }

    const nameFilteredProducts = nameFilter(productsForFilter);
    const memoryFilteredProducts = memoryFilter(productsForFilter);
    const colorsFilteredProducts = colorFilter(productsForFilter);
    const filteredProducts = {
      memory: memoryFilteredProducts,
      colors: colorsFilteredProducts,
      name: nameFilteredProducts,
    };

    if (filter) {
      const filterParts = filter
        .split(';')
        .filter((item) => item.trim() !== '');
      filterParts.forEach((filterPart) => {
        const [filterKey, filterValues] = filterPart.split('=');
        const values = filterValues.split(',');
        if (filterKey === 'productName') {
          whereClause['name'] = In(values);
          return;
        }
        if (filterKey === 'price') {
          return;
        }
        if (filterKey === 'color') {
          whereClause['colorName'] = In(values);
          return;
        }
        whereClause[filterKey] = In(values);
      });
    }

    const price = filter?.includes('price');
    const total = await this.productRepository.count({ where: whereClause });
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.rating', 'rating')
      .leftJoinAndSelect(
        'rating.rating',
        'rate',
        'rate.isChecked = :isChecked',
        { isChecked: true },
      )
      .leftJoinAndSelect('rate.user', 'user')
      .where(whereClause)
      .orderBy('product.isAvailable', 'DESC')
      .addOrderBy('product.price', price ? 'ASC' : 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    if (!products) {
      throw new NotFoundException(`Products do not exist.`);
    }

    return {
      itemsPerPage: instanceToPlain(products) as Product[],
      skip,
      total,
      filteredProducts,
    };
  }

  async getProductByDescription(description: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.rating', 'rating')
      .leftJoinAndSelect(
        'rating.rating',
        'rate',
        'rate.isChecked = :isChecked',
        { isChecked: true },
      )
      .leftJoinAndSelect('rate.user', 'user')
      .where({ description })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Products by name: ${name} do not exist.`);
    }
    return instanceToPlain(product) as Product;
  }

  async getTheSameProducts(name: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { name },
    });
    if (!products) {
      throw new NotFoundException(`Products by name: ${name} do not exist.`);
    }
    return products;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { typeId, ...newProductDto } = createProductDto;
    const isProduct = await this.productRepository.findOne({
      where: { description: ILike(createProductDto.description) },
    });
    if (isProduct) {
      throw new ConflictException('Current product already exists');
    }
    const typeOfProduct = await this.typeRepository.findOne({
      where: { id: typeId },
    });
    if (!typeOfProduct) {
      throw new NotFoundException(`Type for current product does not exist.`);
    }

    try {
      const createRating = this.ratingRepository.create();
      const createProduct = this.productRepository.create({
        ...newProductDto,
        colorName: newProductDto.color.name,
        type: typeOfProduct,
        rating: createRating,
      });
      createRating.product = createProduct;

      await this.productRepository.save(createProduct);
      await this.ratingRepository.save(createRating);

      const savedProduct = await this.productRepository.save(createProduct);

      return savedProduct;
    } catch {
      throw new InternalServerErrorException(
        'An error occurred when creating the product.',
      );
    }
  }

  async updateProduct(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Message> {
    const { price, characteristics, additionalCharacteristics, ...otherData } =
      updateProductDto;
    const currentProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!currentProduct) {
      throw new NotFoundException(`Current product does not exist.`);
    }
    try {
      await this.productRepository.update(productId, {
        ...updateProductDto,
      });
      return { message: 'Product updated' };
    } catch {
      throw new InternalServerErrorException(
        'An error occurred when updating the product.',
      );
    }
  }

  async deleteProduct(id: number): Promise<Message> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Current product does not exist.`);
    }

    try {
      await this.productRepository.delete(product.id);
      return { message: 'Product has been deleted' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred when deleting the product.',
      );
    }
  }
}
