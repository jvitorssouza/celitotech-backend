import { Body, Controller, Get, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticateUserDto } from './dto/authenticate-user';
import { AuthenticateUserUseCase } from './use-cases/authenticate-user';
import { JwtAuthGuard } from './auth.guard';
import { SignUpUseCase } from './use-cases/signup';
import { CreateUserDto } from '../users/dto/create-user';

@Controller('auth')
export class AuthController {
    @Inject(AuthenticateUserUseCase)
    private readonly authenticateUserUseCase: AuthenticateUserUseCase;

    @Inject(SignUpUseCase)
    private readonly signUpUseCase: SignUpUseCase;

    @Post('login')
    async authentication(@Body() authenticationData: AuthenticateUserDto) {
        return await this.authenticateUserUseCase.execute(authenticationData);
    }

    @Post('signup')
    async signUp(@Body() signUpData: CreateUserDto) {
        return await this.signUpUseCase.execute(signUpData);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Request() req) {
        return req.user;
    }
}
