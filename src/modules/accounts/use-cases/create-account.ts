import { Inject } from "@nestjs/common";

import { Account } from "../entities/account";
import { IAccountsRepository } from "../interfaces/accounts.repository";

export class CreateAccountUseCase {
  constructor(@Inject('IAccountRepository') private readonly accountRepo: IAccountsRepository) { }

  async execute(id?: string) {
    const account = new Account(id);
    await this.accountRepo.create(account);
    return account;
  }
}
