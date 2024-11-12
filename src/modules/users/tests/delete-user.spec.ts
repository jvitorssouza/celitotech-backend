import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from '../use-cases/delete-user';

describe('DeleteUserUseCase', () => {
  let useCase;
  let userRepoMock;

  beforeEach(async () => {
    userRepoMock = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: userRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete the user when user exists', async () => {
      const userId = '123';
      const account = { id: 'account1' };
      const user = { id: userId, name: 'João' };

      userRepoMock.findById = jest.fn().mockResolvedValue(user);
      userRepoMock.delete = jest.fn().mockResolvedValue(undefined);

      const result = await useCase.execute(account, userId);

      expect(userRepoMock.findById).toHaveBeenCalledWith(account.id, userId);
      expect(userRepoMock.delete).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      const userId = '123';
      const account = { id: 'account1' };
      const errorMessage = 'User not found';

      userRepoMock.findById = jest.fn().mockResolvedValue(null);

      await expect(useCase.execute(account, userId)).rejects.toThrowError(errorMessage);
    });
  });
});
