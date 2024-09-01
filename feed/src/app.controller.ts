import { Controller, Get, Request } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  token(@Request() _: unknown) {
    return {
      name: 'feed1',
    };
  }
}
