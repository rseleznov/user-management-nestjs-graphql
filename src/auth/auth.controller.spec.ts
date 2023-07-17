import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { CustomerService } from 'src/customer/customer.service';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import restoreAllMocks = jest.restoreAllMocks;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        AuthService,
        JwtService,
        CustomerService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a customer and return the access token', async () => {
      const mockAccessToken = 'mock-access-token';
      const email = 'user@example.com';
      const password = 'password123';
      jest
        .spyOn(service, 'signIn')
        .mockResolvedValue({ access_token: mockAccessToken });

      const response = await controller.signIn({ email, password });

      expect(response).toBeDefined();
      expect(response.access_token).toBe(mockAccessToken);
    });
  });

  describe('signUn', () => {
    it('should sign up a customer and return the access token', async () => {
      const mockAccessToken = 'mock-access-token';
      const email = 'user@example.com';
      const password = 'password123';
      jest
        .spyOn(service, 'signUp')
        .mockResolvedValue({ access_token: mockAccessToken });

      const response = await controller.signUp({ email, password });

      expect(response).toBeDefined();
      expect(response.access_token).toBe(mockAccessToken);
    });
  });
});
