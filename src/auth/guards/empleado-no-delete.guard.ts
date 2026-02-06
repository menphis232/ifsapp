import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolUsuario } from '../../usuario/entities/usuario.entity';

@Injectable()
export class EmpleadoNoDeleteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    if (user?.rol === RolUsuario.EMPLEADO && (method === 'DELETE' || method === 'delete')) {
      throw new ForbiddenException('No tiene permiso para eliminar. Solo el administrador puede eliminar.');
    }
    return true;
  }
}
