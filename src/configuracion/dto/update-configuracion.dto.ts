import { IsInt, IsBoolean, IsString, IsOptional, Min } from 'class-validator';

export class UpdateConfiguracionDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  cantidadMinimaGlobal?: number;

  @IsBoolean()
  @IsOptional()
  notificacionesActivas?: boolean;

  @IsString()
  @IsOptional()
  onesignalAppId?: string;

  @IsString()
  @IsOptional()
  onesignalApiKey?: string;

  @IsString()
  @IsOptional()
  onesignalPlayerIds?: string;
}

