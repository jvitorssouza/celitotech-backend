import { Repository } from "typeorm";
import { User } from "./entities/user";
import { IUserRepository } from "./interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(@InjectRepository(User) private typeOrmRepo: Repository<User>) {}

  async create(user: User): Promise<void> {
    await this.typeOrmRepo.save(user);
  }

  async update(id: string, user: User): Promise<void> {
    await this.typeOrmRepo.update(id, user);
  }

  findAll(accountId: string): Promise<User[]> {
    return this.typeOrmRepo.find({ select: ['id', 'name', 'email', 'role'], relations: ['account'], where: { account: { id: accountId } } });
  }

  findById(accountId: string, id: string): Promise<User> {
    return this.typeOrmRepo.findOne({ where: { id, account: { id: accountId } } });
  }

  findByEmail(email: string): Promise<User> {
    return this.typeOrmRepo.findOne({ relations: ['account'], where: { email } });
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepo.delete({ id });
  }
}