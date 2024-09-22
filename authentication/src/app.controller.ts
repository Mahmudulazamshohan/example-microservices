import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Req,
  UseInterceptors,
  UseFilters,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs';

import { User } from './entities/User';
import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './jwt.guard';
import { AppService } from './app.service';
import { RefreshTokenGuard } from './refreshtoken.guard';
import { LoginDto } from './users/dto/login.dto';
import {
  ApiResponse,
  ResponseInterceptor,
} from './common/interceptors/response.interceptor';
import { CommonExceptionFilter } from './common/filter/exception.filter';
import { ApiSwagger } from './decorators/api-operation.decorator';
import { SignupDto } from './users/dto/signup.dto';

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
    query: { type: SignupDto },
    response: { type: ApiResponse<User> },
  })
  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    const { username, password, firstname, lastname } = signupDto;
    const userExists = await this.usersService.findOne({ where: { username } });

    if (userExists) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const user: User = await this.usersService.create({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      hashed_rt: '',
    });

    await this.usersService.save(user);
    return await this.appService.login({
      username,
      password,
    });
  }

  @ApiSwagger({
    operationId: 'login',
    authentication: false,
    query: { type: LoginDto },
    response: { type: ApiResponse<User> },
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiSwagger({
    operationId: 'refresh',
    response: { type: ApiResponse<User> },
  })
  @Post('/refresh')
  async refresh(@Req() req: any) {
    if (!req['user']) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const user = req['user'] ?? {};
    return this.appService.refresh(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSwagger({
    operationId: 'me',
    response: { type: ApiResponse<User> },
  })
  @Get('/me')
  me(@Request() req: any) {
    return req?.user ?? {};
  }
}
