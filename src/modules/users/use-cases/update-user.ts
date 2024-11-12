import { ConflictException, ForbiddenException, Inject } from "@nestjs/common";
import { User, UserRole } from "../entities/user";
import { UpdateUserDto } from "../dto/update-user";
import { IUserRepository } from "../interfaces/user.repository";
import { Account } from "../../accounts/entities/account";

export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') 
    private readonly userRepository: IUserRepository
  ) {}

  async execute(account: Account, targetUserId: string, currentUser: User, updateData: UpdateUserDto): Promise<Partial<User>> {
    // Check if the user exists
    const existingUser = await this.userRepository.findById(account.id, targetUserId);
    if (!existingUser) throw new Error(`No user found with ID ${targetUserId}`);

    const isDifferentUser = currentUser.id !== targetUserId;
    const isRegularUser = currentUser.role === UserRole.User;

    if (isDifferentUser && isRegularUser) {
      throw new ForbiddenException('You are not authorized to update another user\'s profile.');
    }

    // Check if the email is already in use by another user (excluding the current user being updated)
    if (updateData.email) {
      const userWithEmail = await this.userRepository.findByEmail(updateData.email);
      if (userWithEmail && userWithEmail.id !== targetUserId) {
        throw new ConflictException('This email address is already associated with another user.');
      }
    }
    
    const updatedUserData = { ...existingUser, ...updateData };
    await this.userRepository.update(targetUserId, updatedUserData);

    return updatedUserData;
  }
}
