import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(options: FindOneOptions): Promise<User> {
    return this.userRepository.findOne(options);
  }

  async save(user: User) {
    return this.userRepository.save(user);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<string> {
    const hashedRt = await bcrypt.hashSync(refreshToken, 10);
    await this.userRepository.update(userId, { hashed_rt: hashedRt });
    return hashedRt;
  }

  async updateLastLogin(payload) {
    const { username = '' } = payload;
    const lastLogin = new Date();
    return this.userRepository.update({ username }, { last_login: lastLogin });
  }
}
