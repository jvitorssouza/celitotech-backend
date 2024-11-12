import { Test, TestingModule } from '@nestjs/testing';

import { User, UserRole } from '../entities/user';
import { IUserRepository } from '../interfaces/user.repository';
import { FindUserByIdUseCase } from '../use-cases/find-by-id';
import { Account } from '../../accounts/entities/account';

const mockUserRepository = {
  findById: jest.fn(),
};

describe('FindUserByIdUseCase', () => {
  let findUserByIdUseCase: FindUserByIdUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    findUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
    userRepository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(findUserByIdUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a user by id', async () => {
      const account = new Account('account-id');
      const mockUser = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: UserRole.User,
        account,
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await findUserByIdUseCase.execute(account, 'user-id');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(account.id, 'user-id');
    });

    it('should throw an error if user is not found', async () => {
      const account = new Account('account-id');

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(findUserByIdUseCase.execute(account, 'non-existent-id')).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error if repository fails', async () => {
      const account = new Account('account-id');

      mockUserRepository.findById.mockRejectedValue(new Error('Error fetching user'));

      await expect(findUserByIdUseCase.execute(account, 'user-id')).rejects.toThrow(
        'Error fetching user',
      );
    });
  });
});
