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
import { UnidadMedidaService } from './unidad-medida.service';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';

@Controller('unidades-medida')
export class UnidadMedidaController {
  constructor(private readonly unidadMedidaService: UnidadMedidaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUnidadMedidaDto: CreateUnidadMedidaDto) {
    return this.unidadMedidaService.create(createUnidadMedidaDto);
  }

  @Get()
  findAll() {
    return this.unidadMedidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadMedidaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnidadMedidaDto: UpdateUnidadMedidaDto) {
    return this.unidadMedidaService.update(id, updateUnidadMedidaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.unidadMedidaService.remove(id);
  }
}
