import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  GetCustomerInput,
  CreateCustomerInput,
  UpdateCustomerInput,
} from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async create(data: CreateCustomerInput) {
    return this.prisma.customer.create({
      data,
    });
  }

  async updateById(id: string, data: UpdateCustomerInput) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async updateByEmail(email: string, data: UpdateCustomerInput) {
    return this.prisma.customer.update({
      where: { email },
      data,
    });
  }

  async deleteById(id: string) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async deleteByEmail(email: string) {
    return this.prisma.customer.delete({
      where: { email },
    });
  }
}
