import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioEtiqueta } from './entities/inventario-etiqueta.entity';
import { EtiquetaService } from '../etiqueta/etiqueta.service';

@Injectable()
export class InventarioEtiquetaService {
  constructor(
    @InjectRepository(InventarioEtiqueta)
    private inventarioEtiquetaRepository: Repository<InventarioEtiqueta>,
    private etiquetaService: EtiquetaService,
  ) {}

  async create(etiquetaId: string, cantidad: number): Promise<InventarioEtiqueta> {
    await this.etiquetaService.findOne(etiquetaId);

    let inventario: InventarioEtiqueta;
    try {
      inventario = await this.findByEtiqueta(etiquetaId);
      inventario.cantidad += cantidad;
    } catch (error) {
      inventario = this.inventarioEtiquetaRepository.create({
        etiquetaId,
        cantidad,
      });
    }

    return this.inventarioEtiquetaRepository.save(inventario);
  }

  async findAll(): Promise<InventarioEtiqueta[]> {
    return this.inventarioEtiquetaRepository.find({
      relations: ['etiqueta'],
    });
  }

  async findOne(id: string): Promise<InventarioEtiqueta> {
    const inventario = await this.inventarioEtiquetaRepository.findOne({
      where: { id },
      relations: ['etiqueta'],
    });
    if (!inventario) {
      throw new NotFoundException(`Inventario etiqueta con ID ${id} no encontrado`);
    }
    return inventario;
  }

  async findByEtiqueta(etiquetaId: string): Promise<InventarioEtiqueta> {
    const inventario = await this.inventarioEtiquetaRepository.findOne({
      where: { etiquetaId },
      relations: ['etiqueta'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario para etiqueta ${etiquetaId} no encontrado`);
    }

    return inventario;
  }

  async update(id: string, cantidad: number): Promise<InventarioEtiqueta> {
    const inventario = await this.findOne(id);
    inventario.cantidad = cantidad;
    return this.inventarioEtiquetaRepository.save(inventario);
  }

  async descontar(etiquetaId: string, cantidad: number): Promise<void> {
    const inventario = await this.findByEtiqueta(etiquetaId);
    if (inventario.cantidad < cantidad) {
      throw new Error(`No hay suficientes etiquetas. Disponible: ${inventario.cantidad}, Requerido: ${cantidad}`);
    }
    inventario.cantidad -= cantidad;
    await this.inventarioEtiquetaRepository.save(inventario);
  }
}
