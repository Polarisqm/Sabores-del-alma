# Filtro local que se ejecuta antes de llamar a Gemini.
# Detectar una señal activa una respuesta preparada y evita que el modelo improvise en una crisis.
import unicodedata

# Las frases están normalizadas: minúsculas y sin tildes. Mantenerlas sincronizadas con frontend/js/main.js.
SENALES_DE_ALERTA = [
    "quiero morir",
    "no quiero vivir",
    "suicidio",
    "hacerme dano",
    "matarme",
    "acabar con todo",
    "quitar la vida",
    "quitarme la vida",
    "autolesion",
]

RESPUESTA_DE_ALERTA = (
    "Siento que estés pasando por algo tan difícil. No tienes que cargarlo solo: "
    "habla ya con alguien de confianza que esté cerca de ti o con un profesional. "
    "Si estás en peligro o sientes que puedes hacerte daño, llama ahora al 123 (Colombia) "
    "o ve al servicio de urgencias más cercano. ¿Estás a salvo en este momento?"
)


def normalizar(texto: str) -> str:
    # Separa letras de sus marcas diacríticas y elimina estas últimas para comparar tildes igual.
    sin_tildes = "".join(
        c for c in unicodedata.normalize("NFD", texto.lower())
        if unicodedata.category(c) != "Mn"
    )
    return sin_tildes


def hay_señal_de_alerta(texto: str) -> bool:
    # Comprueba si el texto normalizado contiene alguna expresión de la lista de alerta.
    limpio = normalizar(texto)
    return any(senal in limpio for senal in SENALES_DE_ALERTA)
