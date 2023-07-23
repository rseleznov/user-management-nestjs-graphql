import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Role } from '.prisma/client';

@Injectable()
export class GqlRoleGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (!req.body.query.trim().startsWith('mutation')) {
      return true;
    }
    const headers = req.headers;
    const [type, token] = headers?.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authentication token not found');
    }
    const customer = this.jwtService.verify(token, {
      secret: env.JWT_SECRET,
    });
    if (!customer || !customer.roles.includes(Role.ADMIN)) {
      throw new UnauthorizedException(
        'Not authorized to perform this operation.',
      );
    }
    return true;
  }
}
