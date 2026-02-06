import { Module } from '@nestjs/common';
import { ArchivoService } from './archivo.service';
import { ArchivoController } from './archivo.controller';

@Module({
  controllers: [ArchivoController],
  providers: [ArchivoService],
  exports: [ArchivoService],
})
export class ArchivoModule {}

