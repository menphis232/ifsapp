# Backend - Sistema de Inventario de Mobiliario

Backend desarrollado con NestJS para el control de inventario de mobiliario.

## Características

- ✅ Gestión de mobiliarios con generación automática de QR
- ✅ Control de inventario con alertas de stock bajo
- ✅ Notificaciones push con OneSignal
- ✅ Sistema de reportes de daños y productos defectuosos
- ✅ Upload de imágenes y archivos opcionales
- ✅ Configuración de umbrales de inventario

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del backend:

```env
PORT=3000
```

## Ejecutar

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints principales

- `GET /mobiliarios` - Listar todos los mobiliarios
- `POST /mobiliarios` - Crear mobiliario
- `GET /mobiliarios/:id` - Obtener mobiliario por ID
- `PUT /inventarios/codigo/:codigo` - Actualizar inventario por código (para app móvil)
- `GET /inventarios/bajo` - Obtener inventarios con stock bajo
- `POST /reportes` - Crear reporte de daño
- `GET /configuracion` - Obtener configuración
- `PATCH /configuracion` - Actualizar configuración

## Base de datos

Se utiliza SQLite por defecto. La base de datos se crea automáticamente en `inventario.db`.

