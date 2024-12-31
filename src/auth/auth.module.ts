import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
