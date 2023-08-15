import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {faker} from '@faker-js/faker'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}
    

    async login(dto: AuthDto){
      
      const oldUser = await this.prisma.user.findUnique({
        where: {
            phone: dto.phone
        }
      })

      if(oldUser){
        const user = await this.validateUser(dto)
        const tokens = await this.issueTokens(user.id)
  
        return {
          user: this.returnUserFields(user),
          ...tokens
        }
      }
      else{
        const user = await this.prisma.user.create({
          data: {
            phone: dto.phone /*faker.phone.number('+7 (###) ###-##-##')*/,
            name: faker.person.firstName()
          }
        })

        const tokens = await this.issueTokens(user.id)

        return {
          user: this.returnUserFields(user),
          ...tokens
        }
      }
    }

    async getNewTokens(refreshToken: string){
      
      const result = await this.jwt.verifyAsync(refreshToken)
      if(!result) throw new UnauthorizedException('Invalid resresh token')

      const user = await this.prisma.user.findUnique({
        where: {
          id: result.id
        }
      })

      const tokens = await this.issueTokens(user.id)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    private async issueTokens(userId: number){
      const data = {id: userId}

      const accessToken = this.jwt.sign(data, {
        expiresIn: '1h'
      })

      const refreshToken = this.jwt.sign(data, {
        expiresIn: '7d'
      })

      return {accessToken,refreshToken}
    }
    

    private returnUserFields(user: User){
      return {
        id: user.id,
        phone: user.phone,
        name: user.name
      }
    }

    private async validateUser(dto: AuthDto){
      const user = await this.prisma.user.findUnique({
        where: {
          phone: dto.phone
        }
      })

      if(!user) throw new NotFoundException('Пользователь не найден')
        
      return user
    }
}
