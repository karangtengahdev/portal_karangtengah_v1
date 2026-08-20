import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login dengan email & password',
    description:
      'Login pakai kredensial Supabase Auth. Mengembalikan access_token untuk dipakai di endpoint cms/. ' +
      'Salin access_token, klik Authorize di atas, tempel di sana.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login berhasil',
    schema: {
      example: {
        success: true,
        data: {
          access_token: 'eyJhbGci...',
          refresh_token: 'v1.Mr...',
          expires_in: 3600,
          token_type: 'bearer',
          user: { id: 'uuid', email: 'admin@nawasena.id', role: 'admin' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Perbarui access_token',
    description: 'Pakai refresh_token untuk dapat access_token baru (token lama berlaku 1 jam).',
  })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Profil user dari token',
    description: 'Mengembalikan id, email, dan role dari access_token yang dikirim.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: { id: 'uuid', email: 'admin@nawasena.id', role: 'admin' },
      },
    },
  })
  me(@Req() req: any) {
    return req.user;
  }
}
