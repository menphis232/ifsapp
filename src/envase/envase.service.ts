import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Envase, TipoEnvase } from './entities/envase.entity';
import { CreateEnvaseDto } from './dto/create-envase.dto';
import { UpdateEnvaseDto } from './dto/update-envase.dto';
import { PRODUCTOS_PRESENTACIONES } from '../produccion/productos-presentaciones.config';

@Injectable()
export class EnvaseService implements OnModuleInit {
  constructor(
    @InjectRepository(Envase)
    private envaseRepository: Repository<Envase>,
  ) {}

  async onModuleInit() {
    await this.inicializarEnvasesDefault();
  }

  async inicializarEnvasesDefault(): Promise<void> {
    for (const f of PRODUCTOS_PRESENTACIONES) {
      const tiposPermitidos = f.presentaciones.map((p) => p.tipo);

      const obsoletos = await this.envaseRepository.find({
        where: {
          formulaId: f.formulaId,
          tipo: Not(In(tiposPermitidos)) as any,
          activo: true,
        },
      });
      for (const obs of obsoletos) {
        await this.envaseRepository.update(obs.id, { activo: false });
      }

      for (const p of f.presentaciones) {
        const nombre = `${f.nombre} ${p.label.replace(/\s/g, '')}`;
        const tipo = p.tipo as TipoEnvase;
        const existe = await this.envaseRepository.findOne({
          where: { formulaId: f.formulaId, tipo },
        });
        if (!existe) {
          await this.create({
            nombre,
            formulaId: f.formulaId,
            tipo,
            capacidad: p.capacidadKg,
            descripcion: `Pote ${p.label} para ${f.nombre}`,
            activo: true,
          } as any);
        } else {
          await this.envaseRepository.update(existe.id, {
            activo: true,
            capacidad: p.capacidadKg,
            nombre,
          });
        }
      }
    }
  }

  async create(createEnvaseDto: CreateEnvaseDto): Promise<Envase> {
    const envase = this.envaseRepository.create(createEnvaseDto);
    return this.envaseRepository.save(envase);
  }

  async findAll(): Promise<Envase[]> {
    return this.envaseRepository.find({
      where: { activo: true },
      order: { capacidad: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Envase> {
    const envase = await this.envaseRepository.findOne({ where: { id } });
    if (!envase) {
      throw new NotFoundException(`Envase con ID ${id} no encontrado`);
    }
    return envase;
  }

  async findByTipo(tipo: string): Promise<Envase[]> {
    return this.envaseRepository.find({
      where: { tipo: tipo as any, activo: true },
    });
  }

  async findByFormulaAndTipo(formulaId: string, tipo: string): Promise<Envase[]> {
    return this.envaseRepository.find({
      where: { formulaId, tipo: tipo as any, activo: true },
    });
  }

  async update(id: string, updateEnvaseDto: UpdateEnvaseDto): Promise<Envase> {
    const envase = await this.findOne(id);
    Object.assign(envase, updateEnvaseDto);
    return this.envaseRepository.save(envase);
  }

  async remove(id: string): Promise<void> {
    const envase = await this.findOne(id);
    await this.envaseRepository.remove(envase);
  }
}
