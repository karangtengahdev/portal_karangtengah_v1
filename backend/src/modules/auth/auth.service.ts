import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  private get url() {
    return this.config.get<string>('supabase.url');
  }
  private get anon() {
    return this.config.get<string>('supabase.anonKey');
  }

  async login(email: string, password: string) {
    const res = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: this.anon!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new UnauthorizedException(
        data.error_description || data.msg || 'Login gagal',
      );
    }
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.app_metadata?.role ?? 'operator',
      },
    };
  }

  async refresh(refresh_token: string) {
    const res = await fetch(`${this.url}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: this.anon!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  }
}
