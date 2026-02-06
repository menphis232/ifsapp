import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInventarioIngredienteDto {
  @IsString()
  ingredienteId: string;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cantidadMinima?: number;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
