import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string; // ini role Postgres ("authenticated"), BUKAN role aplikasi
  app_metadata?: { role?: string }; // role aplikasi (admin/operator) ada di sini
  user_metadata?: { role?: string };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const jwksUri = config.get<string>('supabase.jwksUri');
    if (!jwksUri) {
      throw new Error('supabase.jwksUri tidak ter-set (cek SUPABASE_URL di .env)');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['ES256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
    });
  }

  validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token tidak valid');
    }
    // Prioritas: app_metadata.role > user_metadata.role > default operator.
    // payload.role SENGAJA tidak dipakai karena nilainya "authenticated".
    const role =
      payload.app_metadata?.role ??
      payload.user_metadata?.role ??
      'operator';
    return { id: payload.sub, email: payload.email, role };
  }
}
