import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { User, UserRole } from './entities/user';
import { CreateUserDto } from './dto/create-user';
import { UpdateUserDto } from './dto/update-user';

import { FindAllUsersUseCase } from './use-cases/find-all';
import { FindUserByIdUseCase } from './use-cases/find-by-id';

import { CreateUserUseCase } from './use-cases/create-user';
import { UpdateUserUseCase } from './use-cases/update-user';
import { DeleteUserUseCase } from './use-cases/delete-user';
import { UpdatePasswordUseCase } from './use-cases/update-password';
import { UpdatePasswordDto } from './dto/update-password';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Account } from '../accounts/entities/account';

interface ReqUser { user: User }

@Controller('users')
export class UsersController {
    // Injections
    @Inject(FindAllUsersUseCase)
    private readonly findAllUsersUseCase: FindAllUsersUseCase;

    @Inject(FindUserByIdUseCase)
    private readonly findUserByIdUseCase: FindUserByIdUseCase;

    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase;

    @Inject(UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase;

    @Inject(UpdatePasswordUseCase)
    private readonly updatePasswordUseCase: UpdatePasswordUseCase;

    @Inject(DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase;

    // Methods
    @Get()
    @Roles([UserRole.Admin])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findAll(@Request() { user }: ReqUser) {
        return await this.findAllUsersUseCase.execute(new Account(user.account.id));
    }

    @Get(':id')
    @Roles([UserRole.Admin])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findOne(@Request() { user }: ReqUser, @Param('id') id: string) {
        return await this.findUserByIdUseCase.execute(new Account(user.account.id), id);
    }

    @Post()
    @Roles([UserRole.Admin])
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Request() { user }: ReqUser, @Body() createUserDto: CreateUserDto) {
        return this.createUserUseCase.execute({ ...createUserDto, account: new Account(user.account.id) });
    }

    @Patch('update-password')
    @Roles([UserRole.Admin, UserRole.User])
    @UseGuards(JwtAuthGuard, RolesGuard)
    updatePassword(@Request() req: ReqUser, @Body() updateUserDto: UpdatePasswordDto) {
        return this.updatePasswordUseCase.execute(new Account(req.user.account.id), req.user.id, updateUserDto);
    }

    @Patch(':id')
    @Roles([UserRole.Admin, UserRole.User])
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Request() { user }: ReqUser, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.updateUserUseCase.execute(new Account(user.account.id), id, user, updateUserDto);
    }

    @Delete(':id')
    @Roles([UserRole.Admin])
    @UseGuards(JwtAuthGuard, RolesGuard)
    delete(@Request() { user }: ReqUser, @Param('id') id: string) {
        return this.deleteUserUseCase.execute(new Account(user.account.id), id);
    }
}
