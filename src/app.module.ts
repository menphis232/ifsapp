import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MobiliarioModule } from './mobiliario/mobiliario.module';
import { InventarioModule } from './inventario/inventario.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { ReporteModule } from './reporte/reporte.module';
import { ArchivoModule } from './archivo/archivo.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { UnidadMedidaModule } from './unidad-medida/unidad-medida.module';
import { IngredienteModule } from './ingrediente/ingrediente.module';
import { FormulaModule } from './formula/formula.module';
import { InventarioIngredienteModule } from './inventario-ingrediente/inventario-ingrediente.module';
import { EnvaseModule } from './envase/envase.module';
import { EtiquetaModule } from './etiqueta/etiqueta.module';
import { InventarioEnvaseModule } from './inventario-envase/inventario-envase.module';
import { InventarioEtiquetaModule } from './inventario-etiqueta/inventario-etiqueta.module';
import { ProduccionModule } from './produccion/produccion.module';
import { AuthModule } from './auth/auth.module';
import { SistemaLogModule } from './sistema-log/sistema-log.module';
import { PushModule } from './push/push.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { EmpleadoNoDeleteGuard } from './auth/guards/empleado-no-delete.guard';
import { AuditInterceptor } from './sistema-log/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'inventarioifs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl:
        process.env.DB_SSL === 'true'
          ? (() => {
              // Render/cloud: certificado desde variable de entorno
              if (process.env.DB_CA_CERT) {
                return { ca: process.env.DB_CA_CERT, rejectUnauthorized: true };
              }
              // Local: certificado desde archivo
              const certPath = join(process.cwd(), 'certs', 'aiven-ca.pem');
              if (existsSync(certPath)) {
                return { ca: readFileSync(certPath, 'utf8'), rejectUnauthorized: true };
              }
              return { rejectUnauthorized: false };
            })()
          : false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),
    MobiliarioModule,
    InventarioModule,
    NotificacionModule,
    ReporteModule,
    ArchivoModule,
    ConfiguracionModule,
    UnidadMedidaModule,
    IngredienteModule,
    FormulaModule,
    InventarioIngredienteModule,
    EnvaseModule,
    EtiquetaModule,
    InventarioEnvaseModule,
    InventarioEtiquetaModule,
    ProduccionModule,
    AuthModule,
    SistemaLogModule,
    PushModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: EmpleadoNoDeleteGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}

