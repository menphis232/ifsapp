import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Inventario } from './entities/inventario.entity';
import { MobiliarioModule } from '../mobiliario/mobiliario.module';
import { NotificacionModule } from '../notificacion/notificacion.module';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario]),
    MobiliarioModule,
    NotificacionModule,
    ConfiguracionModule,
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}

