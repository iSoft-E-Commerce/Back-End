import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import { Characteristics } from 'src/types/types';
import { Base } from 'src/utils/base';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Type extends Base {
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty({ type: Characteristics, isArray: true })
  @Column('json', { nullable: false })
  characteristics: Characteristics[];

  @OneToMany(() => Product, (product) => product.type, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  products: Product[];
}
