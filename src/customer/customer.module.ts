import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GqlRoleGuard } from 'src/auth/role.guard';
import { CustomerResolver } from 'src/customer/customer.resolver';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CustomerService,
    PrismaService,
    CustomerResolver,
    {
      provide: APP_GUARD,
      useClass: GqlRoleGuard,
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
