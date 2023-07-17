import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
  ) {}

  async signIn(emailInput: string, passwordInput: string) {
    const customer = await this.customerService.findByEmail(emailInput);
    const { password, ...result } = customer;
    if (password !== passwordInput) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }

  async signUp(emailInput: string, passwordInput: string) {
    const customerExist = await this.customerService.findByEmail(emailInput);
    if (customerExist) {
      throw new ConflictException();
    }
    const customer: Partial<Customer> = await this.customerService.create({
      email: emailInput,
      password: passwordInput,
    });
    delete customer['password'];
    return {
      access_token: await this.jwtService.signAsync(customer),
    };
  }
}
