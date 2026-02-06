import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvaseService } from './envase.service';
import { EnvaseController } from './envase.controller';
import { Envase } from './entities/envase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Envase])],
  controllers: [EnvaseController],
  providers: [EnvaseService],
  exports: [EnvaseService],
})
export class EnvaseModule {}
