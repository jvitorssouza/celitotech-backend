import { Test, TestingModule } from '@nestjs/testing';

import { Account } from '../entities/account';
import { CreateAccountDto } from '../dto/create-account';
import { CreateAccountUseCase } from '../use-cases/create-account';

describe('CreateAccountUseCase', () => {
    let createAccountUseCase;
    let mockAccountsRepository;

    beforeEach(async () => {
        mockAccountsRepository = {
            create: jest.fn(), // Mock the create method
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateAccountUseCase,
                { provide: 'IAccountRepository', useValue: mockAccountsRepository },
            ],
        }).compile();

        createAccountUseCase = module.get<CreateAccountUseCase>(CreateAccountUseCase);
    });

    it('should be defined', () => {
        expect(createAccountUseCase).toBeDefined();
    });

    it('should create an account successfully', async () => {
        const accountId = 'test-account-id';
        
        const mockAccount = new Account(accountId);
        const result = await createAccountUseCase.execute(accountId);

        expect(mockAccountsRepository.create).toHaveBeenCalledWith(mockAccount);
        expect(result).toBeInstanceOf(Account);
        expect(result.id).toEqual(accountId);
    });

    it('should throw an error if account creation fails', async () => {
        const createAccountDto: CreateAccountDto = { id: 'test-account-id' };

        mockAccountsRepository.create.mockImplementation(() => {
            throw new Error('Account creation failed');
        });

        await expect(createAccountUseCase.execute(createAccountDto)).rejects.toThrow('Account creation failed');
    });
});
