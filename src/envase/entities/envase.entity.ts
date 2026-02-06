import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoEnvase {
  KILO = 'kilo',
  MEDIO_KILO = 'medio_kilo',
}

@Entity('envases')
export class Envase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string; // Ej: "Mass Gainer 1kg", "Mass Gainer 500g"

  /** ID de la fórmula/producto al que pertenece este envase (ej: massgainer-001) */
  @Column({ nullable: true })
  formulaId: string;

  @Column({
    type: 'text',
  })
  tipo: TipoEnvase; // 'kilo' o 'medio_kilo'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidad: number; // 1.0 para kilo, 0.5 para medio kilo

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
