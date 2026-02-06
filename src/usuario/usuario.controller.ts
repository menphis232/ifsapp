import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from './entities/usuario.entity';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create({
      email: dto.email,
      password: dto.password,
      nombre: dto.nombre,
      rol: dto.rol,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, {
      nombre: dto.nombre,
      rol: dto.rol,
      password: dto.password,
    });
  }
}
