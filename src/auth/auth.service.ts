import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import {
  createAccessToken,
  createRefreshToken,
  decodeRefreshToken,
} from 'src/auth/auth.utils';
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
      accessToken: await createAccessToken(customer, this.jwtService),
      refreshToken: await createRefreshToken(
        customer.id,
        this.jwtService,
        this.prismaService,
      ),
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

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const decodedToken: RefreshToken = await decodeRefreshToken(
      refreshTokenInput.refreshToken,
      this.jwtService,
      this.prismaService,
    );
    const customerExist: Customer = await this.customerService.findById(
      decodedToken.customerId,
    );
    if (!customerExist) {
      throw new NotFoundException();
    }
    delete customerExist['password'];

    return {
      accessToken: await createAccessToken(customerExist, this.jwtService),
      refreshToken: await createRefreshToken(
        customerExist.id,
        this.jwtService,
        this.prismaService,
      ),
    };
  }

  generateActivationCode() {
    return crypto.randomBytes(8).toString('hex');
  }
}
