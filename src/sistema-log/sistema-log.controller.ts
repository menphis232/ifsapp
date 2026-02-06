import { Controller, Get, UseGuards } from '@nestjs/common';
import { SistemaLogService } from './sistema-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';

@Controller('sistema-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
export class SistemaLogController {
  constructor(private sistemaLogService: SistemaLogService) {}

  @Get()
  findAll() {
    return this.sistemaLogService.findAll();
  }
}
