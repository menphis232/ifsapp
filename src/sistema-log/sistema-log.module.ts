import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SistemaLog } from './entities/sistema-log.entity';
import { SistemaLogService } from './sistema-log.service';
import { SistemaLogController } from './sistema-log.controller';
import { AuditInterceptor } from './audit.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([SistemaLog])],
  providers: [SistemaLogService, AuditInterceptor],
  controllers: [SistemaLogController],
  exports: [SistemaLogService, AuditInterceptor],
})
export class SistemaLogModule {}
