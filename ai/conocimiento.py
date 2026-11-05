# Lo que Ángel sabe de la página. Los postres y las emociones se leen de la API (que lee MongoDB)
# y se guardan un rato en memoria, para no consultar la base en cada mensaje.
import os
import time
from dataclasses import dataclass, field

import httpx

DURACION_CACHE = 600  # segundos

_cache = {"momento": 0.0, "datos": None}


@dataclass
class Contexto:
    texto: str
    claves: list = field(default_factory=list)


SITIO = """
Sabores del Alma es una página web y tienda de postres de emociones. Es el proyecto final del programa
Jóvenes Creativos. Cada postre representa una emoción a través de su color, su sabor y su historia.
Su lema es: "Siente, expresa y saborea lo que llevas dentro."

Secciones de la página:
- Inicio: portada, el postre del día (cambia cada día) y los siete postres.
- Nuestros postres: los siete, con su historia, ingredientes, alérgenos y una frase.
- ¿Cómo te sientes?: la persona elige una emoción y descubre el postre que la representa.
- Mezclador de postres: mezcla dos postres y mira cómo se combinan sus colores y emociones.
- Tienda: para comprar se necesita una cuenta (nombre, correo, teléfono y contraseña). El pedido se
  registra en la página. El pago y la entrega se coordinan por teléfono después de recibir el pedido.
  No hay pago en línea.
- Mis pedidos: el cliente ve el estado de sus pedidos (pendiente, confirmado, preparando, entregado o cancelado).
- La ciencia: el cerebro, los mensajeros químicos, el cuerpo, los sentidos, las siete emociones de Paul
  Ekman, un juego de mito o realidad y las fuentes.
- Tarjeta para compartir: la persona descarga una imagen con su postre, su frase y una dedicatoria.
- El proyecto y Contacto: formulario para preguntas, sugerencias de postres o colaboraciones.

Advertencias del proyecto: es una propuesta creativa y educativa. No reemplaza el apoyo psicológico
ni médico. La relación entre colores, sabores y emociones es simbólica y cambia entre personas.
"""


async def _pedir(ruta: str):
    api = os.getenv("API_URL", "http://localhost:3000/api")
    async with httpx.AsyncClient(timeout=5) as cliente:
        respuesta = await cliente.get(api + ruta)
        respuesta.raise_for_status()
        return respuesta.json()


async def _datos_de_la_base():
    ahora = time.time()
    if _cache["datos"] is not None and ahora - _cache["momento"] < DURACION_CACHE:
        return _cache["datos"]
    try:
        emociones = await _pedir("/emociones")
        postres = await _pedir("/postres")
    except Exception as error:  # la API puede estar apagada; no tumbamos el chat por eso
        print("No pude leer la base de datos:", error)
        return _cache["datos"]  # si hay una copia anterior, la usamos
    datos = {"emociones": emociones, "postres": postres}
    _cache.update(momento=ahora, datos=datos)
    return datos


def _pesos(valor):
    if valor is None:
        return "sin precio definido"
    return "$" + f"{int(valor):,}".replace(",", ".") + " COP"


def _texto_de_postres(datos) -> str:
    emociones = {e["clave"]: e for e in datos["emociones"]}
    bloques = []
    for p in datos["postres"]:
        emocion = emociones.get(p["clave"], {})

        grupos = {}
        for ingrediente in p.get("ingredientes", []):
            seccion = ingrediente.get("seccion") or "Ingredientes"
            grupos.setdefault(seccion, []).append(ingrediente.get("texto", ""))
        ingredientes = "; ".join(f"{sec}: {', '.join(items)}" for sec, items in grupos.items())

        alergenos = ", ".join(p.get("alergenos") or []) or "ninguno registrado"
        if p.get("fichaConfirmada"):
            ficha = "ficha confirmada"
        else:
            ficha = "ficha PROVISIONAL: alérgenos y trazas todavía NO confirmados"

        frases = " | ".join(emocion.get("frases", []))

        bloques.append(
            f"- {p['nombre']} (clave: {p['clave']}). Emoción: {emocion.get('nombre', '')} "
            f"(color {emocion.get('colorNombre', '')}, {emocion.get('colorHex', '')}). "
            f"Sabor: {p.get('sabor') or 'no definido'}. Precio: {_pesos(p.get('precio'))}.\n"
            f"  Historia: {p.get('historia') or 'no definida'}\n"
            f"  Lo que expresa la emoción: {emocion.get('significado', '')}\n"
            f"  Cómo vivirla de forma saludable: {emocion.get('regulacion', '')}\n"
            f"  Ingredientes: {ingredientes or 'no definidos'}\n"
            f"  Alérgenos: {alergenos} ({ficha})\n"
            f"  Frases de esta emoción: {frases or 'ninguna'}"
        )
    return "\n".join(bloques)


async def obtener_contexto() -> Contexto:
    datos = await _datos_de_la_base()
    if datos is None:
        texto = (
            SITIO
            + "\nNOTA: en este momento no pude consultar la lista de postres. Si te preguntan por precios, "
              "ingredientes o alérgenos concretos, dilo con honestidad y sugiere escribir a Contacto."
        )
        return Contexto(texto=texto, claves=[])

    claves = [e["clave"] for e in datos["emociones"]]
    texto = SITIO + "\nLOS POSTRES (datos reales, leídos de la base de datos en este momento):\n" + _texto_de_postres(datos)
    return Contexto(texto=texto, claves=claves)
