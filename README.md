# Sabores del Alma

Proyecto final del programa Jóvenes Creativos. La idea es una página web en  donde eliges cómo te sientes
y descubres el postre, el color y el sabor que representan esa emoción

"Siente, expresa y saborea lo que llevas dentro."

## Tecnologías
- Frontend: HTML, CSS y JavaScript
- Backend: Node.js + Express
- Base de datos: MongoDB (Atlas)
- Asistente Ángel: Python (FastAPI) + Gemini de Google (Hay varias versiones debido a la alta demanda de la versión, por lo que a veces no responde. En tal caso se programó una respuesta automatica en la seccion app.py) 

## Carpetas
- `frontend/` estructura, estilos y comportamiento de la página.
- `backend/` API, modelos y conexión con MongoDB Atlas.
- `ai/` Ángel, el asistente con inteligencia artificial.
- `database/` scripts SQL de referencia para una estructura MySQL alternativa.
- `docs/` recursos visuales y la [guía de defensa del código](docs/guia-defensa-codigo.md).

## Estado
Página conectada a MongoDB (los postres, emociones y frases salen de la base), tienda, cuentas de usuario, pedidos, panel de administrador y el asistente Angel con inteligencia artificial. (90% Finalizada, se deben corregir algunos errores)

## Para arrancar todo

Necesitas dejar abiertos tres procesos, cada uno en una terminal distinta. La base de datos se aloja en MongoDB Atlas; no hace falta instalar MongoDB en el computador.

1. **Backend:** desde `backend/`, ejecuta `npm install` una vez. Crea manualmente `backend/.env` con los valores indicados en [backend/README.md](backend/README.md) y ejecuta `npm run dev`.
2. **Ángel:** desde `ai/`, crea y activa un entorno virtual, instala `requirements.txt` y crea manualmente `ai/.env` con la clave Gemini, siguiendo [ai/README.md](ai/README.md). Inicia con `python -m uvicorn app:app --reload --port 8000`.
3. **Página:** abre `frontend/index.html` con Live Server. Si el puerto o las direcciones cambian, revisa `frontend/js/config.js` y las variables CORS de los archivos `.env`.

Los archivos `.env` no se suben a GitHub porque contienen claves y credenciales. Los pasos completos y los comandos para Windows, macOS y Linux están en los README de backend y de IA.

> Este proyecto no reemplaza el apoyo psicológico o médico
