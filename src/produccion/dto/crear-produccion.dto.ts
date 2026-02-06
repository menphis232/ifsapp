import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CrearProduccionDto {
  @IsString()
  formulaId: string;

  @IsInt()
  @Min(1)
  potes1kg: number; // Cantidad de potes de 1kg que quiere producir

  @IsInt()
  @Min(0)
  @IsOptional()
  potesMedioKg?: number; // Cantidad de potes de 0.5kg (opcional, se calcula automáticamente)

  @IsString()
  @IsOptional()
  notas?: string;
}
