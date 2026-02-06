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
import { ReporteService } from './reporte.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Controller('reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReporteDto: CreateReporteDto) {
    return this.reporteService.create(createReporteDto);
  }

  @Get()
  findAll(@Query('estado') estado?: string) {
    if (estado) {
      return this.reporteService.findByEstado(estado);
    }
    return this.reporteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reporteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReporteDto: UpdateReporteDto) {
    return this.reporteService.update(id, updateReporteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reporteService.remove(id);
  }
}

