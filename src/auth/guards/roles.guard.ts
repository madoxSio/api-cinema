import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest {
  user: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<Role[]>('roles', context.getHandler()) ??
      this.reflector.get<Role[]>('roles', context.getClass()) ??
      [];

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return requiredRoles.includes(user.role);
  }
}
