import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Account } from "./entities/account";
import { IAccountsRepository } from "./interfaces/accounts.repository";

@Injectable()
export class AccountsTypeOrmRepository implements IAccountsRepository {
  constructor(@InjectRepository(Account) private typeOrmRepo: Repository<Account>) {}

  async create(account: Account): Promise<void> {
    await this.typeOrmRepo.save(account);
  }

  async update(account: Account): Promise<void> {
    await this.typeOrmRepo.update(account.id, account);
  }

  findAll(): Promise<Account[]> {
    return this.typeOrmRepo.find();
  }

  findById(id: string): Promise<Account> {
    return this.typeOrmRepo.findOne({ where: { id } });
  }
}