import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioIngredienteDto } from './create-inventario-ingrediente.dto';

export class UpdateInventarioIngredienteDto extends PartialType(CreateInventarioIngredienteDto) {}
