import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadMedidaService } from './unidad-medida.service';
import { UnidadMedidaController } from './unidad-medida.controller';
import { UnidadMedida } from './entities/unidad-medida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadMedida])],
  controllers: [UnidadMedidaController],
  providers: [UnidadMedidaService],
  exports: [UnidadMedidaService],
})
export class UnidadMedidaModule implements OnModuleInit {
  constructor(private unidadMedidaService: UnidadMedidaService) {}

  async onModuleInit() {
    // Inicializar unidades de medida por defecto al iniciar el módulo
    await this.unidadMedidaService.inicializarUnidadesDefault();
  }
}
