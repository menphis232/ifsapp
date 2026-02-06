import { PartialType } from '@nestjs/mapped-types';
import { CreateReporteDto } from './create-reporte.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoReporte } from '../entities/reporte.entity';

export class UpdateReporteDto extends PartialType(CreateReporteDto) {
  @IsEnum(EstadoReporte)
  @IsOptional()
  estado?: EstadoReporte;
}

