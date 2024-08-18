import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findAll() {
    return {
      users: [],
    };
  }

  async findOne(where: unknown): Promise<User> {
    return this.userRepository.findOne({ where });
  }

  save() {}

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<string> {
    const hashedRt = await bcrypt.hashSync(refreshToken, 10);
    await this.userRepository.update(userId, { hashed_rt: hashedRt });
    return hashedRt;
  }

  async updateLastLogin(payload: { username: string }) {
    const lastLogin = new Date();
    const user = await this.userRepository.update(
      {
        username: payload.username,
      },
      {
        last_login: lastLogin,
      },
    );
    return user;
  }
}
