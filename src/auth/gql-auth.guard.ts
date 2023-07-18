import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const headers = req.headers;
    const [type, token] = headers?.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }
    try {
      req['customer'] = await this.jwtService.verifyAsync(token, {
        secret: env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
