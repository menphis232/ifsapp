import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUnidadMedidaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  abreviatura?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
