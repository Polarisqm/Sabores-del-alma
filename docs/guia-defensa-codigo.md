# Guía de defensa del código

Esta guía resume cómo se conectan las partes de Sabores del Alma y explica los archivos de datos y configuración que no admiten comentarios. El código ejecutable contiene comentarios en español junto a sus secciones y funciones principales.

## 1. Recorrido de una solicitud

1. El navegador abre `frontend/index.html`. El HTML define las pantallas, formularios y elementos que se pueden usar.
2. `frontend/css/styles.css` organiza la presentación y sus adaptaciones para pantallas pequeñas.
3. `frontend/js/main.js` controla la navegación, las interacciones y los contenidos de emociones. `frontend/js/tienda.js` gestiona cuenta, catálogo y pedidos. `frontend/js/admin.js` controla la página administrativa.
4. El frontend llama a la API de Express, que valida los datos, aplica las rutas correspondientes y consulta MongoDB Atlas mediante Mongoose.
5. Si la persona escribe a Ángel, el navegador también llama al servicio FastAPI. Ángel aplica validaciones y medidas de seguridad, obtiene contexto del backend y consulta Gemini cuando corresponde.

## 2. Qué hace cada carpeta

### `frontend/`

- `index.html`: estructura de la página pública. Sus identificadores y atributos `data-*` conectan los controles con JavaScript.
- `admin.html`: estructura separada para el inicio de sesión y las herramientas administrativas.
- `css/styles.css`: paleta, distribución, componentes visuales, estados y reglas responsivas.
- `js/config.js`: direcciones base de la API Node y de Ángel. Están configuradas para desarrollo local y deben cambiarse al publicar los servicios.
- `js/main.js`: navegación entre vistas, contenido emocional, experiencia educativa, dibujos y comunicación con el asistente.
- `js/tienda.js`: sesión del cliente, catálogo, compra, historial de pedidos y contacto.
- `js/admin.js`: autenticación administrativa y operaciones sobre pedidos, mensajes, postres y usuarios.

### `backend/`

- `src/server.js`: configura Express, seguridad HTTP, CORS, rutas, errores y conexión a la base.
- `src/db.js`: abre la conexión con MongoDB Atlas.
- `src/rutas/`: separa endpoints públicos, autenticación, pedidos y administración.
- `src/modelos/`: define la forma y reglas de los documentos almacenados por Mongoose.
- `src/middleware/auth.js`: identifica sesiones y comprueba permisos administrativos.
- `src/validar.js` y `src/envolver.js`: comparten validaciones y manejo de errores asíncronos.
- `src/sembrar.js` y `src/datos/semilla.json`: cargan los datos iniciales de emociones y postres.
- `src/crearAdmin.js`: permite crear una cuenta administrativa desde la terminal.

### `ai/`

- `app.py`: API FastAPI para el chat, validación de mensajes, límites de uso e integración con Gemini.
- `conocimiento.py`: obtiene el contexto disponible del proyecto desde el backend.
- `historial.py`: adapta los turnos previos al formato que espera el modelo.
- `personalidad.py`: construye las instrucciones de sistema de Ángel.
- `seguridad.py`: reconoce señales de alerta y proporciona una respuesta segura antes de llamar al modelo.
- `requirements.txt`: dependencias de Python necesarias para ejecutar el servicio.

### `database/`

`schema.sql` y `seed.sql` son scripts SQL para una estructura MySQL de referencia. **No son la base utilizada por el backend actual**, que usa MongoDB Atlas y los modelos de Mongoose. `schema.sql` contiene operaciones `DROP TABLE`; ejecutarlo puede borrar datos de esa base MySQL.

## 3. Archivos JSON y configuración

### `backend/src/datos/semilla.json`

JSON es un formato de datos y no admite comentarios; por eso se explica aquí sin alterar el archivo.

- `emociones`: lista de emociones. `clave` es el identificador estable usado para relacionar datos; `nombre`, colores, `significado` y `regulacion` alimentan la vista pública; `frases` contiene textos alternativos para mostrar.
- `postres`: catálogo inicial relacionado con emociones mediante la misma `clave`. Incluye nombre, sabor, historia, nombre de imagen, ingredientes y alérgenos.
- Cada ingrediente tiene `seccion` (por ejemplo, capa o cobertura) y `texto` con su descripción.
- `sembrar.js` lee este archivo y guarda los registros en MongoDB. Al cambiar sus campos, hay que mantenerlos compatibles con el código que los carga y presenta.

### `backend/package.json` y `backend/package-lock.json`

- `name`, `version` y `description` identifican el paquete backend.
- `main` señala el punto de entrada de la aplicación.
- `scripts` son comandos abreviados: `start` inicia el servidor, `dev` lo inicia en modo de desarrollo, `sembrar` carga datos y `admin` inicia el asistente de creación de administrador.
- `dependencies` enumera las bibliotecas directas que necesita el backend. `package-lock.json` registra las versiones exactas del árbol instalado para que `npm install` sea reproducible; se conserva en Git.

### Variables de entorno

Los archivos `.env` locales contienen secretos o direcciones de cada instalación y no se suben al repositorio:

- `backend/.env`: `MONGODB_URI` conecta Atlas, `JWT_SECRETO` firma sesiones y `FRONTEND_URL` define los orígenes permitidos.
- `ai/.env`: `GEMINI_API_KEY` autoriza la API de Gemini; `FRONTEND_URL` configura CORS; `API_URL` indica dónde está el backend.
- `frontend/js/config.js`: URL que usa el navegador para llamar al backend y al servicio de IA. No debe contener claves privadas.

## 4. Ideas útiles para explicar en la defensa

- **Separación de responsabilidades:** el frontend muestra la experiencia, el backend controla los datos y permisos, y el servicio de IA conversa con Gemini.
- **MongoDB Atlas:** la base está en la nube, pero la API Node debe estar ejecutándose para que la página y Ángel puedan consultarla.
- **Autenticación:** la API entrega una sesión firmada con JWT; las contraseñas se guardan como hashes y no como texto legible.
- **Validación y protección:** el backend y FastAPI comprueban entradas; CORS restringe orígenes del navegador y hay límites de solicitudes para evitar abuso.
- **Datos iniciales:** la semilla sirve para preparar la base nueva. No se debe volver a ejecutar sin confirmar el impacto en la base compartida.
- **Seguridad de las claves:** `.env`, contraseñas y URI de Atlas son privadas. No se deben pegar en capturas, commits ni documentación pública.

## 5. Demostración sugerida

1. Mostrar una emoción y cómo conduce al postre relacionado.
2. Abrir la ficha, los ingredientes y la información de alérgenos.
3. Enviar un mensaje a Ángel y explicar que su contexto de postres proviene de la API.
4. Iniciar sesión como cliente y enseñar el flujo de pedidos.
5. Mostrar el panel administrativo y explicar que sus rutas requieren permisos de administrador.
