import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, Req, Res } from '@nestjs/common';
import { Request,  Response} from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile')
  async getProfile( @Req() req: Request, @Res({ passthrough: true }) res: Response){
    return this.userService.byId(req,res)
  }

  // @UsePipes(new ValidationPipe())
  // @Auth()
  // @HttpCode(200)
}
