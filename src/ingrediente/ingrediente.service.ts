import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingrediente } from './entities/ingrediente.entity';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { UnidadMedidaService } from '../unidad-medida/unidad-medida.service';
import { InventarioIngrediente } from '../inventario-ingrediente/entities/inventario-ingrediente.entity';
import { convertirCantidad } from '../common/utils/unidad-medida.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IngredienteService {
  constructor(
    @InjectRepository(Ingrediente)
    private ingredienteRepository: Repository<Ingrediente>,
    @InjectRepository(InventarioIngrediente)
    private inventarioIngredienteRepository: Repository<InventarioIngrediente>,
    private unidadMedidaService: UnidadMedidaService,
  ) {}

  async create(createIngredienteDto: CreateIngredienteDto): Promise<Ingrediente> {
    await this.unidadMedidaService.findOne(createIngredienteDto.unidadMedidaId);

    const nombre = createIngredienteDto.nombre.trim();
    const existente = await this.findByNombreIgnoreCase(nombre);

    if (existente) {
      if (existente.activo) {
        throw new ConflictException(
          `Ya existe un ingrediente con el nombre "${existente.nombre}". No se permiten duplicados.`,
        );
      }

      // Reactivar el desactivado en lugar de crear otro
      await this.ingredienteRepository.update(existente.id, {
        nombre,
        descripcion: createIngredienteDto.descripcion ?? existente.descripcion,
        unidadMedidaId: createIngredienteDto.unidadMedidaId,
        codigo: createIngredienteDto.codigo ?? existente.codigo,
        activo: true,
      });
      return this.findOne(existente.id);
    }

    const codigo =
      createIngredienteDto.codigo || `ING-${uuidv4().substring(0, 8).toUpperCase()}`;

    const ingrediente = this.ingredienteRepository.create({
      ...createIngredienteDto,
      nombre,
      codigo,
      activo: createIngredienteDto.activo ?? true,
    });

    const saved = await this.ingredienteRepository.save(ingrediente);
    return this.findOne(saved.id);
  }

  async findAll(): Promise<Ingrediente[]> {
    return this.ingredienteRepository.find({
      where: { activo: true },
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
    const dto = { ...updateIngredienteDto };

    if (dto.nombre !== undefined) {
      dto.nombre = dto.nombre.trim();
      const otro = await this.findByNombreIgnoreCase(dto.nombre, id);
      if (otro?.activo) {
        throw new ConflictException(
          `Ya existe un ingrediente con el nombre "${otro.nombre}".`,
        );
      }
    }

    if (dto.unidadMedidaId) {
      const nuevaUnidad = await this.unidadMedidaService.findOne(dto.unidadMedidaId);
      const unidadAnterior = ingrediente.unidadMedida;

      if (
        unidadAnterior &&
        dto.unidadMedidaId !== ingrediente.unidadMedidaId
      ) {
        await this.convertirInventarioSiAplica(
          id,
          unidadAnterior.nombre || unidadAnterior.abreviatura,
          nuevaUnidad.nombre || nuevaUnidad.abreviatura,
        );
      }
    }

    // update() por columnas evita el pitfall TypeORM de relación cargada vs FK
    const { unidadMedida: _omit, ...rest } = dto as UpdateIngredienteDto & {
      unidadMedida?: unknown;
    };
    const patch = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(patch).length > 0) {
      await this.ingredienteRepository.update(id, patch);
    }
    return this.findOne(id);
  }

  /** Soft-delete: marca activo=false para no romper FKs de fórmulas/inventario. */
  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.ingredienteRepository.update(id, { activo: false });
  }

  private async findByNombreIgnoreCase(
    nombre: string,
    excludeId?: string,
  ): Promise<Ingrediente | null> {
    const qb = this.ingredienteRepository
      .createQueryBuilder('ing')
      .leftJoinAndSelect('ing.unidadMedida', 'unidadMedida')
      .where('LOWER(TRIM(ing.nombre)) = LOWER(:nombre)', {
        nombre: nombre.trim(),
      });

    if (excludeId) {
      qb.andWhere('ing.id != :excludeId', { excludeId });
    }

    return qb.getOne();
  }

  private async convertirInventarioSiAplica(
    ingredienteId: string,
    desdeUnidad: string,
    haciaUnidad: string,
  ): Promise<void> {
    const inventarios = await this.inventarioIngredienteRepository.find({
      where: { ingredienteId },
    });

    for (const inv of inventarios) {
      const cantidad = convertirCantidad(
        Number(inv.cantidad),
        desdeUnidad,
        haciaUnidad,
      );
      const cantidadMinima = convertirCantidad(
        Number(inv.cantidadMinima),
        desdeUnidad,
        haciaUnidad,
      );
      await this.inventarioIngredienteRepository.update(inv.id, {
        cantidad: Math.round(cantidad * 100) / 100,
        cantidadMinima: Math.round(cantidadMinima * 100) / 100,
      });
    }
  }
}
