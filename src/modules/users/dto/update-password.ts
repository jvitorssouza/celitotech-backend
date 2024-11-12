import { IsDefined, IsString, MinLength, Matches, Validate } from "class-validator";
import { Match } from "../../../decorators/match.decorator";

export class UpdatePasswordDto {
    @IsDefined({ message: 'Password is required.' })
    @IsString({ message: 'Password must be a string.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    })
    password: string;

    @IsDefined({ message: 'Password confirmation is required.' })
    @IsString({ message: 'Password confirmation must be a string.' })
    @Match('password', { message: 'Password confirmation does not match the password.' })
    passwordConfirm: string;
}
