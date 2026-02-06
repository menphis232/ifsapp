import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Envase } from '../../envase/entities/envase.entity';

@Entity('inventario_envases')
export class InventarioEnvase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  envaseId: string;

  @ManyToOne(() => Envase)
  @JoinColumn({ name: 'envaseId' })
  envase: Envase;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @Column({ type: 'int', default: 0 })
  cantidadMinima: number;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
