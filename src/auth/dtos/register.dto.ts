import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  password: string;

  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым' })
  displayName: string;
}
