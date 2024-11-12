import { Inject, NotFoundException } from "@nestjs/common";

import { Account } from "../../accounts/entities/account";
import { IUserRepository } from "../interfaces/user.repository";

export class FindUserByIdUseCase {
    constructor(@Inject('IUserRepository') private readonly userRepo: IUserRepository) { }

    async execute(account: Account, id: string) {
        try {
            const user = await this.userRepo.findById(account.id, id);
            if (!user) throw new NotFoundException('User not found')
            return user;
        } catch (err) {
            throw err;
        }
    }
}
