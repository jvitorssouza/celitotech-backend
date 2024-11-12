import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { CreateUserDto } from '../dto/create-user';
import { UpdateUserDto } from '../dto/update-user';
import { UpdatePasswordDto } from '../dto/update-password';
import { UserRole } from '../entities/user';
import { Account } from '../../accounts/entities/account';
import { CreateUserUseCase } from '../use-cases/create-user';
import { UpdateUserUseCase } from '../use-cases/update-user';
import { DeleteUserUseCase } from '../use-cases/delete-user';
import { FindAllUsersUseCase } from '../use-cases/find-all';
import { FindUserByIdUseCase } from '../use-cases/find-by-id';
import { UpdatePasswordUseCase } from '../use-cases/update-password';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: CreateUserUseCase;
  let updateUserUseCase: UpdateUserUseCase;
  let deleteUserUseCase: DeleteUserUseCase;
  let findAllUsersUseCase: FindAllUsersUseCase;
  let findUserByIdUseCase: FindUserByIdUseCase;
  let updatePasswordUseCase: UpdatePasswordUseCase;

  const mockUser = {
    id: '123',
    account: { id: 'account-id' },
    role: UserRole.Admin,
  };

  const mockRequest = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: FindAllUsersUseCase, useValue: { execute: jest.fn() } },
        { provide: FindUserByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: CreateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdatePasswordUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteUserUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    findAllUsersUseCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
    findUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
    updatePasswordUseCase = module.get<UpdatePasswordUseCase>(UpdatePasswordUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call execute method of CreateUserUseCase when creating a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Joao',
      email: 'joao@email.com',
      password: 'password',
      role: UserRole.User,
      account: new Account(),
    };

    await controller.create(mockRequest as any, createUserDto);

    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      ...createUserDto,
      account: new Account(mockUser.account.id),
    });
  });

  it('should call execute method of UpdateUserUseCase when updating a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Joao Updated',
      email: 'joao.updated@email.com',
    };

    await controller.update(mockRequest as any, '123', updateUserDto);

    expect(updateUserUseCase.execute).toHaveBeenCalledWith(
      new Account(mockUser.account.id),
      '123',
      mockUser,  // Passando o usuário corrente como 'currentUser'
      updateUserDto,
    );
  });

  it('should call execute method of DeleteUserUseCase when deleting a user', async () => {
    await controller.delete(mockRequest as any, '123');

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(
      new Account(mockUser.account.id),
      '123',
    );
  });

  it('should call execute method of UpdatePasswordUseCase when updating password', async () => {
    const updatePasswordDto: UpdatePasswordDto = {
      password: 'newPassword',
      passwordConfirm: 'newPassword',
    };

    await controller.updatePassword(mockRequest as any, updatePasswordDto);

    expect(updatePasswordUseCase.execute).toHaveBeenCalledWith(
      new Account(mockUser.account.id),
      '123',
      updatePasswordDto,
    );
  });

  it('should call execute method of FindAllUsersUseCase when finding all users', async () => {
    await controller.findAll(mockRequest as any);

    expect(findAllUsersUseCase.execute).toHaveBeenCalledWith(
      new Account(mockUser.account.id),
    );
  });

  it('should call execute method of FindUserByIdUseCase when finding a user by id', async () => {
    await controller.findOne(mockRequest as any, '123');

    expect(findUserByIdUseCase.execute).toHaveBeenCalledWith(
      new Account(mockUser.account.id),
      '123',
    );
  });
});
