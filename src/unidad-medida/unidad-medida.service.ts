import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadMedida } from './entities/unidad-medida.entity';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';

@Injectable()
export class UnidadMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private unidadMedidaRepository: Repository<UnidadMedida>,
  ) {}

  async create(createUnidadMedidaDto: CreateUnidadMedidaDto): Promise<UnidadMedida> {
    const unidad = this.unidadMedidaRepository.create(createUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  async findAll(): Promise<UnidadMedida[]> {
    return this.unidadMedidaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UnidadMedida> {
    const unidad = await this.unidadMedidaRepository.findOne({
      where: { id },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad de medida con ID ${id} no encontrada`);
    }

    return unidad;
  }

  async update(
    id: string,
    updateUnidadMedidaDto: UpdateUnidadMedidaDto,
  ): Promise<UnidadMedida> {
    const unidad = await this.findOne(id);
    Object.assign(unidad, updateUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  async remove(id: string): Promise<void> {
    const unidad = await this.findOne(id);
    await this.unidadMedidaRepository.remove(unidad);
  }

  async inicializarUnidadesDefault(): Promise<void> {
    const unidadesDefault = [
      { nombre: 'Saco', abreviatura: 'sac', descripcion: 'Medida por sacos' },
      { nombre: 'Kilo', abreviatura: 'kg', descripcion: 'Medida por kilogramos' },
      { nombre: 'Paquete', abreviatura: 'pkg', descripcion: 'Medida por paquetes' },
      { nombre: 'Gramo', abreviatura: 'g', descripcion: 'Medida por gramos' },
      { nombre: 'Litro', abreviatura: 'L', descripcion: 'Medida por litros' },
      { nombre: 'Unidad', abreviatura: 'und', descripcion: 'Medida por unidades' },
    ];

    for (const unidad of unidadesDefault) {
      const existe = await this.unidadMedidaRepository.findOne({
        where: { nombre: unidad.nombre },
      });

      if (!existe) {
        await this.create(unidad);
      }
    }
  }
}
