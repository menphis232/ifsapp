import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Reporte } from '../../reporte/entities/reporte.entity';

@Entity('mobiliarios')
export class Mobiliario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  codigo: string;

  @Column({ nullable: true })
  categoria: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column({ type: 'text', nullable: true })
  qrCode: string;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Inventario, (inventario) => inventario.mobiliario)
  inventarios: Inventario[];

  @OneToMany(() => Reporte, (reporte) => reporte.mobiliario)
  reportes: Reporte[];
}

