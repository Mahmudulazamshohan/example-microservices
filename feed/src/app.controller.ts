import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { type Response } from 'express';

@Controller()
export class AppController {
  @Get('/main.js')
  getJs(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(join(__dirname, '../../fontend', 'index.fontend.js'));
  }
}
