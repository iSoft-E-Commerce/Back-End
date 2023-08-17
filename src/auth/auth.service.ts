import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginType } from 'src/types/types';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Incorrect User Data!');
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('Incorrect User Data!');
  }

  async login(user: User): Promise<LoginType> {
    const { id, email, img, firstName, role } = user;
    return {
      id,
      email,
      role,
      img,
      firstName,
      token: this.jwtService.sign({
        id: id,
        email: email,
        role: role,
        firstName: firstName,
        img: img,
      }),
    };
  }
}
