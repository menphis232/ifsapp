import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioIngrediente } from './entities/inventario-ingrediente.entity';
import { CreateInventarioIngredienteDto } from './dto/create-inventario-ingrediente.dto';
import { UpdateInventarioIngredienteDto } from './dto/update-inventario-ingrediente.dto';
import { IngredienteService } from '../ingrediente/ingrediente.service';
import { NotificacionService } from '../notificacion/notificacion.service';
import { ConfiguracionService } from '../configuracion/configuracion.service';

@Injectable()
export class InventarioIngredienteService {
  constructor(
    @InjectRepository(InventarioIngrediente)
    private inventarioIngredienteRepository: Repository<InventarioIngrediente>,
    private ingredienteService: IngredienteService,
    private notificacionService: NotificacionService,
    private configuracionService: ConfiguracionService,
  ) {}

  async create(createDto: CreateInventarioIngredienteDto): Promise<InventarioIngrediente> {
    // Verificar que el ingrediente existe
    await this.ingredienteService.findOne(createDto.ingredienteId);

    // Verificar si ya existe un inventario para este ingrediente
    let inventario: InventarioIngrediente;
    try {
      inventario = await this.findByIngrediente(createDto.ingredienteId);
      // Si existe, actualizar con los nuevos valores
      Object.assign(inventario, createDto);
    } catch (error) {
      // Si no existe, crear uno nuevo
      inventario = this.inventarioIngredienteRepository.create(createDto);
    }

    const saved = await this.inventarioIngredienteRepository.save(inventario);

    // Verificar si necesita notificación
    await this.verificarYNotificar(saved);

    return saved;
  }

  async findAll(): Promise<InventarioIngrediente[]> {
    return this.inventarioIngredienteRepository.find({
      relations: ['ingrediente', 'ingrediente.unidadMedida'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<InventarioIngrediente> {
    const inventario = await this.inventarioIngredienteRepository.findOne({
      where: { id },
      relations: ['ingrediente', 'ingrediente.unidadMedida'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario de ingrediente con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async findByIngrediente(ingredienteId: string): Promise<InventarioIngrediente> {
    const inventario = await this.inventarioIngredienteRepository.findOne({
      where: { ingredienteId },
      relations: ['ingrediente', 'ingrediente.unidadMedida'],
    });

    if (!inventario) {
      throw new NotFoundException(
        `Inventario para ingrediente ${ingredienteId} no encontrado`,
      );
    }

    return inventario;
  }

  async update(
    id: string,
    updateDto: UpdateInventarioIngredienteDto,
  ): Promise<InventarioIngrediente> {
    const inventario = await this.findOne(id);
    Object.assign(inventario, updateDto);
    const saved = await this.inventarioIngredienteRepository.save(inventario);

    // Verificar si necesita notificación
    await this.verificarYNotificar(saved);

    return saved;
  }

  async remove(id: string): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioIngredienteRepository.remove(inventario);
  }

  async getInventarioBajo(): Promise<InventarioIngrediente[]> {
    const config = await this.configuracionService.getConfiguracion();
    const inventarios = await this.inventarioIngredienteRepository.find({
      relations: ['ingrediente', 'ingrediente.unidadMedida'],
    });

    return inventarios.filter(
      (inv) =>
        Number(inv.cantidad) <= Number(inv.cantidadMinima || config.cantidadMinimaGlobal),
    );
  }

  private async verificarYNotificar(inventario: InventarioIngrediente): Promise<void> {
    const config = await this.configuracionService.getConfiguracion();
    const cantidadMinima =
      Number(inventario.cantidadMinima) || config.cantidadMinimaGlobal;

    if (Number(inventario.cantidad) <= cantidadMinima && config.notificacionesActivas) {
      // Crear notificación personalizada para ingredientes
      await this.notificacionService.enviarNotificacionPersonalizada(
        'Alerta de Inventario de Ingrediente',
        `⚠️ Inventario bajo: ${inventario.ingrediente.nombre}. Cantidad: ${inventario.cantidad} ${inventario.ingrediente.unidadMedida.abreviatura || inventario.ingrediente.unidadMedida.nombre}`,
      );
    }
  }
}
