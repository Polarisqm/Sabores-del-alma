# Punto de entrada de la IA: recibe peticiones HTTP, consulta Gemini y responde al chat web.
# Arranque desde esta carpeta: python -m uvicorn app:app --reload --port 8000.
# Los imports estándar gestionan reintentos, variables de entorno, tiempo y límites por IP.
import asyncio
import os
import time
from collections import defaultdict
from typing import Literal

# Librerías externas para configuración, API web, Gemini y validación del JSON recibido.
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from conocimiento import obtener_contexto
from historial import armar_turnos
from personalidad import construir_sistema
from seguridad import RESPUESTA_DE_ALERTA, hay_señal_de_alerta

# Carga ai/.env al iniciar, así las claves y direcciones no quedan escritas en el código.
load_dotenv()

# FastAPI registra las rutas que el navegador y otros servicios pueden llamar.
app = FastAPI(title="Ángel, asistente de Sabores del Alma")

# CORS limita qué páginas web pueden llamar a esta API desde el navegador.
origenes = [o.strip() for o in os.getenv("FRONTEND_URL", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Cliente reutilizable: evita crear una conexión nueva con Gemini en cada mensaje.
_cliente = None
# Guarda los tiempos de mensajes recientes por IP para aplicar el límite horario.
_usos = defaultdict(list)


def modelos() -> list[str]:
    """Devuelve los modelos de Gemini, en orden de intento, desde la configuración privada."""
    lista = os.getenv("MODELOS_IA") or os.getenv("MODELO_IA", "gemini-3.8-flash")
    return [m.strip() for m in lista.split(",") if m.strip()]


def modelo() -> str:
    # La ruta de salud muestra el primer modelo que se intentará.
    return modelos()[0]


def obtener_cliente() -> genai.Client:
    # Inicialización diferida: solo crea el cliente cuando llega una petición que lo necesita.
    global _cliente
    if _cliente is None:
        _cliente = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _cliente


def dentro_del_limite(ip: str) -> bool:
    # Conserva solo los mensajes de la última hora y rechaza el exceso por dirección IP.
    maximo = int(os.getenv("MAX_MENSAJES_POR_HORA", "40"))
    ahora = time.time()
    _usos[ip] = [t for t in _usos[ip] if ahora - t < 3600]
    if len(_usos[ip]) >= maximo:
        return False
    _usos[ip].append(ahora)
    return True


def error(estado: int, mensaje: str) -> JSONResponse:
    # Estandariza las respuestas de error como JSON con su código HTTP.
    return JSONResponse({"error": mensaje}, status_code=estado)


# Estos modelos validan forma y longitud del historial que llega desde el navegador.
class Turno(BaseModel):
    rol: Literal["usuario", "asistente"]
    texto: str = Field(max_length=1000)


class Conversacion(BaseModel):
    mensaje: str = Field(min_length=1, max_length=1000)
    historial: list[Turno] = Field(default_factory=list, max_length=12)


def preparar_contenido(historial: list[Turno], actual: str) -> list[types.Content]:
    # Convierte los roles locales a los nombres que espera la API de Gemini.
    turnos = armar_turnos([(t.rol, t.texto) for t in historial], actual)
    return [types.Content(role=rol, parts=[types.Part(text=texto)]) for rol, texto in turnos]


def herramientas_de_postres(claves: list[str]):
    # Si no se pudieron consultar emociones, no se ofrece una recomendación inexistente.
    if not claves:
        return None
    return [types.Tool(function_declarations=[types.FunctionDeclaration(
        name="recomendar_postre",
        description=(
            "Úsala solo cuando la persona ya dejó claro cómo se siente o pidió una recomendación de postre. "
            "Indica la clave de la emoción cuyo postre mejor encaja. No la uses en otras conversaciones."
        ),
        parameters=types.Schema(
            type=types.Type.OBJECT,
            properties={"clave": types.Schema(type=types.Type.STRING, enum=claves)},
            required=["clave"],
        ),
    )])]


async def llamar_modelo(contenido, configuracion):
    """Llama a Gemini probando cada modelo de la lista. Si uno está saturado (503), espera y
    reintenta. Si no existe, no tiene cupo (404, 429) o no responde, pasa al siguiente."""
    # Intenta cada modelo configurado; solo reintenta el mismo ante saturación temporal 503.
    ultimo_fallo = None
    for nombre in modelos():
        for intento in range(2):
            try:
                return await obtener_cliente().aio.models.generate_content(
                    model=nombre, contents=contenido, config=configuracion
                )
            except Exception as fallo:
                # Guarda el último error para devolverlo si no queda ningún modelo disponible.
                ultimo_fallo = fallo
                texto = str(fallo)
                print(f"Modelo {nombre} falló: {texto[:160]}")
                if "503" in texto or "UNAVAILABLE" in texto:
                    await asyncio.sleep(2 * (intento + 1))
                    continue  # saturado: reintentar este mismo modelo
                break  # no disponible o sin cupo: probar el siguiente modelo
    raise ultimo_fallo


@app.get("/api/salud")
async def salud():
    # Endpoint simple para comprobar que el proceso FastAPI está activo.
    return {"ok": True, "modelo": modelo()}


@app.post("/api/asistente")
async def conversar(datos: Conversacion, request: Request):
    # Limpia el mensaje, luego aplica seguridad y límites antes de consumir la API externa.
    texto = datos.mensaje.strip()
    if not texto:
        return error(400, "Escribe un mensaje")

    # la seguridad va primero, y no gasta llamadas al modelo
    if hay_señal_de_alerta(texto):
        return {"respuesta": RESPUESTA_DE_ALERTA, "emocion": None}

    ip = request.client.host if request.client else "desconocida"
    if not dentro_del_limite(ip):
        return error(429, "Has escrito muchos mensajes seguidos. Intenta de nuevo más tarde.")

    if not os.getenv("GEMINI_API_KEY"):
        return error(503, "Ángel no está disponible: falta la clave de Gemini en el servidor.")

    # El contexto incluye la información pública del proyecto y la lista actual de postres.
    contexto = await obtener_contexto()
    configuracion = types.GenerateContentConfig(
        system_instruction=construir_sistema(contexto.texto),
        max_output_tokens=700,
        temperature=0.8,
        tools=herramientas_de_postres(contexto.claves),
    )

    # Gemini recibe historial, mensaje actual, instrucciones de personalidad y herramienta opcional.
    try:
        respuesta = await llamar_modelo(preparar_contenido(datos.historial, texto), configuracion)
    except Exception as fallo:  # cuota agotada, clave inválida, sin internet...
        print("Error al hablar con Gemini:", fallo)
        return error(503, "Ángel no pudo responder ahora. Intenta de nuevo en un momento.")

    # Separa texto normal de la llamada estructurada que recomienda una emoción/postre.
    textos = []
    emocion = None
    if respuesta.candidates and respuesta.candidates[0].content and respuesta.candidates[0].content.parts:
        for parte in respuesta.candidates[0].content.parts:
            if parte.text:
                textos.append(parte.text)
            llamada = parte.function_call
            if llamada and llamada.name == "recomendar_postre":
                clave = (llamada.args or {}).get("clave")
                if clave in contexto.claves:
                    emocion = clave

    # Une fragmentos de texto; ofrece una pregunta breve si el modelo no produjo texto visible.
    respuesta_texto = "".join(textos).strip()
    if not respuesta_texto:
        respuesta_texto = "Cuéntame un poco más. ¿Qué sientes ahora mismo?"

    return {"respuesta": respuesta_texto, "emocion": emocion}
