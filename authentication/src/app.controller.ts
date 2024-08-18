import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Req,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/User';

import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './jwt.guard';
import { AppService } from './app.service';
import { RefreshTokenGuard } from './refreshtoken.guard';
import { LoginDto } from './login.dto';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CommonExceptionFilter } from './common/filter/exception.filter';
import { ApiSwagger } from './decorators/api-operation.decorator';

@ApiTags('authentication')
@Controller('/')
@UseFilters(CommonExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}
  @ApiSwagger({
    operationId: 'signup',
    authentication: false,
  })
  @Post('/signup')
  signup() {
    return this.usersService.save();
  }

  @ApiQuery({ type: LoginDto })
  @ApiSwagger({ operationId: 'login', authentication: false })
  @Post('/login')
  async login(@Body() user: LoginDto) {
    return this.appService.login(user);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiSwagger({ operationId: 'refresh' })
  @Post('/refresh')
  async refresh(@Req() req: any) {
    if (!req['user']) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const user = req['user'] ?? {};
    return this.appService.refresh(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSwagger({ operationId: 'me' })
  @ApiResponse({
    type: User,
  })
  @Get('/me')
  token(@Request() req: any) {
    return req ? req.user : {};
  }
}
