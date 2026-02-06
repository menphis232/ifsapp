import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiquetaService } from './etiqueta.service';
import { EtiquetaController } from './etiqueta.controller';
import { Etiqueta } from './entities/etiqueta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Etiqueta])],
  controllers: [EtiquetaController],
  providers: [EtiquetaService],
  exports: [EtiquetaService],
})
export class EtiquetaModule {}
