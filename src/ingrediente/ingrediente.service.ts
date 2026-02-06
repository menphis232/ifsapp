import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingrediente } from './entities/ingrediente.entity';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { UnidadMedidaService } from '../unidad-medida/unidad-medida.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IngredienteService {
  constructor(
    @InjectRepository(Ingrediente)
    private ingredienteRepository: Repository<Ingrediente>,
    private unidadMedidaService: UnidadMedidaService,
  ) {}

  async create(createIngredienteDto: CreateIngredienteDto): Promise<Ingrediente> {
    // Verificar que la unidad de medida existe
    await this.unidadMedidaService.findOne(createIngredienteDto.unidadMedidaId);

    const codigo = createIngredienteDto.codigo || `ING-${uuidv4().substring(0, 8).toUpperCase()}`;

    const ingrediente = this.ingredienteRepository.create({
      ...createIngredienteDto,
      codigo,
    });

    return this.ingredienteRepository.save(ingrediente);
  }

  async findAll(): Promise<Ingrediente[]> {
    return this.ingredienteRepository.find({
      relations: ['unidadMedida'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Ingrediente> {
    const ingrediente = await this.ingredienteRepository.findOne({
      where: { id },
      relations: ['unidadMedida'],
    });

    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente con ID ${id} no encontrado`);
    }

    return ingrediente;
  }

  async update(
    id: string,
    updateIngredienteDto: UpdateIngredienteDto,
  ): Promise<Ingrediente> {
    const ingrediente = await this.findOne(id);
    Object.assign(ingrediente, updateIngredienteDto);
    return this.ingredienteRepository.save(ingrediente);
  }

  async remove(id: string): Promise<void> {
    const ingrediente = await this.findOne(id);
    await this.ingredienteRepository.remove(ingrediente);
  }
}
