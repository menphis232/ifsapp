import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Produccion } from './produccion.entity';

@Entity('produccion_potes')
export class ProduccionPote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  produccionId: string;

  @ManyToOne(() => Produccion, (produccion) => produccion.potes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produccionId' })
  produccion: Produccion;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidad: number; // 1.0 o 0.5

  @Column()
  numeroPote: number; // Número secuencial del pote (1, 2, 3...)

  @CreateDateColumn()
  fechaSalida: Date; // Fecha en que salió este pote específico
}
