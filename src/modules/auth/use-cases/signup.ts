import { Inject } from "@nestjs/common";

import { CreateUserDto } from "../../users/dto/create-user";
import { CreateUserUseCase } from "../../users/use-cases/create-user";
import { CreateAccountUseCase } from "../../accounts/use-cases/create-account";
import { Account } from "../../accounts/entities/account";

export class SignUpUseCase {
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase;

    @Inject(CreateAccountUseCase)
    private readonly createAccountUseCase: CreateAccountUseCase;

    async execute(data: CreateUserDto) {
        const account = await this.createAccountUseCase.execute();
        const user = await this.createUserUseCase.execute({ ...data, account: new Account(account.id) });
        return user;
    }
}
