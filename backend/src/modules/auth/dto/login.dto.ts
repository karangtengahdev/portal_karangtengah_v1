import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@nawasena.id', description: 'Email akun (terdaftar di Supabase Auth)' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin1234', description: 'Password akun' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RefreshDto {
  @ApiProperty({ example: 'v1.Mr...', description: 'refresh_token dari hasil login' })
  @IsString()
  refresh_token: string;
}
