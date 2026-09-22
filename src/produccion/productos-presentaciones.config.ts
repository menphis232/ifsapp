export type TipoPresentacion = 'kilo' | 'medio_kilo' | 'tres_kilos';

export interface PresentacionConfig {
  tipo: TipoPresentacion;
  capacidadKg: number;
  label: string;
}

export interface ProductoPresentacionesConfig {
  formulaId: string;
  nombre: string;
  presentaciones: PresentacionConfig[];
}

/** Fuente única de presentaciones por producto (envases, etiquetas y fórmulas). */
export const PRODUCTOS_PRESENTACIONES: ProductoPresentacionesConfig[] = [
  {
    formulaId: 'massgainer-001',
    nombre: 'Mass Gainer',
    presentaciones: [{ tipo: 'tres_kilos', capacidadKg: 3, label: '3 kg' }],
  },
  {
    formulaId: 'bcaaa-001',
    nombre: 'BCAAA',
    presentaciones: [{ tipo: 'medio_kilo', capacidadKg: 0.5, label: '500 g' }],
  },
  {
    formulaId: 'creatina-001',
    nombre: 'Creatina',
    presentaciones: [
      { tipo: 'kilo', capacidadKg: 1, label: '1 kg' },
      { tipo: 'medio_kilo', capacidadKg: 0.5, label: '500 g' },
    ],
  },
  {
    formulaId: 'proteina-chocolate-001',
    nombre: 'Proteína de Chocolate',
    presentaciones: [
      { tipo: 'kilo', capacidadKg: 1, label: '1 kg' },
      { tipo: 'medio_kilo', capacidadKg: 0.5, label: '500 g' },
    ],
  },
  {
    formulaId: 'proteina-vainilla-001',
    nombre: 'Proteína de Vainilla',
    presentaciones: [
      { tipo: 'kilo', capacidadKg: 1, label: '1 kg' },
      { tipo: 'medio_kilo', capacidadKg: 0.5, label: '500 g' },
    ],
  },
];

export function getPresentacionesProducto(formulaId: string): PresentacionConfig[] {
  return (
    PRODUCTOS_PRESENTACIONES.find((p) => p.formulaId === formulaId)?.presentaciones ?? [
      { tipo: 'kilo', capacidadKg: 1, label: '1 kg' },
      { tipo: 'medio_kilo', capacidadKg: 0.5, label: '500 g' },
    ]
  );
}
