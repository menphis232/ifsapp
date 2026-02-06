import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TipoReporte } from '../entities/reporte.entity';

export class CreateReporteDto {
  @IsString()
  mobiliarioId: string;

  @IsEnum(TipoReporte)
  tipo: TipoReporte;

  @IsString()
  descripcion: string;

  @IsString()
  @IsOptional()
  notas?: string;
}

