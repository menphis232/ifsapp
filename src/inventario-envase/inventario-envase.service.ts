import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioEnvase } from './entities/inventario-envase.entity';
import { CreateInventarioEnvaseDto } from './dto/create-inventario-envase.dto';
import { EnvaseService } from '../envase/envase.service';

@Injectable()
export class InventarioEnvaseService {
  constructor(
    @InjectRepository(InventarioEnvase)
    private inventarioEnvaseRepository: Repository<InventarioEnvase>,
    private envaseService: EnvaseService,
  ) {}

  async create(createDto: CreateInventarioEnvaseDto): Promise<InventarioEnvase> {
    await this.envaseService.findOne(createDto.envaseId);

    let inventario: InventarioEnvase;
    try {
      inventario = await this.findByEnvase(createDto.envaseId);
      Object.assign(inventario, createDto);
    } catch (error) {
      inventario = this.inventarioEnvaseRepository.create(createDto);
    }

    return this.inventarioEnvaseRepository.save(inventario);
  }

  async findAll(): Promise<InventarioEnvase[]> {
    return this.inventarioEnvaseRepository.find({
      relations: ['envase'],
    });
  }

  async findOne(id: string): Promise<InventarioEnvase> {
    const inventario = await this.inventarioEnvaseRepository.findOne({
      where: { id },
      relations: ['envase'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario de envase con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async findByEnvase(envaseId: string): Promise<InventarioEnvase> {
    const inventario = await this.inventarioEnvaseRepository.findOne({
      where: { envaseId },
      relations: ['envase'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario para envase ${envaseId} no encontrado`);
    }

    return inventario;
  }

  async update(id: string, cantidad: number): Promise<InventarioEnvase> {
    const inventario = await this.findOne(id);
    inventario.cantidad = cantidad;
    return this.inventarioEnvaseRepository.save(inventario);
  }

  async descontar(envaseId: string, cantidad: number): Promise<void> {
    const inventario = await this.findByEnvase(envaseId);
    if (inventario.cantidad < cantidad) {
      throw new Error(`No hay suficientes envases. Disponible: ${inventario.cantidad}, Requerido: ${cantidad}`);
    }
    inventario.cantidad -= cantidad;
    await this.inventarioEnvaseRepository.save(inventario);
  }
}
