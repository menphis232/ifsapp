import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Etiqueta } from '../../etiqueta/entities/etiqueta.entity';

@Entity('inventario_etiquetas')
export class InventarioEtiqueta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  etiquetaId: string;

  @ManyToOne(() => Etiqueta)
  @JoinColumn({ name: 'etiquetaId' })
  etiqueta: Etiqueta;

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
