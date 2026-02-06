import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formula } from './entities/formula.entity';
import { FormulaIngrediente } from './entities/formula-ingrediente.entity';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';
import { MobiliarioService } from '../mobiliario/mobiliario.service';
import { IngredienteService } from '../ingrediente/ingrediente.service';

@Injectable()
export class FormulaService {
  constructor(
    @InjectRepository(Formula)
    private formulaRepository: Repository<Formula>,
    @InjectRepository(FormulaIngrediente)
    private formulaIngredienteRepository: Repository<FormulaIngrediente>,
    private mobiliarioService: MobiliarioService,
    private ingredienteService: IngredienteService,
  ) {}

  async create(createFormulaDto: CreateFormulaDto): Promise<Formula> {
    // Verificar que el mobiliario existe
    await this.mobiliarioService.findOne(createFormulaDto.mobiliarioId);

    // Verificar que todos los ingredientes existen
    for (const ingredienteDto of createFormulaDto.ingredientes) {
      await this.ingredienteService.findOne(ingredienteDto.ingredienteId);
    }

    const formula = this.formulaRepository.create({
      nombre: createFormulaDto.nombre,
      descripcion: createFormulaDto.descripcion,
      mobiliarioId: createFormulaDto.mobiliarioId,
      activo: createFormulaDto.activo ?? true,
    });

    const savedFormula = await this.formulaRepository.save(formula);

    // Crear las relaciones con ingredientes
    for (const ingredienteDto of createFormulaDto.ingredientes) {
      const formulaIngrediente = this.formulaIngredienteRepository.create({
        formulaId: savedFormula.id,
        ingredienteId: ingredienteDto.ingredienteId,
        cantidadRequerida: ingredienteDto.cantidadRequerida,
        notas: ingredienteDto.notas,
      });

      await this.formulaIngredienteRepository.save(formulaIngrediente);
    }

    return this.findOne(savedFormula.id);
  }

  async findAll(): Promise<Formula[]> {
    return this.formulaRepository.find({
      relations: ['mobiliario', 'ingredientes', 'ingredientes.ingrediente', 'ingredientes.ingrediente.unidadMedida'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Formula> {
    const formula = await this.formulaRepository.findOne({
      where: { id },
      relations: ['mobiliario', 'ingredientes', 'ingredientes.ingrediente', 'ingredientes.ingrediente.unidadMedida'],
    });

    if (!formula) {
      throw new NotFoundException(`Fórmula con ID ${id} no encontrada`);
    }

    return formula;
  }

  async findByMobiliario(mobiliarioId: string): Promise<Formula | null> {
    return this.formulaRepository.findOne({
      where: { mobiliarioId },
      relations: ['mobiliario', 'ingredientes', 'ingredientes.ingrediente', 'ingredientes.ingrediente.unidadMedida'],
    });
  }

  async update(id: string, updateFormulaDto: UpdateFormulaDto): Promise<Formula> {
    const formula = await this.findOne(id);

    if (updateFormulaDto.mobiliarioId) {
      await this.mobiliarioService.findOne(updateFormulaDto.mobiliarioId);
    }

    // Si se actualizan los ingredientes, eliminar los anteriores y crear nuevos
    if (updateFormulaDto.ingredientes) {
      // Eliminar ingredientes existentes
      await this.formulaIngredienteRepository.delete({ formulaId: id });

      // Crear nuevos ingredientes
      for (const ingredienteDto of updateFormulaDto.ingredientes) {
        await this.ingredienteService.findOne(ingredienteDto.ingredienteId);

        const formulaIngrediente = this.formulaIngredienteRepository.create({
          formulaId: id,
          ingredienteId: ingredienteDto.ingredienteId,
          cantidadRequerida: ingredienteDto.cantidadRequerida,
          notas: ingredienteDto.notas,
        });

        await this.formulaIngredienteRepository.save(formulaIngrediente);
      }
    }

    // Actualizar otros campos
    Object.assign(formula, {
      nombre: updateFormulaDto.nombre ?? formula.nombre,
      descripcion: updateFormulaDto.descripcion ?? formula.descripcion,
      mobiliarioId: updateFormulaDto.mobiliarioId ?? formula.mobiliarioId,
      activo: updateFormulaDto.activo ?? formula.activo,
    });

    await this.formulaRepository.save(formula);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const formula = await this.findOne(id);
    await this.formulaRepository.remove(formula);
  }
}
