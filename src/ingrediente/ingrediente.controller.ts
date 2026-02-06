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
import { IngredienteService } from './ingrediente.service';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';

@Controller('ingredientes')
export class IngredienteController {
  constructor(private readonly ingredienteService: IngredienteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIngredienteDto: CreateIngredienteDto) {
    return this.ingredienteService.create(createIngredienteDto);
  }

  @Get()
  findAll() {
    return this.ingredienteService.findAll();
  }

  @Get(':id/qr-payload')
  getQrPayload(@Param('id') id: string) {
    return { payload: `IFS:ingrediente:${id}` };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredienteDto: UpdateIngredienteDto) {
    return this.ingredienteService.update(id, updateIngredienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.ingredienteService.remove(id);
  }
}
