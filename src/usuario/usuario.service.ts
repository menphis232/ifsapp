import { Injectable, OnModuleInit, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    await this.crearAdminSiNoExiste();
  }

  private async crearAdminSiNoExiste() {
    const existe = await this.usuarioRepository.findOne({
      where: { email: 'admin@ifsnutrition.com' },
    });
    if (!existe) {
      const hash = await bcrypt.hash('12345678', 10);
      await this.usuarioRepository.save({
        email: 'admin@ifsnutrition.com',
        passwordHash: hash,
        rol: RolUsuario.ADMIN,
        nombre: 'Administrador',
      });
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }

  async findOne(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'email', 'rol', 'nombre', 'createdAt'],
    });
  }

  async findAll(): Promise<{ id: string; email: string; nombre: string | null; rol: RolUsuario; createdAt: Date }[]> {
    const users = await this.usuarioRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'nombre', 'rol', 'createdAt'],
    });
    return users;
  }

  async create(data: { email: string; password: string; nombre?: string; rol?: RolUsuario }): Promise<{ id: string; email: string; nombre: string | null; rol: RolUsuario; createdAt: Date }> {
    const existente = await this.usuarioRepository.findOne({ where: { email: data.email } });
    if (existente) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }
    const hash = await bcrypt.hash(data.password, 10);
    const usuario = this.usuarioRepository.create({
      email: data.email,
      passwordHash: hash,
      nombre: data.nombre ?? null,
      rol: data.rol ?? RolUsuario.EMPLEADO,
    });
    const saved = await this.usuarioRepository.save(usuario);
    return {
      id: saved.id,
      email: saved.email,
      nombre: saved.nombre,
      rol: saved.rol,
      createdAt: saved.createdAt,
    };
  }

  async update(
    id: string,
    data: { nombre?: string; rol?: RolUsuario; password?: string },
  ): Promise<{ id: string; email: string; nombre: string | null; rol: RolUsuario; createdAt: Date }> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (data.nombre !== undefined) usuario.nombre = data.nombre;
    if (data.rol !== undefined) usuario.rol = data.rol;
    if (data.password) {
      usuario.passwordHash = await bcrypt.hash(data.password, 10);
    }
    const saved = await this.usuarioRepository.save(usuario);
    return {
      id: saved.id,
      email: saved.email,
      nombre: saved.nombre,
      rol: saved.rol,
      createdAt: saved.createdAt,
    };
  }

  async validarClave(usuario: Usuario, password: string): Promise<boolean> {
    return bcrypt.compare(password, usuario.passwordHash);
  }
}
