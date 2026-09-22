/** Normaliza nombres/abreviaturas de unidad para comparar (ej. "Gramo", "g", "gramos"). */
export function normalizarUnidad(valor?: string | null): string {
  if (!valor) return '';
  const v = valor.trim().toLowerCase();
  if (['g', 'gr', 'gramo', 'gramos'].includes(v)) return 'gramo';
  if (['kg', 'kilo', 'kilos', 'kilogramo', 'kilogramos'].includes(v)) return 'kilo';
  if (['l', 'lt', 'litro', 'litros'].includes(v)) return 'litro';
  if (['ml', 'mililitro', 'mililitros'].includes(v)) return 'mililitro';
  return v;
}

/**
 * Convierte una cantidad de una unidad a otra.
 * Soporta gramo↔kilo y mililitro↔litro. Si no hay conversión, devuelve la cantidad original.
 */
export function convertirCantidad(
  cantidad: number,
  desdeUnidad: string,
  haciaUnidad: string,
): number {
  const desde = normalizarUnidad(desdeUnidad);
  const hacia = normalizarUnidad(haciaUnidad);
  if (!desde || !hacia || desde === hacia) return cantidad;

  if (desde === 'gramo' && hacia === 'kilo') return cantidad / 1000;
  if (desde === 'kilo' && hacia === 'gramo') return cantidad * 1000;
  if (desde === 'mililitro' && hacia === 'litro') return cantidad / 1000;
  if (desde === 'litro' && hacia === 'mililitro') return cantidad * 1000;

  return cantidad;
}
