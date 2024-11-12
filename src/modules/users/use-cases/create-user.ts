import { ConflictException, Inject } from '@nestjs/common';
import { User } from '../entities/user';
import { CreateUserDto } from '../dto/create-user';
import { IUserRepository } from '../interfaces/user.repository';

export class CreateUserUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepo: IUserRepository) {}

  async execute(data: CreateUserDto) {
    // Check if the email is already in use
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new User(data);
    
    await this.userRepo.create(user);

    return user;
  }
}
