# Ángel, el asistente de Sabores del Alma

Ángel es un servidor en Python que conecta el chat de la página con Gemini. También consulta el backend para obtener las emociones y los postres. Para usarlo necesitas iniciar **MongoDB, el backend y Ángel**; deja cada servidor abierto en una terminal distinta.

## Requisitos

- Python 3.10 o posterior.
- Node.js y npm.
- Acceso a una base de datos MongoDB.
- Una clave de Gemini creada en [Google AI Studio](https://aistudio.google.com/apikey).

## 1. Configurar el backend

Abre una terminal en la carpeta `backend/` e instala las dependencias:

```powershell
npm install
```

Crea manualmente un archivo llamado `.env` dentro de `backend/`. No existe una plantilla `.env.example` en el repositorio. El archivo debe incluir:

```dotenv
MONGODB_URI=pega_aqui_tu_URI_de_MongoDB
JWT_SECRETO=escribe_aqui_un_secreto_largo_y_privado
FRONTEND_URL=http://localhost:5500,http://127.0.0.1:5500
```

Reemplaza los dos primeros valores con tus datos. `MONGODB_URI` se obtiene de la configuración de tu base de datos. Para `JWT_SECRETO`, usa una cadena larga, privada y difícil de adivinar. No compartas ni subas este archivo.

Si la base de datos todavía no tiene las emociones y los postres del proyecto, ejecuta una vez:

```powershell
npm run sembrar
```

Después, inicia el backend:

```powershell
npm run dev
```

Comprueba que está activo en <http://localhost:3000/api/salud>. Debe responder `{"ok":true}`.

## 2. Configurar y arrancar Ángel

Abre **otra terminal** en `ai/` y crea el archivo `.env` dentro de esa carpeta. Tampoco hay una plantilla `.env.example` para la IA. Añade:

```dotenv
GEMINI_API_KEY=pega_aqui_tu_clave_de_Gemini
FRONTEND_URL=http://localhost:5500,http://127.0.0.1:5500
API_URL=http://localhost:3000/api
```

`GEMINI_API_KEY` es obligatoria. `API_URL` apunta al backend local; `FRONTEND_URL` permite que la página local se comunique con Ángel. Si usas otro puerto para el frontend o el backend, actualiza las direcciones correspondientes. Nunca publiques tu clave ni el archivo `.env`.

### Windows (PowerShell)

Ejecuta estos comandos desde `ai/`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

Si PowerShell bloquea la activación del entorno, puedes omitir el segundo comando y usar directamente su Python:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app:app --reload --port 8000
```

### macOS o Linux

Ejecuta estos comandos desde `ai/`:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

Ángel debe responder en <http://localhost:8000/api/salud>. La respuesta indica que está activo y qué modelo intentará usar.

## 3. Abrir la página

Abre `frontend/index.html` con la extensión Live Server de VS Code. El puerto usual es `5500`; si Live Server muestra otro, actualiza `FRONTEND_URL` en los dos archivos `.env` y reinicia ambos servidores.

## Si algo falla

- **No se conecta a MongoDB:** revisa `MONGODB_URI` y que la base de datos permita la conexión desde tu red.
- **El backend dice que falta `JWT_SECRETO` o `MONGODB_URI`:** verifica que el archivo se llame exactamente `.env` y esté dentro de `backend/`.
- **Ángel dice que falta la clave de Gemini:** revisa `GEMINI_API_KEY` en `ai/.env`.
- **Ángel no encuentra postres o emociones:** confirma que el backend esté activo y que la base tenga los datos iniciales.
- **El navegador bloquea una solicitud:** comprueba que `FRONTEND_URL` coincida con la dirección que muestra Live Server y reinicia los servidores.

Los entornos `.venv` y las dependencias se instalan localmente en cada computadora; no se suben a GitHub. Los archivos `.env` también son locales porque contienen secretos.
