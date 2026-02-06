import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateInventarioEnvaseDto {
  @IsString()
  envaseId: string;

  @IsInt()
  @Min(0)
  cantidad: number;

  @IsInt()
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
