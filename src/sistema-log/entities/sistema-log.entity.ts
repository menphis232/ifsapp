import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('sistema_logs')
export class SistemaLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ length: 100 })
  accion: string;

  @Column({ length: 100 })
  modulo: string;

  @Column({ type: 'text', nullable: true })
  detalles: string;

  @CreateDateColumn()
  fecha: Date;
}
