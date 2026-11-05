# Revisión de seguridad antes de llamar a la IA.
# Si alguien habla de hacerse daño, Ángel no improvisa: responde siempre con este mensaje cuidado.
import unicodedata

# en minúsculas y sin tildes (ver normalizar). Mantener sincronizado con js/main.js
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
    sin_tildes = "".join(
        c for c in unicodedata.normalize("NFD", texto.lower())
        if unicodedata.category(c) != "Mn"
    )
    return sin_tildes


def hay_señal_de_alerta(texto: str) -> bool:
    limpio = normalizar(texto)
    return any(senal in limpio for senal in SENALES_DE_ALERTA)
