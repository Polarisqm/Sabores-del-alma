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
- `frontend/` la estructura de la página
- `backend/` la API
- `ai/` Angel, el asistente con inteligencia artificial
- `docs/` bocetos, notas, img, etc.

## Estado
Página conectada a MongoDB (los postres, emociones y frases salen de la base), tienda, cuentas de usuario, pedidos, panel de administrador y el asistente Angel con inteligencia artificial. (90% Finalizada, se deben corregir algunos errores)

## Para arrancar todo (en este orden). Es importante arrancar primero el backend y luego la IA, ya que se buguea
1. `backend/`: `npm install`, copiar `.env.example` como `.env` con tu `MONGODB_URI` y `JWT_SECRETO`, luego `npm run dev`.
2. `ai/`: crear el entorno, `pip install -r requirements.txt`, copiar `.env.example` como `.env` con tu `GEMINI_API_KEY` (gratis en aistudio.google.com/apikey), luego `uvicorn app:app --reload --port 8000`.
3. `frontend/`: abrir `index.html` con Live Server (puerto 5500) o con doble clic

> Este proyecto no reemplaza el apoyo psicológico o médico
