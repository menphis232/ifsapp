import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { TipoEnvase } from '../entities/envase.entity';

export class CreateEnvaseDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  formulaId?: string;

  @IsEnum(TipoEnvase)
  tipo: TipoEnvase;

  @IsNumber()
  @Min(0)
  capacidad: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
