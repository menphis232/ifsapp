import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Etiqueta, TipoEtiqueta } from './entities/etiqueta.entity';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';
import { PRODUCTOS_PRESENTACIONES } from '../produccion/productos-presentaciones.config';

@Injectable()
export class EtiquetaService implements OnModuleInit {
  constructor(
    @InjectRepository(Etiqueta)
    private etiquetaRepository: Repository<Etiqueta>,
  ) {}

  async onModuleInit() {
    await this.inicializarEtiquetasDefault();
  }

  async inicializarEtiquetasDefault(): Promise<void> {
    for (const f of PRODUCTOS_PRESENTACIONES) {
      const tiposPermitidos = f.presentaciones.map((p) => p.tipo);

      const obsoletos = await this.etiquetaRepository.find({
        where: {
          formulaId: f.formulaId,
          tipo: Not(In(tiposPermitidos)) as any,
          activo: true,
        },
      });
      for (const obs of obsoletos) {
        await this.etiquetaRepository.update(obs.id, { activo: false });
      }

      for (const p of f.presentaciones) {
        const nombre = `${f.nombre} ${p.label.replace(/\s/g, '')}`;
        const tipo = p.tipo as TipoEtiqueta;
        const existe = await this.etiquetaRepository.findOne({
          where: { formulaId: f.formulaId, tipo },
        });
        if (!existe) {
          await this.create({
            nombre,
            formulaId: f.formulaId,
            tipo,
            descripcion: `Etiqueta ${p.label} para ${f.nombre}`,
            activo: true,
          } as any);
        } else {
          await this.etiquetaRepository.update(existe.id, {
            activo: true,
            nombre,
          });
        }
      }
    }
  }

  async create(createEtiquetaDto: CreateEtiquetaDto): Promise<Etiqueta> {
    const etiqueta = this.etiquetaRepository.create(createEtiquetaDto);
    return this.etiquetaRepository.save(etiqueta);
  }

  async findAll(): Promise<Etiqueta[]> {
    return this.etiquetaRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Etiqueta> {
    const etiqueta = await this.etiquetaRepository.findOne({ where: { id } });
    if (!etiqueta) {
      throw new NotFoundException(`Etiqueta con ID ${id} no encontrada`);
    }
    return etiqueta;
  }

  async findByTipo(tipo: string): Promise<Etiqueta[]> {
    return this.etiquetaRepository.find({
      where: { tipo: tipo as any, activo: true },
    });
  }

  async findByFormulaAndTipo(formulaId: string, tipo: string): Promise<Etiqueta[]> {
    return this.etiquetaRepository.find({
      where: { formulaId, tipo: tipo as any, activo: true },
    });
  }

  async update(id: string, updateEtiquetaDto: UpdateEtiquetaDto): Promise<Etiqueta> {
    const etiqueta = await this.findOne(id);
    Object.assign(etiqueta, updateEtiquetaDto);
    return this.etiquetaRepository.save(etiqueta);
  }

  async remove(id: string): Promise<void> {
    const etiqueta = await this.findOne(id);
    await this.etiquetaRepository.remove(etiqueta);
  }
}
