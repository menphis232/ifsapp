import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioEnvaseService } from './inventario-envase.service';
import { InventarioEnvaseController } from './inventario-envase.controller';
import { InventarioEnvase } from './entities/inventario-envase.entity';
import { EnvaseModule } from '../envase/envase.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioEnvase]), EnvaseModule],
  controllers: [InventarioEnvaseController],
  providers: [InventarioEnvaseService],
  exports: [InventarioEnvaseService],
})
export class InventarioEnvaseModule {}
