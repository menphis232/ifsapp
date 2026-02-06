import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SistemaLogService } from './sistema-log.service';

const PATH_TO_MODULO: Record<string, string> = {
  mobiliarios: 'Mobiliarios',
  inventarios: 'Inventario',
  inventario: 'Inventario',
  reportes: 'Reportes',
  configuracion: 'Configuración',
  ingredientes: 'Ingredientes',
  formulas: 'Fórmulas',
  'inventario-ingredientes': 'Inv. Ingredientes',
  'inventario-envases': 'Inv. Envases',
  'inventario-etiquetas': 'Inv. Etiquetas',
  'inventario-envases-etiquetas': 'Inv. Envases y Etiquetas',
  produccion: 'Producción',
  envases: 'Envases',
  etiquetas: 'Etiquetas',
  'unidades-medida': 'Unidades de medida',
  archivos: 'Archivos',
};

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private sistemaLogService: SistemaLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const path = request.route?.path || request.url?.split('?')[0] || '';

    return next.handle().pipe(
      tap(() => {
        if (!user?.id) return;
        const accion = this.mapMethodToAccion(method);
        if (!accion) return;
        const modulo = this.pathToModulo(path);
        this.sistemaLogService
          .registrar(user.id, accion, modulo)
          .catch((err) => console.error('Error registrando log:', err));
      }),
    );
  }

  private mapMethodToAccion(method: string): string | null {
    const map: Record<string, string> = {
      POST: 'Crear',
      PATCH: 'Actualizar',
      PUT: 'Actualizar',
      DELETE: 'Eliminar',
    };
    return map[method] || null;
  }

  private pathToModulo(path: string): string {
    const segment = (path.split('/').filter(Boolean)[0] || '').toLowerCase();
    return PATH_TO_MODULO[segment] || segment || 'Sistema';
  }
}
