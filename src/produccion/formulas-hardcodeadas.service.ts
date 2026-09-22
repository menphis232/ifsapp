import { Injectable } from '@nestjs/common';
import {
  getPresentacionesProducto,
  PresentacionConfig,
  TipoPresentacion,
} from './productos-presentaciones.config';

export interface IngredienteFormula {
  nombreIngrediente: string;
  cantidadRequerida: number;
  unidadMedida: string;
}

export type { TipoPresentacion, PresentacionConfig as PresentacionFormula };

export interface FormulaHardcodeada {
  id: string;
  nombre: string;
  descripcion?: string;
  cantidadTotalKg: number;
  presentaciones: PresentacionConfig[];
  ingredientes: IngredienteFormula[];
}

@Injectable()
export class FormulasHardcodeadasService {
  private readonly formulas: FormulaHardcodeada[] = [
    {
      id: 'massgainer-001',
      nombre: 'Mass Gainer',
      descripcion: 'Presentación solo pote 3 kg',
      cantidadTotalKg: 95,
      presentaciones: getPresentacionesProducto('massgainer-001'),
      ingredientes: [
        { nombreIngrediente: 'Suero de leche', cantidadRequerida: 1, unidadMedida: 'saco' },
        { nombreIngrediente: 'Endulzante', cantidadRequerida: 30, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Mochico de arroz', cantidadRequerida: 36, unidadMedida: 'paquete' },
        { nombreIngrediente: 'Cacao', cantidadRequerida: 8, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Goma xantan', cantidadRequerida: 2, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Maltodextrina', cantidadRequerida: 14, unidadMedida: 'kilo' },
      ],
    },
    {
      id: 'bcaaa-001',
      nombre: 'BCAAA',
      descripcion: 'Presentación solo pote 500 g',
      cantidadTotalKg: 50,
      presentaciones: getPresentacionesProducto('bcaaa-001'),
      ingredientes: [],
    },
    {
      id: 'creatina-001',
      nombre: 'Creatina',
      descripcion: 'Presentación potes 500 g y 1 kg',
      cantidadTotalKg: 30,
      presentaciones: getPresentacionesProducto('creatina-001'),
      ingredientes: [],
    },
    {
      id: 'proteina-chocolate-001',
      nombre: 'Proteína de Chocolate',
      descripcion: 'Presentación 1 kg y 500 g',
      cantidadTotalKg: 59,
      presentaciones: getPresentacionesProducto('proteina-chocolate-001'),
      ingredientes: [
        { nombreIngrediente: 'Suero de leche', cantidadRequerida: 1, unidadMedida: 'saco' },
        { nombreIngrediente: 'Endulzante', cantidadRequerida: 16, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Mochico de arroz', cantidadRequerida: 18, unidadMedida: 'paquete' },
        { nombreIngrediente: 'Cacao', cantidadRequerida: 6, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Goma xantan', cantidadRequerida: 2, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Maltodextrina', cantidadRequerida: 2, unidadMedida: 'kilo' },
      ],
    },
    {
      id: 'proteina-vainilla-001',
      nombre: 'Proteína de Vainilla',
      descripcion: 'Presentación 1 kg y 500 g',
      cantidadTotalKg: 58,
      presentaciones: getPresentacionesProducto('proteina-vainilla-001'),
      ingredientes: [
        { nombreIngrediente: 'Suero de leche', cantidadRequerida: 1, unidadMedida: 'saco' },
        { nombreIngrediente: 'Endulzante', cantidadRequerida: 16, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Mochico de arroz', cantidadRequerida: 18, unidadMedida: 'paquete' },
        { nombreIngrediente: 'Goma xantan', cantidadRequerida: 2, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Maltodextrina', cantidadRequerida: 2, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Vainilla', cantidadRequerida: 3, unidadMedida: 'kilo' },
        { nombreIngrediente: 'Pirosil', cantidadRequerida: 1200, unidadMedida: 'gramo' },
      ],
    },
  ];

  getFormulaPorId(id: string): FormulaHardcodeada | null {
    return this.formulas.find((f) => f.id === id) || null;
  }

  getTodasLasFormulas(): Array<{
    id: string;
    nombre: string;
    descripcion?: string;
    presentaciones: PresentacionConfig[];
    cantidadTotalKg: number;
  }> {
    return this.formulas.map((f) => ({
      id: f.id,
      nombre: f.nombre,
      descripcion: f.descripcion,
      presentaciones: f.presentaciones,
      cantidadTotalKg: f.cantidadTotalKg,
    }));
  }

  getCantidadTotalKg(id: string): number {
    const formula = this.getFormulaPorId(id);
    return formula ? formula.cantidadTotalKg : 0;
  }

  getPresentaciones(id: string): PresentacionConfig[] {
    return getPresentacionesProducto(id);
  }
}
