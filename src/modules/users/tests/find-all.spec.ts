import { Test, TestingModule } from '@nestjs/testing';

import { User, UserRole } from '../entities/user';
import { FindAllUsersUseCase } from '../use-cases/find-all';
import { IUserRepository } from '../interfaces/user.repository';
import { Account } from '../../accounts/entities/account';

const mockUserRepository = {
  findAll: jest.fn(),
};

describe('FindAllUsersUseCase', () => {
  let findAllUsersUseCase: FindAllUsersUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    findAllUsersUseCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
    userRepository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(findAllUsersUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an array of users', async () => {
      const account = new Account('123');
      const mockUsers: User[] = [
        new User({ name: 'John Doe', email: 'john.doe@example.com', role: UserRole.User, account }),
        new User({ name: 'Jane Doe', email: 'jane.doe@example.com', role: UserRole.User, account }),
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await findAllUsersUseCase.execute(account);

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith(account.id);
    });

    it('should throw an error if the userRepository fails', async () => {
      const account = new Account('123');
      mockUserRepository.findAll.mockRejectedValue(new Error('Error fetching users'));

      await expect(findAllUsersUseCase.execute(account)).rejects.toThrow('Error fetching users');
    });
  });
});
