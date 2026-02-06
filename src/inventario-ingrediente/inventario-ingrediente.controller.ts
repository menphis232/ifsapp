import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InventarioIngredienteService } from './inventario-ingrediente.service';
import { CreateInventarioIngredienteDto } from './dto/create-inventario-ingrediente.dto';
import { UpdateInventarioIngredienteDto } from './dto/update-inventario-ingrediente.dto';

@Controller('inventario-ingredientes')
export class InventarioIngredienteController {
  constructor(private readonly inventarioIngredienteService: InventarioIngredienteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateInventarioIngredienteDto) {
    return this.inventarioIngredienteService.create(createDto);
  }

  @Get()
  findAll() {
    return this.inventarioIngredienteService.findAll();
  }

  @Get('bajo')
  getInventarioBajo() {
    return this.inventarioIngredienteService.getInventarioBajo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioIngredienteService.findOne(id);
  }

  @Get('ingrediente/:ingredienteId')
  findByIngrediente(@Param('ingredienteId') ingredienteId: string) {
    return this.inventarioIngredienteService.findByIngrediente(ingredienteId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateInventarioIngredienteDto) {
    return this.inventarioIngredienteService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inventarioIngredienteService.remove(id);
  }
}
