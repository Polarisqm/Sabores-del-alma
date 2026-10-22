const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../db");
const envolver = require("../envolver");

const router = express.Router();

// máximo 10 intentos de login cada 15 minutos, frena a quien intente adivinar contraseñas
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos, espera unos minutos." }
});

router.post("/login", limiteLogin, envolver(async function (req, res) {
  const correo = String(req.body.correo || "").trim().toLowerCase();
  const clave = String(req.body.clave || "");

  const [filas] = await db.query(
    "SELECT id, nombre, password_hash, rol FROM usuarios WHERE correo = ?", [correo]
  );
  const usuario = filas[0];
  const coincide = usuario ? await bcrypt.compare(clave, usuario.password_hash) : false;

  // el mismo mensaje si falla el correo o la contraseña, para no dar pistas
  if (!coincide) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRETO,
    { expiresIn: "2h" }
  );
  res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.rol } });
}));

module.exports = router;
