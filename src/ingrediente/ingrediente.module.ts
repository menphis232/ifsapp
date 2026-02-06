import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredienteService } from './ingrediente.service';
import { IngredienteController } from './ingrediente.controller';
import { Ingrediente } from './entities/ingrediente.entity';
import { UnidadMedidaModule } from '../unidad-medida/unidad-medida.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ingrediente]), UnidadMedidaModule],
  controllers: [IngredienteController],
  providers: [IngredienteService],
  exports: [IngredienteService],
})
export class IngredienteModule {}
