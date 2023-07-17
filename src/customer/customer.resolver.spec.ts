import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResolver } from 'src/customer/customer.resolver';
import { CustomerService } from 'src/customer/customer.service';
import { PrismaService } from 'src/prisma.service';
import restoreAllMocks = jest.restoreAllMocks;

describe('CustomerService', () => {
  let service: CustomerService;
  let resolver: CustomerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerResolver, CustomerService, PrismaService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    resolver = module.get<CustomerResolver>(CustomerResolver);
  });

  afterEach(async () => {
    restoreAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('customers', () => {
    it('should return an array of customers', async () => {
      const expectedResult = [
        {
          id: '9e391faf-64b2-4d4c-b879-463532920fd3',
          email: 'user@gmail.com',
          password: 'random-password',
          createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
          updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        },
        {
          id: '9e391faf-64b2-4d4c-b879-463532920fd4',
          email: 'user2@gmail.com',
          password: 'random-password',
          createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
          updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await resolver.customers({});
      expect(result).toEqual(expectedResult);
    });
  });

  describe('customerById', () => {
    it('should return a customer by ID', async () => {
      const id = '9e391faf-64b2-4d4c-b879-463532920fd3';
      const expectedResult = {
        id,
        email: 'user@gmail.com',
        password: 'random-password',
        createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);

      const result = await resolver.getCustomer(id, undefined);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('customerByEmail', () => {
    it('should return a customer by Email', async () => {
      const email = 'user@gmail.com';
      const expectedResult = {
        id: '9e391faf-64b2-4d4c-b879-463532920fd3',
        email,
        password: 'random-password',
        createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(expectedResult);

      const result = await resolver.getCustomer(undefined, email);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should return a customer by Email', async () => {
      const newCustomer = {
        id: '9e391faf-64b2-4d4c-b879-463532920fd3',
        email: 'user@gmail.com',
        password: 'random-password',
        createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
      };
      const expectedResult = {
        id: '9e391faf-64b2-4d4c-b879-463532920fd3',
        email: 'user@gmail.com',
        password: 'random-password',
        createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await resolver.createCustomer(newCustomer);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateById', () => {
    it('should return a customer by Email', async () => {
      const id = '9e391faf-64b2-4d4c-b879-463532920fd3';
      const newCustomer = {
        id,
        email: 'new-user@gmail.com',
        password: 'new-password',
        createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
      };
      const expectedResult = {
        id,
        email: 'new-user@gmail.com',
        password: 'random-password',
        createdAt: new Date('Jul 13, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 13, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'updateById').mockResolvedValue(expectedResult);

      const result = await resolver.updateCustomer(newCustomer, id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateByEmail', () => {
    it('should return a customer by Email', async () => {
      const email = 'user@gmail.com';
      const newCustomer = {
        id: '9e391faf-64b2-4d4c-b879-463532920fd3',
        email,
        password: 'new-password',
        createdAt: new Date('Jul 14, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 14, 2023, 6:20:44 PM'),
      };
      const expectedResult = {
        id: '9e391faf-64b2-4d4c-b879-463532920fd3',
        email,
        password: 'random-password',
        createdAt: new Date('Jul 14, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 14, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'updateByEmail').mockResolvedValue(expectedResult);

      const result = await resolver.updateCustomer(
        newCustomer,
        undefined,
        email,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteById', () => {
    it('should return a customer by Email', async () => {
      const id = '9e391faf-64b2-4d4c-b879-463532920fd0';
      const expectedResult = {
        id,
        email: 'new-user@gmail.com',
        password: 'random-password',
        createdAt: new Date('Jul 14, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 14, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'deleteById').mockResolvedValue(expectedResult);

      const result = await resolver.deleteCustomer(id, undefined);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteByEmail', () => {
    it('should return a customer by Email', async () => {
      const email = 'new-user@gmail.com';
      const expectedResult = {
        id: '9e391faf-64b2-4d4c-b879-463532920fd0',
        email,
        password: 'random-password',
        createdAt: new Date('Jul 14, 2023, 6:20:44 PM'),
        updatedAt: new Date('Jul 14, 2023, 6:20:44 PM'),
      };
      jest.spyOn(service, 'deleteByEmail').mockResolvedValue(expectedResult);

      const result = await resolver.deleteCustomer(undefined, email);
      expect(result).toEqual(expectedResult);
    });
  });
});
