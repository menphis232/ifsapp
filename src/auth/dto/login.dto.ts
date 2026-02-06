import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Ingrese un email válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  password: string;
}
