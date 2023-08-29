import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service'
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async byId(req, res, selecObject: Prisma.UserSelect = {}){

        try{
            const {acc,ref} = req.cookies

            if(!acc || !ref){
              await res.cookie('acc', '')
              await res.cookie('ref', '')
              throw new NotFoundException('Не найден')
            }

            const id = jwt.verify(req.cookies.acc,process.env.JWT_SECRET)['id']
            await jwt.verify(req.cookies.ref,process.env.JWT_SECRET)['id']

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
              user,
              acc,
              ref
            }
        }
        catch(err){
            await res.clearCookie('acc')
            await res.clearCookie('ref')
            throw new NotFoundException('Не найден')
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
