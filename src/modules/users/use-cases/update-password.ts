import { Inject } from "@nestjs/common";
import { User } from "../entities/user";

import { Account } from "../../accounts/entities/account";
import { UpdatePasswordDto } from "../dto/update-password";
import { IUserRepository } from "../interfaces/user.repository";

export class UpdatePasswordUseCase {
  constructor(
    @Inject('IUserRepository') 
    private readonly userRepository: IUserRepository
  ) {}

  async execute(account: Account, id: string, data: UpdatePasswordDto): Promise<Partial<User>> {
    const user = await this.userRepository.findById(account.id, id);

    if (!user) throw new Error(`User with id ${id} not found`);

    user.password = data.password;

    await user.hashPassword();

    await this.userRepository.update(id, user);
    
    return user;
  }
}
