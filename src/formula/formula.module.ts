import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulaService } from './formula.service';
import { FormulaController } from './formula.controller';
import { Formula } from './entities/formula.entity';
import { FormulaIngrediente } from './entities/formula-ingrediente.entity';
import { MobiliarioModule } from '../mobiliario/mobiliario.module';
import { IngredienteModule } from '../ingrediente/ingrediente.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Formula, FormulaIngrediente]),
    MobiliarioModule,
    IngredienteModule,
  ],
  controllers: [FormulaController],
  providers: [FormulaService],
  exports: [FormulaService],
})
export class FormulaModule {}
