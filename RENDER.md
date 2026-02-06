# Desplegar el backend en Render y conectar a Aiven MySQL

## 1. Crear el servicio en Render

1. Entra en [Render](https://render.com) → **Dashboard** → **New** → **Web Service**.
2. Conecta tu repositorio y elige el proyecto.
3. Configuración recomendada:
   - **Root Directory:** `backend` (si el backend está en una carpeta `backend`).
   - **Runtime:** Node.
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

## 2. Variables de entorno en Render

En tu servicio: **Environment** → **Add Environment Variable**. Añade:

| Key          | Value                                                                 | Secret |
|--------------|-----------------------------------------------------------------------|--------|
| `DB_HOST`    | `mysql-14cd9805-menphisj-dfc5.i.aivencloud.com`                      | No     |
| `DB_PORT`    | `16122`                                                               | No     |
| `DB_USERNAME`| `avnadmin`                                                            | No     |
| `DB_PASSWORD`| `(tu contraseña de Aiven - configúrala en Render como Secret)`        | **Sí** |
| `DB_DATABASE`| `defaultdb`                                                           | No     |
| `DB_SSL`     | `true`                                                                | No     |
| `DB_CA_CERT` | *(ver abajo)*                                                         | **Sí** |

### Certificado CA (`DB_CA_CERT`)

Pega **todo** el contenido del certificado, incluyendo las líneas `-----BEGIN CERTIFICATE-----` y `-----END CERTIFICATE-----`. En Render puedes pegar varias líneas en el valor de la variable.

```
-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUPHZrphn3Gr2CFO9iBAhPGW9c3iQwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYTdkYTE1ZmEtZjZiMi00YmM0LThhOTYtY2I4ZjA1MmU3
Y2E2IFByb2plY3QgQ0EwHhcNMjYwMjA2MjAzNzE0WhcNMzYwMjA0MjAzNzE0WjA6
MTgwNgYDVQQDDC9hN2RhMTVmYS1mNmIyLTRiYzQtOGE5Ni1jYjhmMDUyZTdjYTYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMDIcSrx
hUpub7LWHKq1BvEjtzGIjw5gzYeKxN0ZBJHROUu1Tk9x91dUqGyqOS937TSEqyLF
jI08l/5AtlkDquJgPd2ERmkFDEEWurOKYqy/Laj7hq/2THNQKyxNLe5XvzL9oVpG
2/ij32dpaytt3IGFdFwJyGjLqi72FvEiH/jDSYlE0RBurr4ieR1LPkh1lkNEW3vR
Kn/QsHnGd9+spXAfIUbhqmAd79a7lqEKLTk9k+k/1EGKTNkklfN9Tv360rh1s+xI
u9BeAJDdhfKF2UP/VX2sJwK9Y7ZuIZ1uhCwz18lQjyz6G9ht/oiz/5qY0HjY0XSW
8f85lgfIXKkJp9Yz3l3ktqjV+3c8G6qP9o2BSlRx4mEQLzwrUxjIeEnCK/n4xrwP
ScKH99+RWw9LbhWIEJyXh0esNeqtQkaMXRsVGNXryFgq1BkWVY2sHMOf9KiMgLzQ
jKYrOJ8MkgWyasVVI4m+5RPek9chdcJgDMvMXdxJXJ0R64aQDbom0+K6GQIDAQAB
o0IwQDAdBgNVHQ4EFgQUpVyZ/mEtCxeNp96lWYxVMx9JpcAwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBADlew5j+QWQ5
5IazB7cMwk8g18f86v0+P3mrU5tb66ni9UvODvuSBS9CFhXcbyu6MDag7iPP8qyf
efmEn6ecdAYbk+3J6+3YTvLl70u9/d3i0S7Av23UhfGd1TJf9lQ38rAdmDDzfgau
uN5gnBYKytGtpTMj21uACOvPltX2lYUU+/9hV4ONsc2JdOCjdMoVz4qciFjRAVdC
Rxr0JNW/GS/t8NXL6iYKqwvccToA0BYEXn8hb6ezMGFei2bydM5L+nx+pXhOiPEm
H5PGQlwUSLm6z0lP6z/rwBQmkl423a5pETUjb/qAPAc/EouadgU6k4V0WwOLCHUS
19+fdgXoigeWM6WWKOslIu/GuaIsFQ3oNEnbajNP+dpUvwea5cK71Q/YGwOgKRue
lsxdFg7hhXlgeEf4rmTmgKxqCABtfGlwIEQld/T0o+b+PEOOOAGF54i7DrDl4+Go
pbxC4VBc2O3vZai4+WhgMvaqJ4kOEW6c/DE4uBybTv6Z/kvtLEAtwg==
-----END CERTIFICATE-----
```

Marca `DB_PASSWORD` y `DB_CA_CERT` como **Secret** para que no se muestren en los logs.

## 3. Aiven: permitir conexiones desde Render

En el panel de Aiven, revisa que tu instancia MySQL permita conexiones desde internet (por defecto suele estar abierta). Si tienes **Allowed IP addresses** o firewall, añade el rango de Render o permite todo (`0.0.0.0/0`) para pruebas.

## 4. Desplegar

Guarda las variables y lanza un **Deploy**. El backend usará `DB_*` y `DB_CA_CERT` para conectarse a Aiven con SSL.

## 5. Si el repo tiene la raíz en la raíz del monorepo

Si en Render el **Root Directory** es la raíz (no `backend`):

- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm run start:prod`

Así el backend se construye y arranca desde su carpeta.
