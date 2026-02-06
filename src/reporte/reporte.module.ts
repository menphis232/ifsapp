import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { Reporte } from './entities/reporte.entity';
import { MobiliarioModule } from '../mobiliario/mobiliario.module';
import { NotificacionModule } from '../notificacion/notificacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reporte]), MobiliarioModule, NotificacionModule],
  controllers: [ReporteController],
  providers: [ReporteService],
  exports: [ReporteService],
})
export class ReporteModule {}

