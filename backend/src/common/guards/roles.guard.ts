import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Akses ditolak: belum login');
    }

    // 'admin' = superadmin, selalu lolos apa pun requiredRoles-nya --
    // dipakai sbg akun cadangan/pemilik sistem yg bisa akses semua area
    // (Portal maupun Nawasena), TERPISAH dari role spesifik 'portal'
    // dan 'nawasena' yg masing2 cuma boleh akses areanya sendiri.
    if (user.role === 'admin') return true;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Akses ditolak: role tidak mencukupi');
    }
    return true;
  }
}
