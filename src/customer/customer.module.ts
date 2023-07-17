import { Module } from '@nestjs/common';
import { CustomerResolver } from 'src/customer/customer.resolver';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}
