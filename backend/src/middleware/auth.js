const jwt = require("jsonwebtoken");

// revisa que la petición traiga un token válido: Authorization: Bearer <token>
// Extrae el JWT Bearer, verifica su firma y adjunta la identidad a la petición.
function verificarToken(req, res, next) {
  // Si el encabezado no existe, usa una cadena vacía para que la revisión sea segura.
  const cabecera = req.headers.authorization || "";
  // Extrae el token solo si usa el prefijo Bearer estándar.
  const token = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : null;

  // Sin token no se permite el acceso a rutas protegidas.
  if (!token) {
    return res.status(401).json({ error: "Necesitas iniciar sesión" });
  }

  // Verifica firma, vencimiento y algoritmo; guarda la identidad para las rutas siguientes.
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRETO, { algorithms: ["HS256"] });
    next();
  } catch (error) {
    // Un JWT vencido o alterado se trata como sesión inválida.
    res.status(401).json({ error: "Tu sesión no es válida o ya venció. Inicia sesión de nuevo." });
  }
}

// deja pasar solo a los administradores
// Exige el rol admin después de autenticar el token.
function soloAdmin(req, res, next) {
  // Un usuario autenticado sin permisos recibe 403; sin token recibe 401 arriba.
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "No tienes permiso para esto" });
  }
  // Continúa con la ruta protegida cuando el rol es correcto.
  next();
}

// Rutas de cuenta y administración comparten estos dos controles.
module.exports = { verificarToken, soloAdmin };
