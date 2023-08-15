import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {

  constructor(private prisma: PrismaService){}

  async findAll() {
      const categories = await this.prisma.category.findMany()
  }

}
