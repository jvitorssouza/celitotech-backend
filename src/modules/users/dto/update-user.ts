import { UserRole } from "../entities/user";

export class UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
}