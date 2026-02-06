import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('configuraciones')
export class Configuracion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 10 })
  cantidadMinimaGlobal: number;

  @Column({ default: true })
  notificacionesActivas: boolean;

  @Column({ nullable: true })
  onesignalAppId: string;

  @Column({ nullable: true })
  onesignalApiKey: string;

  @Column({ nullable: true, type: 'text' })
  onesignalPlayerIds: string; // JSON array de player IDs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

