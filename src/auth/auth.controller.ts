import { Body, Controller, HttpCode,Post,UsePipes, ValidationPipe, Req, Res,} from '@nestjs/common';
import { Request,  Response} from 'express';
import { AuthService } from './auth.service';

import { AuthDto } from './dto/create-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response){
    return this.authService.login(dto,res)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)    
  @Auth()
  @Post('login/accesss-token')
  async getNewToken(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response){
    return this.authService.getNewTokens(dto.refreshToken,res)
  }
}
