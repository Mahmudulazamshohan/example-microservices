import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { getToken, removeProperties } from './utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const type = context?.getType();

    if (['rpc', 'http'].includes(type)) {
      const token: string = getToken(this.getAuthentication(context));
      try {
        const user = this.jwtService.verify(token);
        this.attachUserToContext(context, type, user);
        return !!user;
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
      throw new UnauthorizedException('No valid token was provided');
    }

    return authorization;
  }

  private attachUserToContext(
    context: ExecutionContext,
    type: string,
    user: any,
  ): void {
    const ignore = ['iat', 'exp'];
    if (type === 'rpc') {
      context.switchToRpc().getData().user = removeProperties(user, ignore);
    } else {
      context.switchToHttp().getRequest().user = removeProperties(user, ignore);
    }
    return user;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'You must provide a valid OAuth token to make a request',
        )
      );
    }
    return user;
  }
}
