
import { Reflector } from '@nestjs/core';
import { UserRole } from '../modules/users/entities/user';

export const Roles = Reflector.createDecorator<UserRole[]>();
