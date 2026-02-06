import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etiqueta, TipoEtiqueta } from './entities/etiqueta.entity';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';

@Injectable()
export class EtiquetaService implements OnModuleInit {
  constructor(
    @InjectRepository(Etiqueta)
    private etiquetaRepository: Repository<Etiqueta>,
  ) {}

  /** Productos con presentación 1kg y 500g (mismo ID que fórmulas hardcodeadas) */
  private readonly productosConPresentaciones = [
    { formulaId: 'massgainer-001', nombre: 'Mass Gainer' },
    { formulaId: 'bcaaa-001', nombre: 'BCAAA' },
    { formulaId: 'proteina-chocolate-001', nombre: 'Proteína de Chocolate' },
    { formulaId: 'proteina-vainilla-001', nombre: 'Proteína de Vainilla' },
  ];

  async onModuleInit() {
    await this.inicializarEtiquetasDefault();
  }

  async inicializarEtiquetasDefault(): Promise<void> {
    const etiquetasDefault: Array<{ nombre: string; formulaId: string; tipo: TipoEtiqueta; descripcion: string }> = [];
    for (const p of this.productosConPresentaciones) {
      etiquetasDefault.push({
        nombre: `${p.nombre} 1kg`,
        formulaId: p.formulaId,
        tipo: TipoEtiqueta.KILO,
        descripcion: `Etiqueta 1kg para ${p.nombre}`,
      });
      etiquetasDefault.push({
        nombre: `${p.nombre} 500g`,
        formulaId: p.formulaId,
        tipo: TipoEtiqueta.MEDIO_KILO,
        descripcion: `Etiqueta 500g para ${p.nombre}`,
      });
    }

    for (const etiqueta of etiquetasDefault) {
      const existe = await this.etiquetaRepository.findOne({
        where: { nombre: etiqueta.nombre, formulaId: etiqueta.formulaId },
      });

      if (!existe) {
        await this.create(etiqueta as any);
      }
    }
  }

  async create(createEtiquetaDto: CreateEtiquetaDto): Promise<Etiqueta> {
    const etiqueta = this.etiquetaRepository.create(createEtiquetaDto);
    return this.etiquetaRepository.save(etiqueta);
  }

  async findAll(): Promise<Etiqueta[]> {
    return this.etiquetaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Etiqueta> {
    const etiqueta = await this.etiquetaRepository.findOne({
      where: { id },
    });

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

  /** Etiquetas de un producto para una presentación (1kg o 500g) */
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
