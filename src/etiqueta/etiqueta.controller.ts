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
  Query,
} from '@nestjs/common';
import { EtiquetaService } from './etiqueta.service';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';

@Controller('etiquetas')
export class EtiquetaController {
  constructor(private readonly etiquetaService: EtiquetaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEtiquetaDto: CreateEtiquetaDto) {
    return this.etiquetaService.create(createEtiquetaDto);
  }

  @Get()
  findAll(@Query('tipo') tipo?: string) {
    if (tipo) {
      return this.etiquetaService.findByTipo(tipo);
    }
    return this.etiquetaService.findAll();
  }

  @Get(':id/qr-payload')
  getQrPayload(@Param('id') id: string) {
    return { payload: `IFS:etiqueta:${id}` };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.etiquetaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEtiquetaDto: UpdateEtiquetaDto) {
    return this.etiquetaService.update(id, updateEtiquetaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.etiquetaService.remove(id);
  }
}
