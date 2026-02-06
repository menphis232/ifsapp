import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mobiliario } from './entities/mobiliario.entity';
import { CreateMobiliarioDto } from './dto/create-mobiliario.dto';
import { UpdateMobiliarioDto } from './dto/update-mobiliario.dto';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MobiliarioService {
  constructor(
    @InjectRepository(Mobiliario)
    private mobiliarioRepository: Repository<Mobiliario>,
  ) {}

  async create(createMobiliarioDto: CreateMobiliarioDto): Promise<Mobiliario> {
    const codigo = createMobiliarioDto.codigo || `MB-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const mobiliario = this.mobiliarioRepository.create({
      ...createMobiliarioDto,
      codigo,
    });

    const savedMobiliario = await this.mobiliarioRepository.save(mobiliario);

    // Generar QR Code
    const qrData = JSON.stringify({
      id: savedMobiliario.id,
      codigo: savedMobiliario.codigo,
      nombre: savedMobiliario.nombre,
    });

    const qrCode = await QRCode.toDataURL(qrData);
    savedMobiliario.qrCode = qrCode;

    return this.mobiliarioRepository.save(savedMobiliario);
  }

  async findAll(): Promise<Mobiliario[]> {
    return this.mobiliarioRepository.find({
      relations: ['inventarios', 'reportes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Mobiliario> {
    const mobiliario = await this.mobiliarioRepository.findOne({
      where: { id },
      relations: ['inventarios', 'reportes'],
    });

    if (!mobiliario) {
      throw new NotFoundException(`Mobiliario con ID ${id} no encontrado`);
    }

    return mobiliario;
  }

  async findByCodigo(codigo: string): Promise<Mobiliario> {
    const mobiliario = await this.mobiliarioRepository.findOne({
      where: { codigo },
      relations: ['inventarios', 'reportes'],
    });

    if (!mobiliario) {
      throw new NotFoundException(`Mobiliario con código ${codigo} no encontrado`);
    }

    return mobiliario;
  }

  async update(
    id: string,
    updateMobiliarioDto: UpdateMobiliarioDto,
  ): Promise<Mobiliario> {
    const mobiliario = await this.findOne(id);
    Object.assign(mobiliario, updateMobiliarioDto);
    return this.mobiliarioRepository.save(mobiliario);
  }

  async remove(id: string): Promise<void> {
    const mobiliario = await this.findOne(id);
    await this.mobiliarioRepository.remove(mobiliario);
  }

  async regenerateQR(id: string): Promise<Mobiliario> {
    const mobiliario = await this.findOne(id);
    
    const qrData = JSON.stringify({
      id: mobiliario.id,
      codigo: mobiliario.codigo,
      nombre: mobiliario.nombre,
    });

    const qrCode = await QRCode.toDataURL(qrData);
    mobiliario.qrCode = qrCode;

    return this.mobiliarioRepository.save(mobiliario);
  }
}

