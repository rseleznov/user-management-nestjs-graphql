import { Module, UseGuards } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
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
      useClass: GqlAuthGuard,
    },
  ],
  exports: [CustomerService],
})
@UseGuards(GqlAuthGuard)
export class CustomerModule {}
