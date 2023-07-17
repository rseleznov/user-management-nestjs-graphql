import { BadRequestException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { isUUID } from 'class-validator';
import { Customer } from 'src/lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  CreateCustomerInput,
  GetCustomerInput,
  UpdateCustomerInput,
} from './dto/customer.input';

const badRequestIdOrEmailArgument =
  'You must provide either the "id" or "email" argument.';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Query(() => Customer)
  async getCustomer(
    @Args({ name: 'id', type: () => ID, nullable: true }) id?: string,
    @Args({ name: 'email', nullable: true }) email?: string,
  ) {
    if (isUUID(id)) {
      return this.customerService.findById(id);
    } else if (email) {
      return this.customerService.findByEmail(email);
    } else {
      throw new BadRequestException(badRequestIdOrEmailArgument);
    }
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
    return this.customerService.create(createCustomerInput);
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
    @Args({ name: 'id', type: () => ID, nullable: true }) id?: string,
    @Args({ name: 'email', nullable: true }) email?: string,
  ) {
    if (isUUID(id)) {
      return this.customerService.updateById(id, updateCustomerInput);
    } else if (email) {
      return this.customerService.updateByEmail(email, updateCustomerInput);
    } else {
      throw new BadRequestException(badRequestIdOrEmailArgument);
    }
  }

  @Mutation(() => Customer)
  async deleteCustomer(
    @Args({ name: 'id', type: () => ID, nullable: true }) id?: string,
    @Args({ name: 'email', nullable: true }) email?: string,
  ) {
    if (isUUID(id)) {
      return this.customerService.deleteById(id);
    } else if (email) {
      return this.customerService.deleteByEmail(email);
    } else {
      throw new BadRequestException(badRequestIdOrEmailArgument);
    }
  }
}
