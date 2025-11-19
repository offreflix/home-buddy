import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { createMockUser } from 'src/common/test-helpers/mock-factories';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockService = {
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signupUser', () => {
    it('deve criar usuário com sucesso', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
      };

      const mockUser = createMockUser(userData);

      jest.spyOn(service, 'createUser').mockResolvedValue(mockUser);

      const result = await controller.signupUser(userData);

      expect(result).toEqual(mockUser);
      expect(service.createUser).toHaveBeenCalledWith(userData);
    });
  });
});
