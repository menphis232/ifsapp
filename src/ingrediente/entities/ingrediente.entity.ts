import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UnidadMedida } from '../../unidad-medida/entities/unidad-medida.entity';
import { FormulaIngrediente } from '../../formula/entities/formula-ingrediente.entity';
import { InventarioIngrediente } from '../../inventario-ingrediente/entities/inventario-ingrediente.entity';

@Entity('ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  unidadMedidaId: string;

  @ManyToOne(() => UnidadMedida, (unidadMedida) => unidadMedida.ingredientes)
  @JoinColumn({ name: 'unidadMedidaId' })
  unidadMedida: UnidadMedida;

  @Column({ nullable: true })
  codigo: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FormulaIngrediente, (formulaIngrediente) => formulaIngrediente.ingrediente)
  formulaIngredientes: FormulaIngrediente[];

  @OneToMany(() => InventarioIngrediente, (inventario) => inventario.ingrediente)
  inventarios: InventarioIngrediente[];
}
