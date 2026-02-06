import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Get()
  getConfiguracion() {
    return this.configuracionService.getConfiguracion();
  }

  @Patch()
  update(@Body() updateConfiguracionDto: UpdateConfiguracionDto) {
    return this.configuracionService.update(updateConfiguracionDto);
  }
}

