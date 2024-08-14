import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiSwagger } from '../decorators/api-operation.decorator';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/profile')
  @ApiSwagger({
    operationId: 'getUserProfile',
  })
  findAll() {
    return this.usersService.findAll();
  }
}
