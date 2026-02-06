import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredienteFormulaDto {
  @IsString()
  ingredienteId: string;

  cantidadRequerida: number;

  @IsString()
  @IsOptional()
  notas?: string;
}

export class CreateFormulaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  mobiliarioId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredienteFormulaDto)
  ingredientes: IngredienteFormulaDto[];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
