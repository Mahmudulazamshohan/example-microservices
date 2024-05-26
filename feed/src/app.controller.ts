import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  @Get()
  findAll() {
    return {
      name: 'app',
    };
  }
}
