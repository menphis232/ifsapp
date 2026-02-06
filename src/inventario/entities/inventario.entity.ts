import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mobiliario } from '../../mobiliario/entities/mobiliario.entity';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mobiliarioId: string;

  @ManyToOne(() => Mobiliario, (mobiliario) => mobiliario.inventarios)
  @JoinColumn({ name: 'mobiliarioId' })
  mobiliario: Mobiliario;

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

