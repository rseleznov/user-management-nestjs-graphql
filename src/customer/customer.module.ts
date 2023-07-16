import { Module } from '@nestjs/common';
import { CustomerResolver } from 'src/customer/customer.resolver';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver],
})
export class CustomerModule {}
