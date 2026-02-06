import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { PushModule } from '../push/push.module';

@Module({
  imports: [ConfiguracionModule, PushModule],
  providers: [NotificacionService],
  exports: [NotificacionService],
})
export class NotificacionModule {}

