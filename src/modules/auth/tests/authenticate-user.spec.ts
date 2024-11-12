import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthenticateUserDto } from '../dto/authenticate-user';
import { IAuthenticationResponse } from '../interfaces/authentication';
import { AuthenticateUserUseCase } from '../use-cases/authenticate-user';

describe('AuthenticateUserUseCase', () => {
    let mockJwtService;
    let mockUserRepository;
    let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserUseCase,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IJwtService', useValue: mockJwtService },
      ],
    }).compile();

    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(AuthenticateUserUseCase);
  });

  it('should be defined', () => {
    expect(authenticateUserUseCase).toBeDefined();
  });

  it('should return an access token if email and password are correct', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'Test User',
      role: 'user',
      validatePassword: jest.fn().mockResolvedValue(true), // Mock validatePassword method to return true
    };

    const authenticateUserDto: AuthenticateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockJwtService.sign.mockResolvedValue('mock-access-token');

    const result: IAuthenticationResponse = await authenticateUserUseCase.execute(authenticateUserDto);

    expect(result.accessToken).toEqual('mock-access-token');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      username: mockUser.name,
      role: mockUser.role,
    });
  });

  it('should throw an UnauthorizedException if user is not found', async () => {
    const authenticateUserDto: AuthenticateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null); // Simulate user not found

    await expect(authenticateUserUseCase.execute(authenticateUserDto)).rejects.toThrowError(
      new UnauthorizedException('Email or password incorrect'),
    );
  });

  it('should throw an UnauthorizedException if password does not match', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'Test User',
      role: 'user',
      validatePassword: jest.fn().mockResolvedValue(false), // Mock validatePassword to return false
    };

    const authenticateUserDto: AuthenticateUserDto = {
      email: 'test@example.com',
      password: 'incorrect-password',
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser); // Mock the findByEmail method to return the mock user

    await expect(authenticateUserUseCase.execute(authenticateUserDto)).rejects.toThrowError(
      new UnauthorizedException('Email or password incorrect'),
    );
  });
});
