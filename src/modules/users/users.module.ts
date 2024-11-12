import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user';
import { UsersController } from './users.controller';
import { UserTypeOrmRepository } from './users.repository';

import { FindAllUsersUseCase } from './use-cases/find-all';
import { FindUserByIdUseCase } from './use-cases/find-by-id';

import { CreateUserUseCase } from './use-cases/create-user';
import { UpdateUserUseCase } from './use-cases/update-user';
import { DeleteUserUseCase } from './use-cases/delete-user';
import { UpdatePasswordUseCase } from './use-cases/update-password';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [
        CreateUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        FindAllUsersUseCase,
        FindUserByIdUseCase,
        UpdatePasswordUseCase,
        UserTypeOrmRepository,
        {
            provide: 'IUserRepository',
            useExisting: UserTypeOrmRepository,
        },
    ],
    exports: [
        CreateUserUseCase,
        {
            provide: 'IUserRepository',
            useExisting: UserTypeOrmRepository,
        },
    ]
})
export class UsersModule { }
