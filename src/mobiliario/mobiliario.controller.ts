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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MobiliarioService } from './mobiliario.service';
import { CreateMobiliarioDto } from './dto/create-mobiliario.dto';
import { UpdateMobiliarioDto } from './dto/update-mobiliario.dto';
import { ArchivoService } from '../archivo/archivo.service';

@Controller('mobiliarios')
export class MobiliarioController {
  constructor(
    private readonly mobiliarioService: MobiliarioService,
    private readonly archivoService: ArchivoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMobiliarioDto: CreateMobiliarioDto) {
    return this.mobiliarioService.create(createMobiliarioDto);
  }

  @Get()
  findAll() {
    return this.mobiliarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobiliarioService.findOne(id);
  }

  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo') codigo: string) {
    return this.mobiliarioService.findByCodigo(codigo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMobiliarioDto: UpdateMobiliarioDto) {
    return this.mobiliarioService.update(id, updateMobiliarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.mobiliarioService.remove(id);
  }

  @Post(':id/regenerar-qr')
  regenerateQR(@Param('id') id: string) {
    return this.mobiliarioService.regenerateQR(id);
  }

  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagenUrl = await this.archivoService.guardarImagen(file);
    return this.mobiliarioService.update(id, { imagenUrl });
  }
}

