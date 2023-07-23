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
      const mockRefreshToken = 'mock-refresh-token';
      const email = 'user@example.com';
      const password = 'password123';
      jest.spyOn(service, 'signIn').mockResolvedValue({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });

      const response = await controller.signIn({ email, password });

      expect(response).toBeDefined();
      expect(response.accessToken).toBe(mockAccessToken);
    });
  });

  describe('signUn', () => {
    it('should sign up a customer and return the access token', async () => {
      const mockActivationCode = {
        id: 'dfeaa66d-4bff-47b5-b766-229aa65a2607',
        code: '962da2659d6694e8',
      };
      const email = 'user@example.com';
      const password = 'password123';
      jest.spyOn(service, 'signUp').mockResolvedValue(mockActivationCode);

      const response = await controller.signUp({ email, password });

      expect(response).toBeDefined();
      expect(response).toBe(mockActivationCode);
    });
  });
});
