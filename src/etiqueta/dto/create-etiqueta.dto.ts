import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { TipoEtiqueta } from '../entities/etiqueta.entity';

export class CreateEtiquetaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  formulaId?: string;

  @IsEnum(TipoEtiqueta)
  tipo: TipoEtiqueta;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
