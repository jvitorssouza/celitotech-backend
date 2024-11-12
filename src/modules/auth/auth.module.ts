import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { SignUpUseCase } from './use-cases/signup';
import { AuthenticateUserUseCase } from './use-cases/authenticate-user';

import { jwtConstants } from '../../configs/authentication';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [
        UsersModule,
        AccountsModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        SignUpUseCase,
        AuthenticateUserUseCase,
        {
            provide: 'IJwtService',
            useExisting: JwtService,
        },
    ]
})
export class AuthModule { }
