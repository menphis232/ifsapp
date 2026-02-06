import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mobiliario } from '../../mobiliario/entities/mobiliario.entity';

export enum TipoReporte {
  DANO = 'dano',
  PRODUCTO_DEFECTUOSO = 'producto_defectuoso',
  ETIQUETA_INCOMPLETA = 'etiqueta_incompleta',
  OTRO = 'otro',
}

export enum EstadoReporte {
  PENDIENTE = 'pendiente',
  EN_REVISION = 'en_revision',
  RESUELTO = 'resuelto',
  CERRADO = 'cerrado',
}

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mobiliarioId: string;

  @ManyToOne(() => Mobiliario, (mobiliario) => mobiliario.reportes)
  @JoinColumn({ name: 'mobiliarioId' })
  mobiliario: Mobiliario;

  @Column({
    type: 'varchar',
    default: TipoReporte.OTRO,
  })
  tipo: TipoReporte;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'varchar',
    default: EstadoReporte.PENDIENTE,
  })
  estado: EstadoReporte;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ nullable: true })
  archivoUrl: string;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

