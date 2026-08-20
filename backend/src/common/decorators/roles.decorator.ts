import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Batasi endpoint untuk role tertentu (dipakai RolesGuard)
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
