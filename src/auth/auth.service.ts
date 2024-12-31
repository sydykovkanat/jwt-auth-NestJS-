import { Injectable } from '@nestjs/common';
import { RegisterDto } from '@/auth/dtos/register.dto';
import { UsersService } from '@/users/users.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register({ password, email, displayName }: RegisterDto, res: Response) {
    const hashedPassword = await hash(password);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      displayName,
    });

    return await this.generateTokens(user.id, res);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser({ email });

    if (!user) {
      return null;
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async generateTokens(userId: string, res: Response) {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return accessToken;
  }
}
