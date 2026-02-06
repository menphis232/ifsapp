import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { RolUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;
}
