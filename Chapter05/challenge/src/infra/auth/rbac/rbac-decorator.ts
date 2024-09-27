import { Role } from '@/core/types/roles';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RbacGuard } from './rbac.guard';
import { Roles } from './roles.decorator';

export function RolesGuard(...roles: Role[]) {
  return applyDecorators(
    UseGuards(RbacGuard),
    Roles(...roles),
  );
}