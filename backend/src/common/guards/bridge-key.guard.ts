import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Guard untuk endpoint ingest telemetry dari Bridge (header x-bridge-key)
@Injectable()
export class BridgeKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-bridge-key'];
    const expected = this.config.get<string>('bridge.apiKey');
    if (!key || key !== expected) {
      throw new UnauthorizedException('Bridge key tidak valid');
    }
    return true;
  }
}
