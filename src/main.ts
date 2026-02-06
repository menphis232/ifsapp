import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS: panel web, app móvil (Capacitor/Ionic) y producción
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:8100',
    'https://ifsnutrition.com',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'https://localhost',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      // Sin origin: peticiones desde app nativa (Capacitor), Postman, etc.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // App móvil Capacitor/Ionic (cualquier variante)
      if (origin.startsWith('capacitor://') || origin.startsWith('ionic://')) return callback(null, true);
      // Subdominios de ifsnutrition.com
      if (origin.endsWith('.ifsnutrition.com')) return callback(null, true);
      callback(new Error('CORS no permitido'));
    },
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();

