import { of, throwError } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { SignUpUseCase } from '../use-cases/signup';
import { AuthenticateUserUseCase } from '../use-cases/authenticate-user';
import { UserRole } from '../../users/entities/user';
import { Account } from '../../accounts/entities/account';

describe('AuthController', () => {
    let controller;
    let signupUserUseCase;
    let authenticateUserUseCase;

    beforeEach(async () => {
        const mockAuthenticateUserUseCase = {
            execute: jest.fn().mockReturnValue(of(true)),
        };
        const mockSignupUserUseCase = {
            execute: jest.fn().mockReturnValue({ success: true }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthenticateUserUseCase,
                    useValue: mockAuthenticateUserUseCase,
                },
                {
                    provide: SignUpUseCase,
                    useValue: mockSignupUserUseCase,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        signupUserUseCase = module.get<SignUpUseCase>(SignUpUseCase);
        authenticateUserUseCase = module.get<AuthenticateUserUseCase>(AuthenticateUserUseCase);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // Authentication Tests
    describe('authentication', () => {
        it('should call authenticateUserUseCase.execute with correct parameters', async () => {
            const payload = { email: 'joao@email.com', password: 'password' };
            await controller.authentication(payload);
            expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(payload);
        });

        it('should handle errors during authentication', async () => {
            const payload = { email: 'joao@email.com', password: 'wrong-password' };
            const errorMessage = 'Invalid credentials';

            authenticateUserUseCase.execute = jest.fn().mockReturnValue(throwError(() => new Error(errorMessage)));

            try {
                await controller.authentication(payload);
            } catch (error) {
                expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(payload);
                expect(error.message).toBe(errorMessage);
            }
        });
    });

    // Signup Tests
    describe('signup', () => {
        const payload = { email: 'joao@email.com', password: 'password', name: 'João', role: UserRole.Admin, account: new Account() };

        it('should call signupUserUseCase.execute with correct parameters', async () => {
            await controller.signUp(payload);
            expect(signupUserUseCase.execute).toHaveBeenCalledWith(payload);
        });

        it('should return success when signup is successful', async () => {
            const response = await controller.signUp(payload);
            expect(response).toEqual({ success: true });
            expect(signupUserUseCase.execute).toHaveBeenCalledWith(payload);
        });

        it('should handle errors during signup', async () => {
            const errorMessage = 'User already exists';

            signupUserUseCase.execute = jest.fn().mockReturnValue(throwError(() => new Error(errorMessage)));

            try {
                await controller.signUp(payload);
            } catch (error) {
                expect(signupUserUseCase.execute).toHaveBeenCalledWith(payload);
                expect(error.message).toBe(errorMessage);
            }
        });
    });
});
