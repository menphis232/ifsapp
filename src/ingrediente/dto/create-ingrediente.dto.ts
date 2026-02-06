import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateIngredienteDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  unidadMedidaId: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
