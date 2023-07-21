import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import * as crypto from 'crypto';
import { Customer } from 'src/lib/entities/customer.entity';
import { RefreshToken } from 'src/lib/entities/refreshToken.entity';
import { RefreshTokenInput } from 'src/auth/dto/refreshToken.input';
import { CustomerService } from 'src/customer/customer.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(emailInput: string, passwordInput: string) {
    const customer = await this.customerService.findByEmail(emailInput);
    if (!customer) {
      throw new NotFoundException();
    }
    if (customer.activationCode) {
      throw new BadRequestException('The customer does not activated.', {
        cause: new Error(),
        description: 'The customer does not activated.',
      });
    }
    if (customer.password !== passwordInput) {
      throw new UnauthorizedException();
    }
    delete customer['password'];
    delete customer['activationCode'];
    return {
      accessToken: await this.createAccessToken(customer),
      refreshToken: await this.createRefreshToken(customer.id),
    };
  }

  async signUp(emailInput: string, passwordInput: string) {
    const customerExist = await this.customerService.findByEmail(emailInput);
    if (customerExist) {
      throw new ConflictException();
    }
    const activationCode = this.generateActivationCode();
    const customer = await this.customerService.create({
      email: emailInput,
      password: passwordInput,
      activationCode,
    });
    return { id: customer.id, code: activationCode };
  }

  async activate(customerIdInput: string, activationCodeInput: string) {
    const customerExist = await this.customerService.findById(customerIdInput);
    if (!customerExist) {
      throw new NotFoundException();
    }
    if (!customerExist.activationCode) {
      throw new BadRequestException('The customer is already activated.', {
        cause: new Error(),
        description: 'The customer is already activated.',
      });
    }
    if (customerExist.activationCode !== activationCodeInput) {
      throw new BadRequestException('Wrong activation code.', {
        cause: new Error(),
        description: 'Wrong activation code.',
      });
    } else {
      await this.customerService.updateById(customerIdInput, {
        activationCode: null,
      });
    }
  }

  async createAccessToken(customer: Partial<Customer>) {
    return await this.jwtService.signAsync(customer);
  }

  async createRefreshToken(customerId: string) {
    await this.prismaService.refreshToken.deleteMany({
      where: { customerId },
    });
    const currentDate = new Date();
    const expiresAt = new Date(currentDate);
    expiresAt.setDate(currentDate.getDate() + Number(env.REFRESH_TOKEN_TIME));
    const refreshToken = await this.prismaService.refreshToken.create({
      data: { customer: { connect: { id: customerId } }, expiresAt },
    });
    return await this.jwtService.signAsync(refreshToken);
  }

  async decodeRefreshToken(refreshToken: string) {
    const decodedToken: RefreshToken = this.jwtService.verify(refreshToken, {
      secret: env.JWT_SECRET,
    });
    const refreshTokenExist = await this.prismaService.refreshToken.findUnique({
      where: { id: decodedToken.id },
    });
    if (!refreshTokenExist || refreshTokenExist.expiresAt <= new Date()) {
      throw new UnauthorizedException();
    }
    return decodedToken;
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const decodedToken: RefreshToken = await this.decodeRefreshToken(
      refreshTokenInput.refreshToken,
    );
    const customerExist: Customer = await this.customerService.findById(
      decodedToken.customerId,
    );
    if (!customerExist) {
      throw new NotFoundException();
    }
    delete customerExist['password'];

    return {
      accessToken: await this.createAccessToken(customerExist),
      refreshToken: await this.createRefreshToken(customerExist.id),
    };
  }

  generateActivationCode() {
    return crypto.randomBytes(8).toString('hex');
  }
}
