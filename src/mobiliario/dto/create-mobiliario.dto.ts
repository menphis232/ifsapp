import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMobiliarioDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;
}

