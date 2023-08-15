import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service'
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async byId(id: number, selecObject: Prisma.UserSelect = {}){
        const user = await this.prisma.user.findUnique({where: {
              id
          },
          select: {
              id: true,
              phone: true,
              name: true,
              ...selecObject
          }
        })

        if(!user){
            throw new Error('User not found')
        }

        return {
          user
        }
    }
    
    async updateProfile(id: number, dto: UserDto){
        const isSameUser = await this.prisma.user.findUnique({
          where: {phone: dto.phone}
        })

        if (isSameUser && id === isSameUser.id) {
            throw new BadRequestException('Phone already in use')
        }

        return this.prisma.user.update({
          where: {id},
          data: {
            name: dto.name,
            phone: dto.phone,
          }
        })
    }
}
