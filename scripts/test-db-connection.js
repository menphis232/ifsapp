/**
 * Prueba de conexión a la base de datos Aiven MySQL.
 * Ejecutar desde la raíz del backend: node scripts/test-db-connection.js
 * Asegúrate de tener .env con DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_SSL.
 */
const path = require('path');
const fs = require('fs');

// Cargar .env manualmente (sin dependencia extra)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'inventarioifs',
  ssl:
    process.env.DB_SSL === 'true'
      ? (() => {
          const certPath = path.join(__dirname, '..', 'certs', 'aiven-ca.pem');
          if (fs.existsSync(certPath)) {
            return { ca: fs.readFileSync(certPath, 'utf8'), rejectUnauthorized: true };
          }
          return { rejectUnauthorized: false };
        })()
      : undefined,
};

async function test() {
  console.log('Conectando a', config.host + ':' + config.port, 'base de datos:', config.database, '...');
  try {
    const conn = await mysql.createConnection(config);
    const [rows] = await conn.execute('SELECT 1 AS ok, VERSION() AS version');
    console.log('OK: Conexión exitosa.');
    console.log('MySQL:', rows[0].version);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error de conexión:', err.message);
    if (err.code) console.error('Código:', err.code);
    process.exit(1);
  }
}

test();
