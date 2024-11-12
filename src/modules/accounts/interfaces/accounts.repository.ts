import { Account } from "../entities/account";

export interface IAccountsRepository {
    create(account: Account): Promise<void>;
    update(account: Account): Promise<void>;
    findAll(): Promise<Account[]>;
    findById(id: string): Promise<Account>;
}
