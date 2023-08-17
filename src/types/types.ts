import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class LoginType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  img: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  token: string;
}

export class PaginatedUsers {
  @ApiProperty({ type: User, isArray: true })
  itemsPerPage: User[];
  @ApiProperty()
  skip: number;
  @ApiProperty()
  total: number;
}

export class Message {
  @ApiProperty()
  message: string;
}

export class Token {
  @ApiProperty()
  token: string;
}

export class Characteristics {
  @ApiProperty()
  name: string;

  @ApiProperty({ default: '', nullable: true })
  @IsOptional()
  value: string;
}

export class RateTasks {
  @ApiProperty()
  productDescription: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isChecked: boolean;
}

export class RatingTasks {
  @ApiProperty()
  productDescription: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  productImg: string;
}
export class CurrentTasks {
  @ApiProperty({ type: RatingTasks, isArray: true })
  ratingTasks: RatingTasks[];

  @ApiProperty()
  questions: number;
}
