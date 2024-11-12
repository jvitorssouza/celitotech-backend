import { Inject, NotFoundException } from "@nestjs/common";

import { Account } from "../../accounts/entities/account";
import { IUserRepository } from "../interfaces/user.repository";

export class DeleteUserUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepo: IUserRepository) { }

  async execute(account: Account, id: string) {
    const user = await this.userRepo.findById(account.id, id);

    const userNotFound = !user;
    if (userNotFound) throw new NotFoundException('User not found');

    await this.userRepo.delete(id);
    return user;
  }
}
