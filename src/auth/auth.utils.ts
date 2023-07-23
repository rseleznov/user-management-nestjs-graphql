import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Customer } from 'lib/entities/customer.entity';
import { RefreshToken } from 'lib/entities/refreshToken.entity';
import { PrismaService } from 'src/prisma.service';

export const decodeRefreshToken = async (
  refreshToken: string,
  jwtService: JwtService,
  prismaService: PrismaService,
) => {
  const decodedToken: RefreshToken = jwtService.verify(refreshToken, {
    secret: env.JWT_SECRET,
  });
  const refreshTokenExist = await prismaService.refreshToken.findUnique({
    where: { id: decodedToken.id },
  });
  if (!refreshTokenExist || refreshTokenExist.expiresAt <= new Date()) {
    throw new UnauthorizedException();
  }
  return decodedToken;
};

export const createAccessToken = async (
  customer: Partial<Customer>,
  jwtService: JwtService,
) => {
  return await jwtService.signAsync(customer);
};

export const createRefreshToken = async (
  customerId: string,
  jwtService: JwtService,
  prismaService: PrismaService,
) => {
  await prismaService.refreshToken.deleteMany({ where: { customerId } });
  const currentDate = new Date();
  const expiresAt = new Date(currentDate);
  expiresAt.setDate(currentDate.getDate() + Number(env.REFRESH_TOKEN_TIME));
  const refreshToken = await prismaService.refreshToken.create({
    data: { customer: { connect: { id: customerId } }, expiresAt },
  });
  return await jwtService.signAsync(refreshToken);
};
