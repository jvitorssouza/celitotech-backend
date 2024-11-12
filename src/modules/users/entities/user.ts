import bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne } from 'typeorm';

import { Account } from '../../accounts/entities/account';

export enum UserRole {
    Admin = 'admin',
    User = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: UserRole;

    @ManyToOne(() => Account, (account) => account.users)
    account: Account;

    constructor(
        props: {
            name: string;
            email: string;
            password?: string;
            role: UserRole;
            account: Account,
        },
        id?: string,
    ) {
        Object.assign(this, props);
        this.id = id ?? crypto.randomUUID();
    }

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hashSync(this.password, 12);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compareSync(password, this.password);
    }
}
