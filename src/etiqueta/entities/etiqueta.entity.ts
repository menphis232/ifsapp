import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoEtiqueta {
  KILO = 'kilo',
  MEDIO_KILO = 'medio_kilo',
}

@Entity('etiquetas')
export class Etiqueta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string; // Ej: "Mass Gainer 1kg", "Mass Gainer 500g"

  /** ID de la fórmula/producto al que pertenece esta etiqueta (ej: massgainer-001) */
  @Column({ nullable: true })
  formulaId: string;

  @Column({
    type: 'text',
  })
  tipo: TipoEtiqueta; // 'kilo' o 'medio_kilo'

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
