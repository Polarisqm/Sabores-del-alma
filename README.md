# Sabores del Alma

<<<<<<< HEAD
Proyecto final del programa Jóvenes Creativos. Una página web donde eliges cómo te sientes
=======
Este es nuestro proyecto final de jovenes creativos. Una página web donde eliges cómo te sientes
>>>>>>> 57b474ec304708ce90947cb7576fc1c6d6b9dbb6
y descubres el postre, el color y el sabor que representan esa emoción.

"Siente, expresa y saborea lo que llevas dentro."

## Tecnologías
- Frontend: HTML, CSS, JavaScript y React
- Backend: Node.js + Express
<<<<<<< HEAD
- Base de datos: MongoDB (Atlas)
- Asistente Ángel: Python (FastAPI) + Claude de Anthropic
=======
- Base de datos: MySQL
- Asistente: Python
>>>>>>> 57b474ec304708ce90947cb7576fc1c6d6b9dbb6

## Carpetas
- `frontend/` la página
- `backend/` la API
<<<<<<< HEAD
- `ai/` Ángel, el asistente con inteligencia artificial
- `docs/` bocetos y notas

## Estado
Página conectada a MongoDB (los postres, emociones y frases salen de la base), tienda, cuentas de usuario, pedidos, panel de administrador y el asistente Ángel con inteligencia artificial.

## Para arrancar todo (en este orden)
1. `backend/`: `npm install`, copiar `.env.example` como `.env` con tu `MONGODB_URI` y `JWT_SECRETO`, luego `npm run dev`.
2. `ai/`: crear el entorno, `pip install -r requirements.txt`, copiar `.env.example` como `.env` con tu `GEMINI_API_KEY` (gratis en aistudio.google.com/apikey), luego `uvicorn app:app --reload --port 8000`.
3. `frontend/`: abrir `index.html` con Live Server (puerto 5500) o con doble clic.
=======
- `ai/` el asistente
- `database/` scripts de MySQL
- `docs/` bocetos y notas

## Estado
incompleto
>>>>>>> 57b474ec304708ce90947cb7576fc1c6d6b9dbb6

> Este proyecto no reemplaza el apoyo psicológico o médico.
