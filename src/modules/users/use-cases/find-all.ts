import { Inject } from "@nestjs/common";
import { Account } from "../../accounts/entities/account";
import { IUserRepository } from "../interfaces/user.repository";

export class FindAllUsersUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepo: IUserRepository) { }

  execute(account: Account) {
    return this.userRepo.findAll(account.id);
  }
}
