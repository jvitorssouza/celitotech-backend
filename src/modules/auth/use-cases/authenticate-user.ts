import { Inject, UnauthorizedException } from "@nestjs/common";

import { IJwtService } from "../interfaces/jwt.service";
import { AuthenticateUserDto } from "../dto/authenticate-user";
import { IUserRepository } from "../../users/interfaces/user.repository";
import { IAuthenticationResponse } from "../interfaces/authentication";

export class AuthenticateUserUseCase {
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository;

    @Inject('IJwtService')
    private readonly jwtService: IJwtService;

    async execute(data: AuthenticateUserDto): Promise<IAuthenticationResponse> {
        try {
            const user = await this.userRepo.findByEmail(data.email);

            const userNotFound = !user;
            if (userNotFound) throw new UnauthorizedException('Email or password incorrect');

            const passwordDontMatch = !(await user.validatePassword(data.password));
            if (passwordDontMatch) throw new UnauthorizedException('Email or password incorrect');

            const payload = { sub: user.id, username: user.name, role: user.role, account: user.account };

            return {
                accessToken: await this.jwtService.sign(payload),
            };
        } catch (err) {
            throw err;
        }
    }
}
