import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class DatabaseRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('Invalid user session');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id_user: user.id },
      include: { role: true },
    });

    if (!dbUser || !dbUser.role) {
      throw new ForbiddenException('User role not found');
    }

    if (!requiredRoles.includes(dbUser.role.name)) {
      throw new ForbiddenException(
        `Access denied for role: ${dbUser.role.name}`,
      );
    }

    return true;
  }
}
