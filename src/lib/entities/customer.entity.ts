import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/lib/entities/base.entity';
import { Role } from '.prisma/client';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  activationCode?: string;

  @Field(() => [Role])
  roles?: Role[];
}
