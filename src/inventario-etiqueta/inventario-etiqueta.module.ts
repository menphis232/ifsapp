import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioEtiquetaService } from './inventario-etiqueta.service';
import { InventarioEtiquetaController } from './inventario-etiqueta.controller';
import { InventarioEtiqueta } from './entities/inventario-etiqueta.entity';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioEtiqueta]), EtiquetaModule],
  controllers: [InventarioEtiquetaController],
  providers: [InventarioEtiquetaService],
  exports: [InventarioEtiquetaService],
})
export class InventarioEtiquetaModule {}
