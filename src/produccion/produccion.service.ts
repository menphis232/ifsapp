import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produccion } from './entities/produccion.entity';
import { ProduccionPote } from './entities/produccion-pote.entity';
import { CrearProduccionDto } from './dto/crear-produccion.dto';
import { InventarioIngredienteService } from '../inventario-ingrediente/inventario-ingrediente.service';
import { InventarioEnvaseService } from '../inventario-envase/inventario-envase.service';
import { InventarioEtiquetaService } from '../inventario-etiqueta/inventario-etiqueta.service';
import { EnvaseService } from '../envase/envase.service';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { IngredienteService } from '../ingrediente/ingrediente.service';
import { FormulasHardcodeadasService } from './formulas-hardcodeadas.service';
import { NotificacionService } from '../notificacion/notificacion.service';
import { convertirCantidad } from '../common/utils/unidad-medida.util';

@Injectable()
export class ProduccionService {
  constructor(
    @InjectRepository(Produccion)
    private produccionRepository: Repository<Produccion>,
    @InjectRepository(ProduccionPote)
    private produccionPoteRepository: Repository<ProduccionPote>,
    private inventarioIngredienteService: InventarioIngredienteService,
    private inventarioEnvaseService: InventarioEnvaseService,
    private inventarioEtiquetaService: InventarioEtiquetaService,
    private envaseService: EnvaseService,
    private etiquetaService: EtiquetaService,
    private ingredienteService: IngredienteService,
    private formulasHardcodeadasService: FormulasHardcodeadasService,
    private notificacionService: NotificacionService,
  ) {}

  async verificarDisponibilidad(formulaId: string): Promise<{
    disponible: boolean;
    faltantes: Array<{ ingrediente: string; disponible: number; requerido: number }>;
  }> {
    // Obtener fórmula hardcodeada (sin exponer detalles)
    const formula = this.formulasHardcodeadasService.getFormulaPorId(formulaId);
    if (!formula) {
      throw new BadRequestException(`Fórmula con ID ${formulaId} no encontrada`);
    }

    const faltantes: Array<{ ingrediente: string; disponible: number; requerido: number }> = [];

    // Buscar ingredientes por nombre y verificar inventario
    for (const ingredienteFormula of formula.ingredientes) {
      try {
        // Buscar el ingrediente por nombre
        const ingredientes = await this.ingredienteService.findAll();
        const ingrediente = ingredientes.find(
          ing => ing.nombre.toLowerCase() === ingredienteFormula.nombreIngrediente.toLowerCase()
        );

        if (!ingrediente) {
          faltantes.push({
            ingrediente: ingredienteFormula.nombreIngrediente,
            disponible: 0,
            requerido: ingredienteFormula.cantidadRequerida,
          });
          continue;
        }

        // Verificar inventario
        try {
          const inventario = await this.inventarioIngredienteService.findByIngrediente(
            ingrediente.id,
          );
          const unidadStock =
            ingrediente.unidadMedida?.nombre ||
            ingrediente.unidadMedida?.abreviatura ||
            '';
          const disponible = Number(inventario.cantidad);
          const requerido = convertirCantidad(
            Number(ingredienteFormula.cantidadRequerida),
            ingredienteFormula.unidadMedida,
            unidadStock,
          );

          if (disponible < requerido) {
            faltantes.push({
              ingrediente: ingredienteFormula.nombreIngrediente,
              disponible,
              requerido,
            });
          }
        } catch (error) {
          faltantes.push({
            ingrediente: ingredienteFormula.nombreIngrediente,
            disponible: 0,
            requerido: ingredienteFormula.cantidadRequerida,
          });
        }
      } catch (error) {
        faltantes.push({
          ingrediente: ingredienteFormula.nombreIngrediente,
          disponible: 0,
          requerido: ingredienteFormula.cantidadRequerida,
        });
      }
    }

    return {
      disponible: faltantes.length === 0,
      faltantes,
    };
  }

  async calcularPotes(
    formulaId: string,
    potesPrincipalesSolicitados: number,
  ): Promise<{
    items: Array<{ tipo: string; capacidadKg: number; cantidad: number; label: string }>;
    potes1kg: number;
    potesMedioKg: number;
    potes3kg: number;
    resto: number;
    presentaciones: Array<{ tipo: string; capacidadKg: number; label: string }>;
  }> {
    const formula = this.formulasHardcodeadasService.getFormulaPorId(formulaId);
    if (!formula) {
      throw new BadRequestException(`Fórmula con ID ${formulaId} no encontrada`);
    }

    const presentaciones = [...formula.presentaciones].sort(
      (a, b) => b.capacidadKg - a.capacidadKg,
    );
    const cantidadTotalKg = formula.cantidadTotalKg;
    const principal = presentaciones[0];
    const potesPrincipales = Math.max(0, Number(potesPrincipalesSolicitados) || 0);

    let resto = cantidadTotalKg - potesPrincipales * principal.capacidadKg;
    const items: Array<{ tipo: string; capacidadKg: number; cantidad: number; label: string }> = [
      {
        tipo: principal.tipo,
        capacidadKg: principal.capacidadKg,
        cantidad: potesPrincipales,
        label: principal.label,
      },
    ];

    for (const p of presentaciones.slice(1)) {
      const cantidad = resto > 0 ? Math.floor(resto / p.capacidadKg) : 0;
      items.push({
        tipo: p.tipo,
        capacidadKg: p.capacidadKg,
        cantidad,
        label: p.label,
      });
      resto -= cantidad * p.capacidadKg;
    }

    const byTipo = (tipo: string) => items.find((i) => i.tipo === tipo)?.cantidad || 0;

    return {
      items,
      potes1kg: byTipo('kilo'),
      potesMedioKg: byTipo('medio_kilo'),
      potes3kg: byTipo('tres_kilos'),
      resto: Math.max(0, Math.round(resto * 1000) / 1000),
      presentaciones,
    };
  }

  async verificarEnvasesYEtiquetas(
    formulaId: string,
    potes1kg: number,
    potesMedioKg: number,
    potes3kg = 0,
  ): Promise<{ disponible: boolean; mensajes: string[] }> {
    const mensajes: string[] = [];
    const cantidades: Record<string, number> = {
      kilo: potes1kg || 0,
      medio_kilo: potesMedioKg || 0,
      tres_kilos: potes3kg || 0,
    };
    const labels: Record<string, string> = {
      kilo: '1 kg',
      medio_kilo: '500 g',
      tres_kilos: '3 kg',
    };

    for (const [tipo, requerido] of Object.entries(cantidades)) {
      if (requerido <= 0) continue;

      const envases = await this.envaseService.findByFormulaAndTipo(formulaId, tipo);
      if (envases.length === 0) {
        mensajes.push(`No hay envases de ${labels[tipo]} de este producto en el inventario`);
      } else {
        try {
          const inv = await this.inventarioEnvaseService.findByEnvase(envases[0].id);
          if (Number(inv.cantidad) < requerido) {
            mensajes.push(
              `No hay suficientes envases de ${labels[tipo]}. Disponible: ${inv.cantidad}, Requerido: ${requerido}`,
            );
          }
        } catch {
          mensajes.push(`No hay envases de ${labels[tipo]} de este producto en el inventario`);
        }
      }

      const etiquetas = await this.etiquetaService.findByFormulaAndTipo(formulaId, tipo);
      if (etiquetas.length === 0) {
        mensajes.push(`No hay etiquetas de ${labels[tipo]} de este producto en el inventario`);
      } else {
        try {
          const inv = await this.inventarioEtiquetaService.findByEtiqueta(etiquetas[0].id);
          if (Number(inv.cantidad) < requerido) {
            mensajes.push(
              `No hay suficientes etiquetas de ${labels[tipo]}. Disponible: ${inv.cantidad}, Requerido: ${requerido}`,
            );
          }
        } catch {
          mensajes.push(`No hay etiquetas de ${labels[tipo]} de este producto en el inventario`);
        }
      }
    }

    return {
      disponible: mensajes.length === 0,
      mensajes,
    };
  }

  async crearProduccion(crearProduccionDto: CrearProduccionDto): Promise<Produccion> {
    // Obtener fórmula hardcodeada (sin exponer detalles)
    const formula = this.formulasHardcodeadasService.getFormulaPorId(crearProduccionDto.formulaId);
    if (!formula) {
      throw new BadRequestException(`Fórmula con ID ${crearProduccionDto.formulaId} no encontrada`);
    }

    // 1. Verificar disponibilidad de ingredientes
    const disponibilidad = await this.verificarDisponibilidad(crearProduccionDto.formulaId);
    if (!disponibilidad.disponible) {
      throw new BadRequestException({
        message: 'No hay suficiente inventario de ingredientes',
        faltantes: disponibilidad.faltantes,
      });
    }

    // 2. Calcular cantidad total producida desde la fórmula hardcodeada
    const cantidadTotalKg = formula.cantidadTotalKg;

    // 3. Calcular potes según presentaciones del producto
    const calculoPotes = await this.calcularPotes(
      crearProduccionDto.formulaId,
      crearProduccionDto.potes1kg,
    );

    const potes1kg = calculoPotes.potes1kg;
    const potesMedioKg =
      crearProduccionDto.potesMedioKg ?? calculoPotes.potesMedioKg;
    const potes3kg = crearProduccionDto.potes3kg ?? calculoPotes.potes3kg;

    // 4. Verificar envases y etiquetas del producto
    const verificacion = await this.verificarEnvasesYEtiquetas(
      crearProduccionDto.formulaId,
      potes1kg,
      potesMedioKg,
      potes3kg,
    );
    if (!verificacion.disponible) {
      throw new BadRequestException({
        message: 'No hay suficientes envases o etiquetas',
        detalles: verificacion.mensajes,
      });
    }

    // 5. Crear registro de producción (sin guardar la fórmula completa, solo el ID)
    const produccion = this.produccionRepository.create({
      formulaId: crearProduccionDto.formulaId,
      cantidadTotalProducida: cantidadTotalKg,
      potes1kg,
      potesMedioKg,
      potes3kg,
      notas: crearProduccionDto.notas,
    });

    const produccionGuardada = await this.produccionRepository.save(produccion);

    // 6. Crear registros individuales de potes
    let numeroPote = 1;
    for (let i = 0; i < potes3kg; i++) {
      const pote = this.produccionPoteRepository.create({
        produccionId: produccionGuardada.id,
        capacidad: 3.0,
        numeroPote: numeroPote++,
      });
      await this.produccionPoteRepository.save(pote);
    }
    for (let i = 0; i < potes1kg; i++) {
      const pote = this.produccionPoteRepository.create({
        produccionId: produccionGuardada.id,
        capacidad: 1.0,
        numeroPote: numeroPote++,
      });
      await this.produccionPoteRepository.save(pote);
    }
    for (let i = 0; i < potesMedioKg; i++) {
      const pote = this.produccionPoteRepository.create({
        produccionId: produccionGuardada.id,
        capacidad: 0.5,
        numeroPote: numeroPote++,
      });
      await this.produccionPoteRepository.save(pote);
    }

    // 7. Descontar ingredientes del inventario (usando fórmula hardcodeada)
    for (const ingredienteFormula of formula.ingredientes) {
      // Buscar ingrediente por nombre
      const ingredientes = await this.ingredienteService.findAll();
      const ingrediente = ingredientes.find(
        ing => ing.nombre.toLowerCase() === ingredienteFormula.nombreIngrediente.toLowerCase()
      );

      if (ingrediente) {
        try {
          const inventario = await this.inventarioIngredienteService.findByIngrediente(
            ingrediente.id,
          );
          const unidadStock =
            ingrediente.unidadMedida?.nombre ||
            ingrediente.unidadMedida?.abreviatura ||
            '';
          const requerido = convertirCantidad(
            Number(ingredienteFormula.cantidadRequerida),
            ingredienteFormula.unidadMedida,
            unidadStock,
          );
          const nuevaCantidad = Number(inventario.cantidad) - requerido;
          
          await this.inventarioIngredienteService.update(inventario.id, {
            cantidad: nuevaCantidad,
          });
        } catch (error) {
          console.error(`Error descontando ${ingredienteFormula.nombreIngrediente}:`, error);
        }
      }
    }

    // 8. Descontar envases del producto
    const descontarEnvase = async (tipo: string, cantidad: number) => {
      if (cantidad <= 0) return;
      const lista = await this.envaseService.findByFormulaAndTipo(
        crearProduccionDto.formulaId,
        tipo,
      );
      if (lista.length > 0) {
        await this.inventarioEnvaseService.descontar(lista[0].id, cantidad);
      }
    };
    await descontarEnvase('tres_kilos', potes3kg);
    await descontarEnvase('kilo', potes1kg);
    await descontarEnvase('medio_kilo', potesMedioKg);

    // 9. Descontar etiquetas del producto
    const descontarEtiqueta = async (tipo: string, cantidad: number) => {
      if (cantidad <= 0) return;
      const lista = await this.etiquetaService.findByFormulaAndTipo(
        crearProduccionDto.formulaId,
        tipo,
      );
      if (lista.length > 0) {
        await this.inventarioEtiquetaService.descontar(lista[0].id, cantidad);
      }
    };
    await descontarEtiqueta('tres_kilos', potes3kg);
    await descontarEtiqueta('kilo', potes1kg);
    await descontarEtiqueta('medio_kilo', potesMedioKg);

    const formulaInfo = this.formulasHardcodeadasService.getFormulaPorId(crearProduccionDto.formulaId);
    const resumenPotes = [
      potes3kg > 0 ? `${potes3kg} potes 3kg` : null,
      potes1kg > 0 ? `${potes1kg} potes 1kg` : null,
      potesMedioKg > 0 ? `${potesMedioKg} potes 500g` : null,
    ]
      .filter(Boolean)
      .join(', ');
    this.notificacionService
      .enviarNotificacionPersonalizada(
        'Nueva mezcla/producción',
        `Producción: ${formulaInfo?.nombre || crearProduccionDto.formulaId} - ${resumenPotes || 'sin potes'}`,
      )
      .catch(() => {});

    return this.findOne(produccionGuardada.id);
  }

  async findAll(): Promise<Produccion[]> {
    const producciones = await this.produccionRepository.find({
      relations: ['potes'],
      order: { fechaProduccion: 'DESC' },
    });

    // Agregar información básica de la fórmula (sin ingredientes, fórmula hardcodeada)
    return producciones.map(prod => {
      const formula = this.formulasHardcodeadasService.getFormulaPorId(prod.formulaId);
      return {
        ...prod,
        formula: formula ? {
          id: formula.id,
          nombre: formula.nombre,
          descripcion: formula.descripcion,
        } : null,
      };
    }) as Produccion[];
  }

  async findOne(id: string): Promise<Produccion> {
    const produccion = await this.produccionRepository.findOne({
      where: { id },
      relations: ['potes'],
    });

    if (!produccion) {
      throw new BadRequestException(`Producción con ID ${id} no encontrada`);
    }

    // Agregar información básica de la fórmula (sin ingredientes)
    const formula = this.formulasHardcodeadasService.getFormulaPorId(produccion.formulaId);
    return {
      ...produccion,
      formula: formula ? {
        id: formula.id,
        nombre: formula.nombre,
        descripcion: formula.descripcion,
      } : null,
    } as any;
  }
}
