import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { getToken, removeProperties } from './utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context?.getType();

    if (type === 'http') {
      const token: string = getToken(this.getAuthentication(context));
      try {
        const user = this.jwtService.verify(token, {
          secret: this.configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
        });

        return this.attachUserToContext(context, type, user);
      } catch (error) {
        new Error(error);
      }
    }
    return super.canActivate(context);
  }

  private getAuthentication(context: ExecutionContext): string {
    let authorization: string;
    if (context.getType() === 'rpc') {
      authorization = context?.switchToRpc()?.getData()?.authorization;
    } else {
      const headers = context?.switchToHttp()?.getRequest()?.headers;
      authorization = headers?.authorization ?? '';
    }

    if (!authorization) {
      throw new ForbiddenException('No valid refresh token was provided');
    }
    return authorization;
  }

  private attachUserToContext(
    context: ExecutionContext,
    type: string,
    user: any,
  ): boolean {
    const ignore = ['iat', 'exp'];
    if (type === 'rpc') {
      context.switchToRpc().getData().user = removeProperties(user, ignore);
    } else {
      context.switchToHttp().getRequest().user = removeProperties(user, ignore);
    }
    return !!user;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err ||
        new ForbiddenException(
          'You must provide a valid OAuth refresh token to make a request',
        )
      );
    }
    return user;
  }
}
