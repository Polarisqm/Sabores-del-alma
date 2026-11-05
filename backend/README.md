# Backend de Sabores del Alma

Este backend es la API de la página. Está hecho con Node.js y Express, y se conecta a MongoDB Atlas. Aunque la base de datos esté en la nube, el backend debe estar encendido para que la página y el asistente Ángel puedan consultarla.

## Requisitos

- Node.js con npm.
- Una base de datos MongoDB Atlas y su URI de conexión.

No necesitas instalar MongoDB en tu computadora si usas Atlas.

## Instalación y configuración

1. Abre una terminal en esta carpeta (`backend/`) e instala las dependencias del proyecto:

   ```bash
   npm install
   ```

2. Crea un archivo llamado `.env` directamente dentro de `backend/`. No hay un `.env.example` en el repositorio. Añade estas variables:

   ```dotenv
   MONGODB_URI=pega_aqui_tu_URI_de_MongoDB_Atlas
   JWT_SECRETO=escribe_aqui_un_secreto_largo_y_privado
   FRONTEND_URL=http://localhost:5500,http://127.0.0.1:5500
   ```

   - Reemplaza `MONGODB_URI` con la URI de tu cluster de Atlas. En Atlas, configura también el acceso de red para permitir la conexión desde tu computadora.
   - Reemplaza `JWT_SECRETO` por una cadena larga, privada y difícil de adivinar.
   - `FRONTEND_URL` debe coincidir con la dirección que usa el frontend. Si Live Server muestra otro puerto, cámbialo aquí.

   **No subas ni compartas `backend/.env`**: contiene credenciales. Cada persona debe crear su propio archivo.

## Preparar los datos y la cuenta de administrador

La base de Atlas puede ser compartida por el equipo; no ejecutes estos pasos sin confirmar que hacen falta:

- Si la base todavía no tiene las emociones y los postres iniciales del proyecto, ejecuta `npm run sembrar` una vez. Este comando carga o actualiza esos datos en MongoDB.
- Si todavía no hay una cuenta administradora, ejecuta `npm run admin` y responde las preguntas de la terminal. La contraseña debe tener al menos 10 caracteres. Hazlo una sola vez por cuenta.

No ejecutes `npm run admin` repetidamente con el mismo correo: cada usuario debe tener un correo único.

## Iniciar y comprobar la API

Desde `backend/`, ejecuta:

```bash
npm run dev
```

Deja esa terminal abierta mientras uses la página o Ángel. La API local estará en `http://localhost:3000`. Comprueba que funciona abriendo `http://localhost:3000/api/salud`; debe responder:

```json
{"ok":true}
```

Para detener el servidor, vuelve a esa terminal y presiona `Ctrl+C`.

## Rutas principales

- Públicas: `GET /api/emociones`, `GET /api/postres`, `GET /api/postres/:clave`, `GET /api/emociones/:clave/frase`, `POST /api/contacto`.
- Cuenta: `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/auth/yo`.
- Clientes con sesión: `POST /api/pedidos`, `GET /api/pedidos/mios`.
- Administración: `/api/admin/pedidos`, `/api/admin/mensajes`, `/api/admin/postres`, `/api/admin/usuarios` (requieren sesión de administrador).

## Si algo falla

- **No se conecta a Atlas:** revisa la URI, el usuario y la contraseña de la base, y la configuración de acceso de red del cluster.
- **Falta `MONGODB_URI` o `JWT_SECRETO`:** confirma que el archivo se llame exactamente `.env` y esté dentro de `backend/`.
- **El navegador no puede llamar a la API:** confirma que `FRONTEND_URL` coincida exactamente con la dirección y el puerto del frontend; luego reinicia el backend.
- **Ángel no encuentra postres o emociones:** confirma que el backend esté encendido y que los datos iniciales estén cargados.
