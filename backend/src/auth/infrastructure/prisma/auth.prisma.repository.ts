import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  IAuthRepository,
  UserWithRole,
} from '../../application/interfaces/auth.repository';

@Injectable()
export class AuthPrismaRepository implements IAuthRepository {
  constructor(private prisma: PrismaService) {}

  findUserByEmail(email: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }
}
