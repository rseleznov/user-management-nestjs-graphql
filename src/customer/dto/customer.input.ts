import {
  Field,
  InputType,
  Int,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Role } from '.prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@InputType()
export class WhereCustomerInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@InputType()
export class GetCustomerInput {
  @Field(() => String, { nullable: true })
  cursor?: Prisma.CustomerWhereUniqueInput;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => WhereCustomerInput, { nullable: true })
  where?: WhereCustomerInput;
}

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  activationCode?: string;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {}
