import { PartialType } from '@nestjs/mapped-types';
import { CreateMobiliarioDto } from './create-mobiliario.dto';

export class UpdateMobiliarioDto extends PartialType(CreateMobiliarioDto) {}

