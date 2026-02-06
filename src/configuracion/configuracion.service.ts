import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private configuracionRepository: Repository<Configuracion>,
  ) {}

  async getConfiguracion(): Promise<Configuracion> {
    let config = await this.configuracionRepository.findOne({
      where: {},
    });

    if (!config) {
      config = this.configuracionRepository.create({
        cantidadMinimaGlobal: 10,
        notificacionesActivas: true,
      });
      config = await this.configuracionRepository.save(config);
    }

    return config;
  }

  async update(
    updateConfiguracionDto: UpdateConfiguracionDto,
  ): Promise<Configuracion> {
    const config = await this.getConfiguracion();
    Object.assign(config, updateConfiguracionDto);
    return this.configuracionRepository.save(config);
  }
}

