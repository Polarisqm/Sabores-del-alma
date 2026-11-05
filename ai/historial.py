# Arma la conversación para el modelo: se alternan usuario y Ángel, empieza siempre el usuario
# y el mensaje actual va al final. No depende de ninguna librería, por eso se puede probar sola.

def armar_turnos(historial, actual):
    """historial: lista de (rol, texto) con rol 'usuario' o 'asistente'.
    Devuelve lista de (rol, texto) con rol 'user' o 'model' (así lo pide Gemini)."""
    turnos = []
    for rol_original, texto in historial:
        texto = texto.strip()
        if not texto:
            continue
        rol = "user" if rol_original == "usuario" else "model"
        if turnos and turnos[-1][0] == rol:
            turnos[-1] = (rol, turnos[-1][1] + "\n" + texto)
        else:
            turnos.append((rol, texto))

    while turnos and turnos[0][0] != "user":
        turnos.pop(0)

    if turnos and turnos[-1][0] == "user":
        turnos[-1] = ("user", turnos[-1][1] + "\n" + actual)
    else:
        turnos.append(("user", actual))
    return turnos
