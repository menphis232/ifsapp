import { Injectable } from '@nestjs/common';

export interface IngredienteFormula {
  nombreIngrediente: string;
  cantidadRequerida: number;
  unidadMedida: string; // 'saco', 'kilo', 'paquete', etc.
}

export interface FormulaHardcodeada {
  id: string;
  nombre: string;
  descripcion?: string;
  cantidadTotalKg: number;
  ingredientes: IngredienteFormula[];
}

@Injectable()
export class FormulasHardcodeadasService {
  // Fórmulas hardcodeadas - NO EXPONER AL FRONTEND
  private readonly formulas: FormulaHardcodeada[] = [
    {
      id: 'massgainer-001',
      nombre: 'Mass Gainer',
      descripcion: 'Presentación 1kg y 500g',
      cantidadTotalKg: 95,
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
      descripcion: 'Presentación 1kg y 500g',
      cantidadTotalKg: 50,
      ingredientes: [],
    },
    {
      id: 'proteina-chocolate-001',
      nombre: 'Proteína de Chocolate',
      descripcion: 'Presentación 1kg y 500g',
      cantidadTotalKg: 59,
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
      descripcion: 'Presentación 1kg y 500g',
      cantidadTotalKg: 58,
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
    return this.formulas.find(f => f.id === id) || null;
  }

  getTodasLasFormulas(): Array<{ id: string; nombre: string; descripcion?: string }> {
    // Solo retornar información básica, sin ingredientes
    return this.formulas.map(f => ({
      id: f.id,
      nombre: f.nombre,
      descripcion: f.descripcion,
    }));
  }

  getCantidadTotalKg(id: string): number {
    const formula = this.getFormulaPorId(id);
    return formula ? formula.cantidadTotalKg : 0;
  }
}
