# Ángel, el asistente de Sabores del Alma

Ángel es el asistente de la página. Es un servidor en Python (FastAPI) que consulta a **Gemini**
(Google) y le da lo que necesita para responder bien: la historia del sitio y los postres reales
que están en MongoDB.

## Cómo funciona
1. La persona escribe en el chat de la página.
2. La página llama a `POST /api/asistente` de este servidor.
3. Antes de llamar al modelo se revisa si hay señales de que alguien quiere hacerse daño. Si las hay,
   responde siempre con el mensaje de seguridad (no improvisa) y el número 123.
4. Este servidor pide a la API de Node los postres y emociones (lo que está en MongoDB), sin usuarios
   ni pedidos, y arma el contexto.
5. Gemini responde como Ángel. Si la persona ya dejó claro cómo se siente, puede recomendar un postre
   y la página muestra el enlace.

## Clave gratuita
1. Entra a **aistudio.google.com/apikey** con tu cuenta de Google.
2. Crea una clave y cópiala. No pide tarjeta de crédito.
3. Ponla en `.env` como `GEMINI_API_KEY`.

## Pasos
1. Instalar Python 3.10 o más nuevo.
2. Dentro de esta carpeta, crear el entorno y las dependencias:
   ```
   python -m venv .venv
   .venv\Scripts\activate          (Windows)
   source .venv/bin/activate       (Mac o Linux)
   pip install -r requirements.txt
   ```
3. Copiar `.env.example` como `.env` y poner `GEMINI_API_KEY`.
4. Tener encendido el backend de Node (`npm run dev` en `backend/`), porque Ángel lee los postres de ahí.
5. Arrancar Ángel:
   ```
   uvicorn app:app --reload --port 8000
   ```
6. Comprobar: abre http://localhost:8000/api/salud. Debe responder `{"ok": true, ...}`.

## Modelo y límites
- `MODELO_IA=gemini-2.5-flash` es el valor por defecto. Tiene nivel gratuito.
- Los modelos Pro ya no son gratuitos. Para Ángel no hacen falta.
- Los límites gratuitos (mensajes por minuto y por día) cambian. Si Ángel responde con "no pudo responder
  ahora" de forma repetida, es probable que se haya agotado el cupo del día. Se renueva al día siguiente.
- `MAX_MENSAJES_POR_HORA` limita cuántos mensajes puede mandar una misma conexión.

## Privacidad (importante)
En el nivel gratuito de Gemini, Google puede usar lo que se escribe para mejorar sus productos.
Ángel recibe conversaciones personales, así que:
- Para la presentación y las pruebas, usa mensajes de prueba.
- Si la página se publica con personas reales, pasa a un plan de pago de Gemini (el uso no se usa para entrenar)
  o a un modelo que corra en tu propio servidor.

## Seguridad
- La clave solo vive en el `.env` del servidor. Nunca va en la página ni en GitHub.
- Ángel no tiene acceso a usuarios, contraseñas ni pedidos: solo lee la lista pública de postres.
- Si alguien habla de hacerse daño, responde con el número de emergencias (123) sin consultar al modelo.
