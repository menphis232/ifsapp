import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Formula } from './formula.entity';
import { Ingrediente } from '../../ingrediente/entities/ingrediente.entity';

@Entity('formula_ingredientes')
export class FormulaIngrediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  formulaId: string;

  @ManyToOne(() => Formula, (formula) => formula.ingredientes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formulaId' })
  formula: Formula;

  @Column()
  ingredienteId: string;

  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.formulaIngredientes)
  @JoinColumn({ name: 'ingredienteId' })
  ingrediente: Ingrediente;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidadRequerida: number; // Cantidad necesaria de este ingrediente para la fórmula

  @Column({ nullable: true })
  notas: string; // Notas adicionales sobre este ingrediente en la fórmula

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
