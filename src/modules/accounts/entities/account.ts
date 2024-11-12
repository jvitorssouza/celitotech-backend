import * as crypto from 'crypto';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => User, (user) => user.account)
    users: User[]

    constructor(id?: string) {
        this.id = id ?? crypto.randomUUID();
    }
}