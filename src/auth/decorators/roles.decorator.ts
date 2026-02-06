import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../usuario/entities/usuario.entity';
import { ROLES_KEY } from '../guards/roles.guard';

export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
