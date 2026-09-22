import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CrearProduccionDto {
  @IsString()
  formulaId: string;

  /** Potes de la presentación principal (la de mayor capacidad del producto). */
  @IsInt()
  @Min(0)
  potes1kg: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  potesMedioKg?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  potes3kg?: number;

  @IsString()
  @IsOptional()
  notas?: string;
}
