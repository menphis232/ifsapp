import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mobiliario } from '../../mobiliario/entities/mobiliario.entity';
import { FormulaIngrediente } from './formula-ingrediente.entity';

@Entity('formulas')
export class Formula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string; // Ej: "Massgainer"

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  mobiliarioId: string; // Relación con el mobiliario (producto final)

  @ManyToOne(() => Mobiliario)
  @JoinColumn({ name: 'mobiliarioId' })
  mobiliario: Mobiliario;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FormulaIngrediente, (formulaIngrediente) => formulaIngrediente.formula)
  ingredientes: FormulaIngrediente[];
}
