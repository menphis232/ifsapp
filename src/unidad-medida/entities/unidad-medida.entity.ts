import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ingrediente } from '../../ingrediente/entities/ingrediente.entity';

@Entity('unidades_medida')
export class UnidadMedida {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nombre: string; // Ej: "Saco", "Kilo", "Paquete", "Litro", "Gramo"

  @Column({ nullable: true })
  abreviatura: string; // Ej: "sac", "kg", "pkg", "L", "g"

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.unidadMedida)
  ingredientes: Ingrediente[];
}
