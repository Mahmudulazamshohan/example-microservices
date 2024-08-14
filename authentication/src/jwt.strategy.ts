import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

type JwtPayload = {
  username: string;
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  protected usersService: UsersService;
  constructor(configService: ConfigService, usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    this.usersService = usersService;
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, username } = payload;
    return { userId, username };
  }
}
