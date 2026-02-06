import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduccionService } from './produccion.service';
import { ProduccionController } from './produccion.controller';
import { FormulasHardcodeadasService } from './formulas-hardcodeadas.service';
import { Produccion } from './entities/produccion.entity';
import { ProduccionPote } from './entities/produccion-pote.entity';
import { InventarioIngredienteModule } from '../inventario-ingrediente/inventario-ingrediente.module';
import { InventarioEnvaseModule } from '../inventario-envase/inventario-envase.module';
import { InventarioEtiquetaModule } from '../inventario-etiqueta/inventario-etiqueta.module';
import { EnvaseModule } from '../envase/envase.module';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';
import { IngredienteModule } from '../ingrediente/ingrediente.module';
import { NotificacionModule } from '../notificacion/notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produccion, ProduccionPote]),
    InventarioIngredienteModule,
    InventarioEnvaseModule,
    InventarioEtiquetaModule,
    EnvaseModule,
    EtiquetaModule,
    IngredienteModule,
    NotificacionModule,
  ],
  controllers: [ProduccionController],
  providers: [ProduccionService, FormulasHardcodeadasService],
  exports: [ProduccionService, FormulasHardcodeadasService],
})
export class ProduccionModule {}
