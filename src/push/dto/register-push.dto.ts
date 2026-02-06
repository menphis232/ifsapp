import { IsString, IsOptional } from 'class-validator';

export class RegisterPushDto {
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  platform?: string;
}
