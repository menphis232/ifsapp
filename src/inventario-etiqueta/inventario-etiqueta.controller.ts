import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InventarioEtiquetaService } from './inventario-etiqueta.service';

@Controller('inventario-etiquetas')
export class InventarioEtiquetaController {
  constructor(private readonly inventarioEtiquetaService: InventarioEtiquetaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body('etiquetaId') etiquetaId: string, @Body('cantidad') cantidad: number) {
    return this.inventarioEtiquetaService.create(etiquetaId, cantidad);
  }

  @Get()
  findAll() {
    return this.inventarioEtiquetaService.findAll();
  }

  @Get('etiqueta/:etiquetaId')
  findByEtiqueta(@Param('etiquetaId') etiquetaId: string) {
    return this.inventarioEtiquetaService.findByEtiqueta(etiquetaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioEtiquetaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('cantidad') cantidad: number) {
    return this.inventarioEtiquetaService.update(id, cantidad);
  }
}
