import { Injectable, Logger } from '@nestjs/common';
import { ConfiguracionService } from '../configuracion/configuracion.service';
import { PushService } from '../push/push.service';
import { Inventario } from '../inventario/entities/inventario.entity';
import * as OneSignal from 'onesignal-node';

@Injectable()
export class NotificacionService {
  private readonly logger = new Logger(NotificacionService.name);
  private oneSignalClient: OneSignal.Client;

  constructor(
    private configuracionService: ConfiguracionService,
    private pushService: PushService,
  ) {}

  private async getOneSignalClient(): Promise<OneSignal.Client | null> {
    const config = await this.configuracionService.getConfiguracion();

    if (!config.onesignalAppId || !config.onesignalApiKey) {
      this.logger.warn('OneSignal no configurado. AppId o ApiKey faltantes.');
      return null;
    }

    if (!this.oneSignalClient) {
      this.oneSignalClient = new OneSignal.Client(
        config.onesignalAppId,
        config.onesignalApiKey,
      );
    }

    return this.oneSignalClient;
  }

  async enviarNotificacionInventarioBajo(inventario: Inventario): Promise<void> {
    const config = await this.configuracionService.getConfiguracion();

    if (!config.notificacionesActivas) {
      return;
    }

    const client = await this.getOneSignalClient();
    if (!client) {
      return;
    }

    try {
      const playerIds = config.onesignalPlayerIds
        ? JSON.parse(config.onesignalPlayerIds)
        : [];

      if (playerIds.length === 0) {
        this.logger.warn('No hay player IDs configurados para enviar notificaciones');
        return;
      }

      const notification = {
        contents: {
          en: `⚠️ Inventario bajo: ${inventario.mobiliario.nombre}. Cantidad: ${inventario.cantidad}`,
          es: `⚠️ Inventario bajo: ${inventario.mobiliario.nombre}. Cantidad: ${inventario.cantidad}`,
        },
        headings: {
          en: 'Alerta de Inventario',
          es: 'Alerta de Inventario',
        },
        include_player_ids: playerIds,
      };

      const response = await client.createNotification(notification);
      this.logger.log(`Notificación enviada: ${JSON.stringify(response)}`);
    } catch (error) {
      this.logger.error(`Error al enviar notificación: ${error.message}`, error.stack);
    }
  }

  async enviarNotificacionPersonalizada(
    titulo: string,
    mensaje: string,
  ): Promise<void> {
    const config = await this.configuracionService.getConfiguracion();

    if (!config.notificacionesActivas) {
      return;
    }

    const client = await this.getOneSignalClient();
    if (!client) {
      return;
    }

    try {
      let playerIds: string[] = config.onesignalPlayerIds
        ? JSON.parse(config.onesignalPlayerIds)
        : [];
      const adminTokens = await this.pushService.getTokensForAdmin();
      playerIds = [...new Set([...playerIds, ...adminTokens])];

      if (playerIds.length === 0) {
        this.logger.warn('No hay player IDs configurados para enviar notificaciones');
        return;
      }

      const notification = {
        contents: { en: mensaje, es: mensaje },
        headings: { en: titulo, es: titulo },
        include_player_ids: playerIds,
      };

      await client.createNotification(notification);
      this.logger.log('Notificación personalizada enviada');
    } catch (error) {
      this.logger.error(`Error al enviar notificación: ${error.message}`, error.stack);
    }
  }
}

