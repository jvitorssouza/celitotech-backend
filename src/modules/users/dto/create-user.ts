import { UserRole } from "../entities/user";
import { Account } from "../../accounts/entities/account";
import { IsDefined, IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsDefined({ message: 'The name field is required.' })
    name: string;

    @IsDefined({ message: 'The email field is required.' })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    email: string;

    @IsDefined({ message: 'A password is required for creating a user.' })
    password: string;

    role: UserRole;
    account: Account;
}
