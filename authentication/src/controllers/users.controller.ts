import { Controller, Delete, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiSwagger } from '../decorators/api-operation.decorator';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @ApiSwagger({
    operationId: 'getProfile',
    description: 'get profile',
  })
  getProfile() {
    return this.usersService.findAll();
  }

  @Delete('/profile')
  @ApiSwagger({
    operationId: 'deleteProfile',
    description: 'delete profile',
  })
  deleteProfile() {
    return Promise.resolve();
  }
}
