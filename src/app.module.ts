import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConf } from './configs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        AccountsModule,
        TypeOrmModule.forRoot(typeOrmConf),
    ],
    controllers: [],
    providers: [],
})

export class AppModule { }
