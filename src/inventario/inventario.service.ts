import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { MobiliarioService } from '../mobiliario/mobiliario.service';
import { NotificacionService } from '../notificacion/notificacion.service';
import { ConfiguracionService } from '../configuracion/configuracion.service';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    private mobiliarioService: MobiliarioService,
    private notificacionService: NotificacionService,
    private configuracionService: ConfiguracionService,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    // Verificar que el mobiliario existe
    await this.mobiliarioService.findOne(createInventarioDto.mobiliarioId);

    // Verificar si ya existe un inventario para este mobiliario
    let inventario: Inventario;
    try {
      inventario = await this.findByMobiliario(createInventarioDto.mobiliarioId);
      // Si existe, actualizar con los nuevos valores
      Object.assign(inventario, createInventarioDto);
    } catch (error) {
      // Si no existe, crear uno nuevo
      inventario = this.inventarioRepository.create(createInventarioDto);
    }

    const saved = await this.inventarioRepository.save(inventario);

    // Verificar si necesita notificación
    await this.verificarYNotificar(saved);

    return saved;
  }

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      relations: ['mobiliario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['mobiliario'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async findByMobiliario(mobiliarioId: string): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { mobiliarioId },
      relations: ['mobiliario'],
    });

    if (!inventario) {
      throw new NotFoundException(
        `Inventario para mobiliario ${mobiliarioId} no encontrado`,
      );
    }

    return inventario;
  }

  async update(
    id: string,
    updateInventarioDto: UpdateInventarioDto,
  ): Promise<Inventario> {
    const inventario = await this.findOne(id);
    Object.assign(inventario, updateInventarioDto);
    const saved = await this.inventarioRepository.save(inventario);

    // Verificar si necesita notificación
    await this.verificarYNotificar(saved);

    return saved;
  }

  async remove(id: string): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioRepository.remove(inventario);
  }

  async updateByCodigo(
    codigo: string,
    cantidad: number,
  ): Promise<Inventario> {
    const mobiliario = await this.mobiliarioService.findByCodigo(codigo);
    let inventario: Inventario;

    try {
      inventario = await this.findByMobiliario(mobiliario.id);
      inventario.cantidad = cantidad;
    } catch (error) {
      // Si no existe, crear uno nuevo
      inventario = this.inventarioRepository.create({
        mobiliarioId: mobiliario.id,
        cantidad,
      });
    }

    const saved = await this.inventarioRepository.save(inventario);
    await this.verificarYNotificar(saved);

    return saved;
  }

  async getInventarioBajo(): Promise<Inventario[]> {
    const config = await this.configuracionService.getConfiguracion();
    const inventarios = await this.inventarioRepository.find({
      relations: ['mobiliario'],
    });

    return inventarios.filter(
      (inv) =>
        inv.cantidad <= (inv.cantidadMinima || config.cantidadMinimaGlobal),
    );
  }

  private async verificarYNotificar(inventario: Inventario): Promise<void> {
    const config = await this.configuracionService.getConfiguracion();
    const cantidadMinima =
      inventario.cantidadMinima || config.cantidadMinimaGlobal;

    if (inventario.cantidad <= cantidadMinima && config.notificacionesActivas) {
      await this.notificacionService.enviarNotificacionInventarioBajo(
        inventario,
      );
    }
  }
}

