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

import { User } from '../entities/User';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../jwt.guard';
import { AppService } from '../services/app.service';
import { RefreshTokenGuard } from '../refreshtoken.guard';
import { LoginDto } from '../dtos/login.dto';
import {
  ApiResponse,
  ResponseInterceptor,
} from '../common/interceptors/response.interceptor';
import { CommonExceptionFilter } from '../common/filter/exception.filter';
import { ApiSwagger } from '../decorators/api-operation.decorator';
import { SignupDto } from '../dtos/signup.dto';
import {
  Ctx,
  EventPattern,
  // MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '../common/rmq/rabbitmq.service';
import { TracingInterceptor } from '../common/interceptors/tracing.interceptor';

@ApiTags('authentication')
@Controller('/')
@UseFilters(CommonExceptionFilter)
@UseInterceptors(new ResponseInterceptor(), new TracingInterceptor())
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
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
    const data = {
      firstname,
      lastname,
      username,
      password: hashedPassword,
      hashed_rt: '',
    };

    const user: User = await this.usersService.create(data);
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
    headers: [
      {
        name: 'Authorization',
        description: 'Refresh token',
        required: true,
      },
    ],
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

  @EventPattern('user.context')
  async userContext(@Payload() data: object = {}, @Ctx() context: RmqContext) {
    const users = await this.usersService.findAll();
    this.rmqService.ack(context);
    return users;
  }
}
