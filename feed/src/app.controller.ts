import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  getJs(@Res() res: Response) {
    res.json({
      success: false,
    });
  }
}
