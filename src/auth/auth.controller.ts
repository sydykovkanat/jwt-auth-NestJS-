import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dtos/register.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/utils/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    return await this.authService.generateTokens(userId, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  async refresh(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.generateTokens(userId, res);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '', { httpOnly: true });
  }
}
