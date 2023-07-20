import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/lib/entities/base.entity';

@ObjectType()
export class RefreshToken extends Base {
  @Field(() => String)
  customerId: string;

  @Field(() => Date)
  expiresAt: Date;
}
