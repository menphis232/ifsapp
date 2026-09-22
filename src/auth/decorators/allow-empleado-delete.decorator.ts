import { SetMetadata } from '@nestjs/common';

export const ALLOW_EMPLEADO_DELETE_KEY = 'allowEmpleadoDelete';

/** Permite que el rol empleado ejecute DELETE (p. ej. soft-delete reversible). */
export const AllowEmpleadoDelete = () => SetMetadata(ALLOW_EMPLEADO_DELETE_KEY, true);
