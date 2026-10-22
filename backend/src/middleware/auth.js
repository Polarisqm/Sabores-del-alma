const jwt = require("jsonwebtoken");

// revisa que la petición traiga un token válido: Authorization: Bearer <token>
function verificarToken(req, res, next) {
  const cabecera = req.headers.authorization || "";
  const token = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Falta iniciar sesión" });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRETO, { algorithms: ["HS256"] });
    next();
  } catch (error) {
    res.status(401).json({ error: "La sesión no es válida o ya venció" });
  }
}

// deja pasar solo a los administradores
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "No tienes permiso para esto" });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
