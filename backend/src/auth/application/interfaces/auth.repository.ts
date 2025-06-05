import { user, role } from '@prisma/client';

export interface UserWithRole extends user {
  role: role;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<UserWithRole | null>;
}
