import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SistemaLog } from './entities/sistema-log.entity';

export interface SistemaLogDto {
  id: string;
  usuarioId: string;
  accion: string;
  modulo: string;
  detalles: string | null;
  fecha: Date;
  usuario: { id: string; email: string; nombre: string; rol: string } | null;
}

@Injectable()
export class SistemaLogService {
  constructor(
    @InjectRepository(SistemaLog)
    private logRepository: Repository<SistemaLog>,
  ) {}

  async registrar(
    usuarioId: string,
    accion: string,
    modulo: string,
    detalles?: string,
  ): Promise<SistemaLog> {
    const log = this.logRepository.create({
      usuarioId,
      accion,
      modulo,
      detalles: detalles || null,
    });
    return this.logRepository.save(log);
  }

  async findAll(limit = 500): Promise<SistemaLogDto[]> {
    const logs = await this.logRepository.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' },
      take: limit,
    });
    return logs.map((log) => {
      const u = log.usuario;
      return {
        id: log.id,
        usuarioId: log.usuarioId,
        accion: log.accion,
        modulo: log.modulo,
        detalles: log.detalles,
        fecha: log.fecha,
        usuario: u
          ? { id: u.id, email: u.email, nombre: u.nombre, rol: u.rol }
          : null,
      };
    });
  }
}
