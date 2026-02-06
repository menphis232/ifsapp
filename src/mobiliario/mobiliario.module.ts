import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobiliarioService } from './mobiliario.service';
import { MobiliarioController } from './mobiliario.controller';
import { Mobiliario } from './entities/mobiliario.entity';
import { ArchivoModule } from '../archivo/archivo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mobiliario]), ArchivoModule],
  controllers: [MobiliarioController],
  providers: [MobiliarioService],
  exports: [MobiliarioService],
})
export class MobiliarioModule {}

