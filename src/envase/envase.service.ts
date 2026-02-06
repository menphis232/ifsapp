import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envase, TipoEnvase } from './entities/envase.entity';
import { CreateEnvaseDto } from './dto/create-envase.dto';
import { UpdateEnvaseDto } from './dto/update-envase.dto';

@Injectable()
export class EnvaseService implements OnModuleInit {
  constructor(
    @InjectRepository(Envase)
    private envaseRepository: Repository<Envase>,
  ) {}

  /** Productos con presentación 1kg y 500g (mismo ID que fórmulas hardcodeadas) */
  private readonly productosConPresentaciones = [
    { formulaId: 'massgainer-001', nombre: 'Mass Gainer' },
    { formulaId: 'bcaaa-001', nombre: 'BCAAA' },
    { formulaId: 'proteina-chocolate-001', nombre: 'Proteína de Chocolate' },
    { formulaId: 'proteina-vainilla-001', nombre: 'Proteína de Vainilla' },
  ];

  async onModuleInit() {
    await this.inicializarEnvasesDefault();
  }

  async inicializarEnvasesDefault(): Promise<void> {
    const envasesDefault: Array<{ nombre: string; formulaId: string; tipo: TipoEnvase; capacidad: number; descripcion: string }> = [];
    for (const p of this.productosConPresentaciones) {
      envasesDefault.push({
        nombre: `${p.nombre} 1kg`,
        formulaId: p.formulaId,
        tipo: TipoEnvase.KILO,
        capacidad: 1.0,
        descripcion: `Pote 1kg para ${p.nombre}`,
      });
      envasesDefault.push({
        nombre: `${p.nombre} 500g`,
        formulaId: p.formulaId,
        tipo: TipoEnvase.MEDIO_KILO,
        capacidad: 0.5,
        descripcion: `Pote 500g para ${p.nombre}`,
      });
    }

    for (const envase of envasesDefault) {
      const existe = await this.envaseRepository.findOne({
        where: { nombre: envase.nombre, formulaId: envase.formulaId },
      });

      if (!existe) {
        await this.create(envase as any);
      }
    }
  }

  async create(createEnvaseDto: CreateEnvaseDto): Promise<Envase> {
    const envase = this.envaseRepository.create(createEnvaseDto);
    return this.envaseRepository.save(envase);
  }

  async findAll(): Promise<Envase[]> {
    return this.envaseRepository.find({
      order: { capacidad: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Envase> {
    const envase = await this.envaseRepository.findOne({
      where: { id },
    });

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

  /** Envases de un producto para una presentación (1kg o 500g) */
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
