import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ingrediente } from '../../ingrediente/entities/ingrediente.entity';

@Entity('inventario_ingredientes')
export class InventarioIngrediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ingredienteId: string;

  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.inventarios)
  @JoinColumn({ name: 'ingredienteId' })
  ingrediente: Ingrediente;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidad: number; // Cantidad actual en stock

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidadMinima: number; // Cantidad mínima requerida

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
