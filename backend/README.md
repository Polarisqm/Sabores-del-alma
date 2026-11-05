# Backend de Sabores del Alma

API en Node.js + Express con base de datos MongoDB (Atlas, en la nube).

## Pasos en cada computador
1. Instalar Node.js.
2. En esta carpeta: `npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-rate-limit helmet`
3. Copiar `.env.example` como `.env` y llenar los valores (el `.env` no se sube a GitHub).
4. Solo la primera vez (la base es compartida): `npm run sembrar` y `npm run admin`
5. Arrancar: `npm run dev`  (queda en http://localhost:3000)

## Rutas
Públicas: `GET /api/emociones`, `GET /api/postres`, `GET /api/postres/:clave`,
`GET /api/emociones/:clave/frase`, `POST /api/contacto`

Cuentas: `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/auth/yo`

Clientes (con sesión): `POST /api/pedidos`, `GET /api/pedidos/mios`

Admin (con sesión de administrador): `/api/admin/pedidos`, `/api/admin/mensajes`,
`/api/admin/postres`, `/api/admin/usuarios`
