import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProduccionPote } from './produccion-pote.entity';

@Entity('producciones')
export class Produccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** ID de la fórmula hardcodeada (ej: massgainer-001). No es FK: las fórmulas están en código, no en BD. */
  @Column()
  formulaId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidadTotalProducida: number; // Total en kilos producidos (ej: 95 kg)

  @Column({ type: 'int', default: 0 })
  potes1kg: number; // Cantidad de potes de 1kg producidos

  @Column({ type: 'int', default: 0 })
  potesMedioKg: number; // Cantidad de potes de 0.5kg producidos

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  fechaProduccion: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProduccionPote, (pote) => pote.produccion)
  potes: ProduccionPote[];
}
