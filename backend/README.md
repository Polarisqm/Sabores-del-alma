# Backend de Sabores del Alma

API en Node.js + Express con base de datos MySQL.

## Pasos en cada computador
1. Instalar Node.js y MySQL Workbench (la base de datos vive en Aiven, en la nube).
2. En Aiven: crear el servicio MySQL gratis, copiar host, puerto, usuario y contraseña, y descargar el certificado `ca.pem` a `backend/certificados/`.
3. Conectarse con Workbench (SSL activado con el `ca.pem`) y ejecutar `database/schema.sql` y luego `database/seed.sql` (solo se hace una vez, la base es compartida).
4. En esta carpeta:
   ```
   npm install express mysql2 bcryptjs jsonwebtoken dotenv cors express-rate-limit
   ```
5. Copiar `.env.example` como `.env` y llenar los valores (el `.env` no se sube a GitHub).
6. Crear el administrador: `npm run admin`
7. Arrancar: `npm run dev`  (queda en http://localhost:3000)

## Rutas
Públicas: `GET /api/emociones`, `GET /api/postres`, `GET /api/postres/:clave`,
`GET /api/emociones/:clave/frase`, `POST /api/contacto`

Login: `POST /api/auth/login`

Admin (con token): `/api/admin/mensajes`, `/api/admin/postres`
