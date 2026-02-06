# Seguridad de Fórmulas

## ⚠️ IMPORTANTE: Fórmulas Hardcodeadas

Las fórmulas de producción están **hardcodeadas** en el backend para proteger la propiedad intelectual y evitar que sean robadas o copiadas.

### Ubicación

Las fórmulas están definidas en:
```
backend/src/produccion/formulas-hardcodeadas.service.ts
```

### Protección Implementada

1. **Backend Only**: Las fórmulas solo existen en el código del servidor
2. **No se Exponen al Frontend**: El frontend solo recibe:
   - ID de la fórmula
   - Nombre del producto
   - Descripción (opcional)
   - **NO recibe ingredientes ni cantidades**

3. **Verificación Interna**: El backend busca ingredientes por nombre y verifica inventario internamente

4. **Sin Endpoints de Lectura**: No hay endpoints que permitan leer los detalles completos de las fórmulas

### Agregar Nuevas Fórmulas

Para agregar una nueva fórmula protegida:

1. Editar `formulas-hardcodeadas.service.ts`
2. Agregar al array `formulas`:
```typescript
{
  id: 'producto-002',
  nombre: 'Nombre del Producto',
  descripcion: 'Descripción opcional',
  cantidadTotalKg: 100, // Total en kilos
  ingredientes: [
    { nombreIngrediente: 'Ingrediente 1', cantidadRequerida: 10, unidadMedida: 'kilo' },
    { nombreIngrediente: 'Ingrediente 2', cantidadRequerida: 5, unidadMedida: 'saco' },
    // ...
  ],
}
```

3. Los ingredientes deben existir en la base de datos con el mismo nombre (case-insensitive)

### Seguridad Adicional Recomendada

- ✅ No commitear este archivo en repositorios públicos
- ✅ Usar variables de entorno para fórmulas sensibles
- ✅ Implementar autenticación y autorización
- ✅ Limitar acceso al código fuente del backend
- ✅ Usar encriptación para fórmulas muy sensibles

### Nota

El sistema busca ingredientes por nombre. Asegúrate de que los nombres en la base de datos coincidan exactamente con los nombres en las fórmulas hardcodeadas (case-insensitive).
