import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../usuario/entities/usuario.entity';
import { ALLOW_EMPLEADO_DELETE_KEY } from '../decorators/allow-empleado-delete.decorator';

@Injectable()
export class EmpleadoNoDeleteGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;

    if (user?.rol !== RolUsuario.EMPLEADO) {
      return true;
    }

    if (method !== 'DELETE' && method !== 'delete') {
      return true;
    }

    const allowEmpleadoDelete = this.reflector.getAllAndOverride<boolean>(
      ALLOW_EMPLEADO_DELETE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (allowEmpleadoDelete) {
      return true;
    }

    throw new ForbiddenException(
      'No tiene permiso para eliminar. Solo el administrador puede eliminar.',
    );
  }
}
