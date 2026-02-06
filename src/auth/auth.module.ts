import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../usuario/usuario.module';
import { SistemaLogModule } from '../sistema-log/sistema-log.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { EmpleadoNoDeleteGuard } from './guards/empleado-no-delete.guard';

@Module({
  imports: [
    UsuarioModule,
    SistemaLogModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ifs-inventario-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard, EmpleadoNoDeleteGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, RolesGuard, EmpleadoNoDeleteGuard],
})
export class AuthModule {}
