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
import { InventarioEnvaseService } from './inventario-envase.service';
import { CreateInventarioEnvaseDto } from './dto/create-inventario-envase.dto';

@Controller('inventario-envases')
export class InventarioEnvaseController {
  constructor(private readonly inventarioEnvaseService: InventarioEnvaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateInventarioEnvaseDto) {
    return this.inventarioEnvaseService.create(createDto);
  }

  @Get()
  findAll() {
    return this.inventarioEnvaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioEnvaseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('cantidad') cantidad: number) {
    return this.inventarioEnvaseService.update(id, cantidad);
  }
}
