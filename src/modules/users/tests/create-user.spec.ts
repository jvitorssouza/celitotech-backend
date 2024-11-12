import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../use-cases/create-user';
import { IUserRepository } from '../interfaces/user.repository';
import { CreateUserDto } from '../dto/create-user';
import { UserRole } from '../entities/user';
import { User } from '../entities/user';
import { Account } from '../../accounts/entities/account';

jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn().mockReturnValue('mock-uuid-jest-test-env'), // Mock randomUUID
}));

describe('CreateUserUseCase', () => {
    let userRepositoryMock;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(async () => {
        userRepositoryMock = {
            create: jest.fn(),
            findByEmail: jest.fn(), // Mock the findByEmail method
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                CreateUserUseCase,
                {
                    provide: 'IUserRepository',
                    useValue: userRepositoryMock,
                },
            ],
        }).compile();

        createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    });

    it('should be defined', () => {
        expect(createUserUseCase).toBeDefined();
    });

    it('should create a user successfully', async () => {
        const createUserDto: CreateUserDto = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            role: UserRole.User,
            account: new Account(),
        };

        const user = new User(createUserDto);

        userRepositoryMock.findByEmail.mockResolvedValue(null); // No user found with this email
        userRepositoryMock.create.mockResolvedValue();

        const result = await createUserUseCase.execute(createUserDto);

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(createUserDto.email);
        expect(userRepositoryMock.create).toHaveBeenCalledWith(user);
        expect(result).toEqual({ ...user, id: 'mock-uuid-jest-test-env' });
    });

    it('should throw an error if email is already in use', async () => {
        const createUserDto: CreateUserDto = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            role: UserRole.User,
            account: new Account(),
        };

        // Simulate an existing user with the same email
        userRepositoryMock.findByEmail.mockResolvedValue(new User(createUserDto));

        await expect(createUserUseCase.execute(createUserDto)).rejects.toThrowError('Email already exists');
    });

    it('should throw an error if user creation fails', async () => {
        const createUserDto: CreateUserDto = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            role: UserRole.User,
            account: new Account(),
        };

        const errorMessage = 'Error creating user';
        userRepositoryMock.findByEmail.mockResolvedValue(null); // No user found with this email
        userRepositoryMock.create.mockRejectedValue(new Error(errorMessage));

        await expect(createUserUseCase.execute(createUserDto)).rejects.toThrowError(errorMessage);
    });
});
