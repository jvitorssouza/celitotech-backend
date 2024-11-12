import { User } from "../entities/user";

export interface IUserRepository {
    create(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    update(id:string, user: Partial<User>): Promise<void>;
    
    findByEmail(email: string): Promise<User>;
    findAll(accountId: string): Promise<User[]>;
    findById(accountId: string, id: string): Promise<User>;
}