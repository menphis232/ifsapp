import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushToken } from './entities/push-token.entity';
import { RolUsuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class PushService {
  constructor(
    @InjectRepository(PushToken)
    private pushTokenRepository: Repository<PushToken>,
  ) {}

  async register(usuarioId: string, token: string, platform?: string): Promise<void> {
    const existing = await this.pushTokenRepository.findOne({
      where: { usuarioId, token },
    });
    if (existing) return;
    const record = this.pushTokenRepository.create({
      usuarioId,
      token,
      platform: platform || null,
    });
    await this.pushTokenRepository.save(record);
  }

  async getTokensForAdmin(): Promise<string[]> {
    const tokens = await this.pushTokenRepository
      .createQueryBuilder('pt')
      .innerJoin('pt.usuario', 'u')
      .where('u.rol = :rol', { rol: RolUsuario.ADMIN })
      .select('pt.token')
      .getMany();
    return tokens.map((t) => t.token).filter(Boolean);
  }
}
