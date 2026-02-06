import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioIngredienteService } from './inventario-ingrediente.service';
import { InventarioIngredienteController } from './inventario-ingrediente.controller';
import { InventarioIngrediente } from './entities/inventario-ingrediente.entity';
import { IngredienteModule } from '../ingrediente/ingrediente.module';
import { NotificacionModule } from '../notificacion/notificacion.module';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventarioIngrediente]),
    IngredienteModule,
    NotificacionModule,
    ConfiguracionModule,
  ],
  controllers: [InventarioIngredienteController],
  providers: [InventarioIngredienteService],
  exports: [InventarioIngredienteService],
})
export class InventarioIngredienteModule {}
