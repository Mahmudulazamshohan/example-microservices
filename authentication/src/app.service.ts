import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users/users.service';
import { removeProperties } from './utils';
import { User } from './entities/User';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    password: string,
    isRefreshToken = false,
  ): Promise<User> {
    const user = await this.usersService.findOne({ where: { username } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (isRefreshToken && user && password === user.password) {
      return {
        ...(removeProperties(user, ['password', 'hashed_rt']) as User),
        sub: user.user_id,
      } as any;
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        ...(removeProperties(user, ['password', 'hashed_rt']) as User),
        sub: user.user_id,
      } as any;
    }

    return null;
  }

  async login(user, isRefreshToken = false) {
    const payload = await this.validateUser(
      user.username,
      user.password,
      isRefreshToken,
    );

    const options: JwtSignOptions = { algorithm: 'RS256' };

    const refreshToken = await this.jwtService.signAsync(payload, {
      ...options,
      secret: this.configService.getOrThrow('REFRESH_JWT_SECRET'),
      expiresIn: '7d',
    });

    const accessToken = await this.jwtService.signAsync(payload, options);

    if (payload) {
      if (!isRefreshToken) {
        await this.usersService.updateLastLogin(payload);
      }

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
    return {};
  }

  async refresh(payload: { username: string; hashedRt: string }) {
    try {
      const user = await this.usersService.findOne({
        where: { username: payload.username },
      });

      const data = await this.login(user, true);
      await this.usersService.updateRefreshToken(
        user.user_id,
        data.refresh_token,
      );

      return data;
    } catch (e) {
      console.log('ERROR', e);
      throw new UnauthorizedException();
    }
  }
}
