import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { SistemaLogService } from '../sistema-log/sistema-log.service';
import { Usuario } from '../usuario/entities/usuario.entity';

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private sistemaLogService: SistemaLogService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioService.findByEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const valido = await this.usuarioService.validarClave(usuario, dto.password);
    if (!valido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    await this.sistemaLogService
      .registrar(usuario.id, 'Inicio de sesión', 'Auth')
      .catch(() => {});
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre || usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<Usuario | null> {
    return this.usuarioService.findOne(payload.sub);
  }
}
