import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './entities/account';
import { CreateAccountUseCase } from './use-cases/create-account';
import { AccountsTypeOrmRepository } from './accounts.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Account])],
    providers: [
        CreateAccountUseCase,
        AccountsTypeOrmRepository,
        {
            provide: 'IAccountRepository',
            useExisting: AccountsTypeOrmRepository,
        },
    ],
    exports: [ CreateAccountUseCase ],
})
export class AccountsModule { }
