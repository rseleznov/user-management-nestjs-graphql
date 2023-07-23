import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { env } from 'process';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const [type, token] = authHeader.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authentication token not found');
    }
    try {
      req.body.decodedToken = this.jwtService.verify(token, {
        secret: env.JWT_SECRET,
      });
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
