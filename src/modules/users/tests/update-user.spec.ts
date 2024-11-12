import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException } from '@nestjs/common';

import { User, UserRole } from '../entities/user';
import { UpdateUserDto } from '../dto/update-user';
import { Account } from '../../accounts/entities/account';
import { UpdateUserUseCase } from '../use-cases/update-user';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase;
  let userRepositoryMock;

  beforeEach(async () => {
    // Mock the repository
    userRepositoryMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    // Create the testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should be defined', () => {
    expect(updateUserUseCase).toBeDefined();
  });

  describe('execute', () => {
    const account: Account = { id: 'account-id' } as Account;
    const currentUser: User = { id: 'current-user-id', role: UserRole.Admin } as User;
    const targetUserId = 'target-user-id';
    const updateData: UpdateUserDto = { email: 'new-email@example.com' };

    it('should throw an error if the user does not exist', async () => {
      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(
        updateUserUseCase.execute(account, targetUserId, currentUser, updateData),
      ).rejects.toThrowError('No user found with ID target-user-id');
    });

    it('should throw a ForbiddenException if the current user is not authorized to update another user', async () => {
      userRepositoryMock.findById.mockResolvedValue({ id: targetUserId });

      const regularUser: User = { id: 'regular-user-id', role: UserRole.User } as User;

      await expect(
        updateUserUseCase.execute(account, targetUserId, regularUser, updateData),
      ).rejects.toThrowError(new ForbiddenException("You are not authorized to update another user's profile."));
    });

    it('should throw a ConflictException if the email is already in use by another user', async () => {
      userRepositoryMock.findById.mockResolvedValue({ id: targetUserId });
      userRepositoryMock.findByEmail.mockResolvedValue({ id: 'another-user-id' });

      await expect(
        updateUserUseCase.execute(account, targetUserId, currentUser, updateData),
      ).rejects.toThrowError(new ConflictException('This email address is already associated with another user.'));
    });

    it('should update the user data successfully', async () => {
      const existingUser: User = { id: targetUserId, email: 'old-email@example.com' } as User;
      userRepositoryMock.findById.mockResolvedValue(existingUser);
      userRepositoryMock.findByEmail.mockResolvedValue(null); // Email is not in use
      userRepositoryMock.update.mockResolvedValue({ ...existingUser, ...updateData });

      const result = await updateUserUseCase.execute(account, targetUserId, currentUser, updateData);

      expect(result).toEqual({ ...existingUser, ...updateData });
      expect(userRepositoryMock.update).toHaveBeenCalledWith(targetUserId, { ...existingUser, ...updateData });
    });

    it('should throw a ForbiddenException if the current user is not authorized to update another user', async () => {
        userRepositoryMock.findById.mockResolvedValue({ id: targetUserId });
  
        const regularUser: User = { id: 'regular-user-id', role: UserRole.User } as User;
  
        await expect(
          updateUserUseCase.execute(account, targetUserId, regularUser, updateData),
        ).rejects.toThrowError(new ForbiddenException("You are not authorized to update another user's profile."));
      });
  
      it('should throw a ConflictException if the email is already in use by another user', async () => {
        userRepositoryMock.findById.mockResolvedValue({ id: targetUserId });
        userRepositoryMock.findByEmail.mockResolvedValue({ id: 'another-user-id' });
  
        await expect(
          updateUserUseCase.execute(account, targetUserId, currentUser, updateData),
        ).rejects.toThrowError(new ConflictException('This email address is already associated with another user.'));
      });
  
      it('should update the user data successfully', async () => {
        const existingUser: User = { id: targetUserId, email: 'old-email@example.com' } as User;
        userRepositoryMock.findById.mockResolvedValue(existingUser);
        userRepositoryMock.findByEmail.mockResolvedValue(null); // Email is not in use
        userRepositoryMock.update.mockResolvedValue({ ...existingUser, ...updateData });
  
        const result = await updateUserUseCase.execute(account, targetUserId, currentUser, updateData);
  
        expect(result).toEqual({ ...existingUser, ...updateData });
        expect(userRepositoryMock.update).toHaveBeenCalledWith(targetUserId, { ...existingUser, ...updateData });
      });
  });
});
