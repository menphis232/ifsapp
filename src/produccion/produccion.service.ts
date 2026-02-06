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
          const disponible = Number(inventario.cantidad);
          const requerido = ingredienteFormula.cantidadRequerida;

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
    potes1kgSolicitados: number,
  ): Promise<{ potes1kg: number; potesMedioKg: number; resto: number }> {
    const cantidadTotalKg = this.formulasHardcodeadasService.getCantidadTotalKg(formulaId);
    const totalKg1kg = potes1kgSolicitados * 1.0;
    const resto = cantidadTotalKg - totalKg1kg;

    let potesMedioKg = 0;
    if (resto > 0) {
      potesMedioKg = Math.floor(resto / 0.5);
    }

    const restoFinal = resto - potesMedioKg * 0.5;

    return {
      potes1kg: potes1kgSolicitados,
      potesMedioKg,
      resto: restoFinal,
    };
  }

  async verificarEnvasesYEtiquetas(
    formulaId: string,
    potes1kg: number,
    potesMedioKg: number,
  ): Promise<{ disponible: boolean; mensajes: string[] }> {
    const mensajes: string[] = [];

    // Envases del producto (presentación 1kg y 500g)
    const envases1kg = await this.envaseService.findByFormulaAndTipo(formulaId, 'kilo');
    const envasesMedioKg = await this.envaseService.findByFormulaAndTipo(formulaId, 'medio_kilo');

    if (envases1kg.length === 0 && potes1kg > 0) {
      mensajes.push('No hay envases de 1kg de este producto en el inventario');
    } else if (potes1kg > 0) {
      try {
        const invEnvase1kg = await this.inventarioEnvaseService.findByEnvase(envases1kg[0].id);
        if (invEnvase1kg.cantidad < potes1kg) {
          mensajes.push(
            `No hay suficientes envases de 1kg. Disponible: ${invEnvase1kg.cantidad}, Requerido: ${potes1kg}`,
          );
        }
      } catch (error) {
        mensajes.push('No hay envases de 1kg de este producto en el inventario');
      }
    }

    if (envasesMedioKg.length === 0 && potesMedioKg > 0) {
      mensajes.push('No hay envases de 0.5kg de este producto en el inventario');
    } else if (potesMedioKg > 0) {
      try {
        const invEnvaseMedioKg = await this.inventarioEnvaseService.findByEnvase(
          envasesMedioKg[0].id,
        );
        if (invEnvaseMedioKg.cantidad < potesMedioKg) {
          mensajes.push(
            `No hay suficientes envases de 0.5kg. Disponible: ${invEnvaseMedioKg.cantidad}, Requerido: ${potesMedioKg}`,
          );
        }
      } catch (error) {
        mensajes.push('No hay envases de 0.5kg de este producto en el inventario');
      }
    }

    // Etiquetas del producto
    const etiquetas1kg = await this.etiquetaService.findByFormulaAndTipo(formulaId, 'kilo');
    const etiquetasMedioKg = await this.etiquetaService.findByFormulaAndTipo(formulaId, 'medio_kilo');

    if (etiquetas1kg.length === 0 && potes1kg > 0) {
      mensajes.push('No hay etiquetas de 1kg de este producto en el inventario');
    } else if (potes1kg > 0) {
      try {
        const invEtiqueta1kg = await this.inventarioEtiquetaService.findByEtiqueta(
          etiquetas1kg[0].id,
        );
        if (invEtiqueta1kg.cantidad < potes1kg) {
          mensajes.push(
            `No hay suficientes etiquetas de 1kg. Disponible: ${invEtiqueta1kg.cantidad}, Requerido: ${potes1kg}`,
          );
        }
      } catch (error) {
        mensajes.push('No hay etiquetas de 1kg de este producto en el inventario');
      }
    }

    if (etiquetasMedioKg.length === 0 && potesMedioKg > 0) {
      mensajes.push('No hay etiquetas de 0.5kg de este producto en el inventario');
    } else if (potesMedioKg > 0) {
      try {
        const invEtiquetaMedioKg = await this.inventarioEtiquetaService.findByEtiqueta(
          etiquetasMedioKg[0].id,
        );
        if (invEtiquetaMedioKg.cantidad < potesMedioKg) {
          mensajes.push(
            `No hay suficientes etiquetas de 0.5kg. Disponible: ${invEtiquetaMedioKg.cantidad}, Requerido: ${potesMedioKg}`,
          );
        }
      } catch (error) {
        mensajes.push('No hay etiquetas de 0.5kg de este producto en el inventario');
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

    // 3. Calcular potes
    const calculoPotes = await this.calcularPotes(
      crearProduccionDto.formulaId,
      crearProduccionDto.potes1kg,
    );

    const potes1kg = calculoPotes.potes1kg;
    const potesMedioKg =
      crearProduccionDto.potesMedioKg || calculoPotes.potesMedioKg;

    // 4. Verificar envases y etiquetas del producto
    const verificacion = await this.verificarEnvasesYEtiquetas(
      crearProduccionDto.formulaId,
      potes1kg,
      potesMedioKg,
    );
    if (!verificacion.disponible) {
      throw new BadRequestException({
        message: 'No hay suficientes envases o etiquetas',
        detalles: verificacion.mensajes,
      });
    }

    // 5. Crear registro de producción (sin guardar la fórmula completa, solo el ID)
    const produccion = this.produccionRepository.create({
      formulaId: crearProduccionDto.formulaId, // Solo guardamos el ID, no los detalles
      cantidadTotalProducida: cantidadTotalKg,
      potes1kg,
      potesMedioKg,
      notas: crearProduccionDto.notas,
    });

    const produccionGuardada = await this.produccionRepository.save(produccion);

    // 6. Crear registros individuales de potes
    let numeroPote = 1;
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
          const nuevaCantidad = Number(inventario.cantidad) - ingredienteFormula.cantidadRequerida;
          
          await this.inventarioIngredienteService.update(inventario.id, {
            cantidad: nuevaCantidad,
          });
        } catch (error) {
          console.error(`Error descontando ${ingredienteFormula.nombreIngrediente}:`, error);
        }
      }
    }

    // 8. Descontar envases del producto
    const envases1kgProd = await this.envaseService.findByFormulaAndTipo(crearProduccionDto.formulaId, 'kilo');
    if (envases1kgProd.length > 0 && potes1kg > 0) {
      await this.inventarioEnvaseService.descontar(envases1kgProd[0].id, potes1kg);
    }
    const envasesMedioKgProd = await this.envaseService.findByFormulaAndTipo(crearProduccionDto.formulaId, 'medio_kilo');
    if (envasesMedioKgProd.length > 0 && potesMedioKg > 0) {
      await this.inventarioEnvaseService.descontar(envasesMedioKgProd[0].id, potesMedioKg);
    }

    // 9. Descontar etiquetas del producto
    const etiquetas1kgProd = await this.etiquetaService.findByFormulaAndTipo(crearProduccionDto.formulaId, 'kilo');
    if (etiquetas1kgProd.length > 0 && potes1kg > 0) {
      await this.inventarioEtiquetaService.descontar(etiquetas1kgProd[0].id, potes1kg);
    }
    const etiquetasMedioKgProd = await this.etiquetaService.findByFormulaAndTipo(crearProduccionDto.formulaId, 'medio_kilo');
    if (etiquetasMedioKgProd.length > 0 && potesMedioKg > 0) {
      await this.inventarioEtiquetaService.descontar(etiquetasMedioKgProd[0].id, potesMedioKg);
    }

    const formulaInfo = this.formulasHardcodeadasService.getFormulaPorId(crearProduccionDto.formulaId);
    this.notificacionService
      .enviarNotificacionPersonalizada(
        'Nueva mezcla/producción',
        `Producción: ${formulaInfo?.nombre || crearProduccionDto.formulaId} - ${potes1kg} potes 1kg, ${potesMedioKg} potes 500g`,
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
