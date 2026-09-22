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
  TRES_KILOS = 'tres_kilos',
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
  tipo: TipoEnvase; // 'kilo' | 'medio_kilo' | 'tres_kilos'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidad: number; // 1.0, 0.5 o 3.0

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
