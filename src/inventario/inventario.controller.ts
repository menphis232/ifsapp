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
  Put,
} from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Controller('inventarios')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  findAll() {
    return this.inventarioService.findAll();
  }

  @Get('bajo')
  getInventarioBajo() {
    return this.inventarioService.getInventarioBajo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(id);
  }

  @Get('mobiliario/:mobiliarioId')
  findByMobiliario(@Param('mobiliarioId') mobiliarioId: string) {
    return this.inventarioService.findByMobiliario(mobiliarioId);
  }

  @Put('codigo/:codigo')
  updateByCodigo(
    @Param('codigo') codigo: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.inventarioService.updateByCodigo(codigo, cantidad);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(id, updateInventarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(id);
  }
}

