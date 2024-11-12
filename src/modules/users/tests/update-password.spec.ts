import { User } from "../entities/user";
import { UpdatePasswordDto } from "../dto/update-password";
import { UpdatePasswordUseCase } from "../use-cases/update-password";

jest.mock('../entities/user'); // Mock the User class

describe('UpdatePasswordUseCase', () => {
  let updatePasswordUseCase;
  let userRepositoryMock;
  let mockUser: Partial<User>;

  beforeEach(() => {
    // Create a mock user
    mockUser = {
      id: '123',
      email: 'user@example.com',
      password: 'oldPassword',
      hashPassword: jest.fn().mockResolvedValue(undefined),
    };

    // Mock the user repository
    userRepositoryMock = {
      findById: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
    };

    updatePasswordUseCase = new UpdatePasswordUseCase(userRepositoryMock as any);
  });

  it('should update the password of the user', async () => {
    const account = { id: 'account-id' }; // Mock account
    const updatePasswordDto: UpdatePasswordDto = {
      password: 'newPassword',
      passwordConfirm: 'newPassword', // Assuming password confirmation is valid
    };

    const updatedUser = await updatePasswordUseCase.execute(account, mockUser.id, updatePasswordDto);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(account.id, mockUser.id);
    expect(mockUser.password).toBe('newPassword');
    expect(mockUser.hashPassword).toHaveBeenCalled();
    expect(userRepositoryMock.update).toHaveBeenCalledWith(mockUser.id, mockUser);
    expect(updatedUser).toEqual(mockUser);
  });

  it('should throw an error if user is not found', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(null);
    const account = { id: 'account-id' }; // Mock account

    const updatePasswordDto: UpdatePasswordDto = {
      password: 'newPassword',
      passwordConfirm: 'newPassword',
    };

    await expect(updatePasswordUseCase.execute(account, 'non-existing-id', updatePasswordDto))
      .rejects
      .toThrowError('User with id non-existing-id not found');
  });
});
