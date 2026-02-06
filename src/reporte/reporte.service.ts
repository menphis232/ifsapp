import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from './entities/reporte.entity';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { MobiliarioService } from '../mobiliario/mobiliario.service';
import { NotificacionService } from '../notificacion/notificacion.service';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Reporte)
    private reporteRepository: Repository<Reporte>,
    private mobiliarioService: MobiliarioService,
    private notificacionService: NotificacionService,
  ) {}

  async create(createReporteDto: CreateReporteDto): Promise<Reporte> {
    const mobiliario = await this.mobiliarioService.findOne(createReporteDto.mobiliarioId);
    const reporte = this.reporteRepository.create(createReporteDto);
    const saved = await this.reporteRepository.save(reporte);
    this.notificacionService
      .enviarNotificacionPersonalizada(
        'Nuevo reporte de daño',
        `Reporte: ${mobiliario.nombre} - ${createReporteDto.descripcion?.slice(0, 80) || createReporteDto.tipo}`,
      )
      .catch(() => {});
    return saved;
  }

  async findAll(): Promise<Reporte[]> {
    return this.reporteRepository.find({
      relations: ['mobiliario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEstado(estado: string): Promise<Reporte[]> {
    return this.reporteRepository.find({
      where: { estado: estado as any },
      relations: ['mobiliario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reporte> {
    const reporte = await this.reporteRepository.findOne({
      where: { id },
      relations: ['mobiliario'],
    });

    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    return reporte;
  }

  async update(
    id: string,
    updateReporteDto: UpdateReporteDto,
  ): Promise<Reporte> {
    const reporte = await this.findOne(id);
    Object.assign(reporte, updateReporteDto);
    return this.reporteRepository.save(reporte);
  }

  async remove(id: string): Promise<void> {
    const reporte = await this.findOne(id);
    await this.reporteRepository.remove(reporte);
  }
}

