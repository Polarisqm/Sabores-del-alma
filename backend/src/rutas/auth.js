// registro, inicio de sesión y datos de la persona que tiene la sesión abierta
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Usuario = require("../modelos/Usuario");
const envolver = require("../envolver");
const { verificarToken } = require("../middleware/auth");
const { texto, correoValido, telefonoValido } = require("../validar");

const router = express.Router();

// máximo 10 intentos de login cada 15 minutos, frena a quien intente adivinar contraseñas
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos, espera unos minutos." }
});

// máximo 10 registros por hora desde la misma conexión
const limiteRegistro = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Se han creado muchas cuentas desde esta conexión, intenta más tarde." }
});

// lo que se le devuelve a la página sobre la persona (sin la contraseña, claro)
function datosDeUsuario(usuario) {
  return { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono, rol: usuario.rol };
}

// los clientes mantienen la sesión una semana; los administradores solo dos horas
function crearToken(usuario) {
  const duracion = usuario.rol === "admin" ? "2h" : "7d";
  return jwt.sign({ id: String(usuario._id), rol: usuario.rol }, process.env.JWT_SECRETO, { expiresIn: duracion });
}

router.post("/registro", limiteRegistro, envolver(async function (req, res) {
  const nombre = texto(req.body.nombre, 80);
  const correo = texto(req.body.correo, 120).toLowerCase();
  const telefono = texto(req.body.telefono, 20);
  const clave = String(req.body.clave || "");

  if (nombre.length < 2) {
    return res.status(400).json({ error: "Escribe tu nombre (mínimo 2 caracteres)" });
  }
  if (!correoValido(correo)) {
    return res.status(400).json({ error: "El correo no parece válido" });
  }
  if (!telefonoValido(telefono)) {
    return res.status(400).json({ error: "El teléfono debe tener entre 7 y 15 números" });
  }
  if (clave.length < 8 || clave.length > 72) {
    return res.status(400).json({ error: "La contraseña debe tener entre 8 y 72 caracteres" });
  }
  if (clave.toLowerCase() === correo) {
    return res.status(400).json({ error: "La contraseña no puede ser igual al correo" });
  }
  if (req.body.aceptoDatos !== true) {
    return res.status(400).json({ error: "Para crear la cuenta debes autorizar el uso de tus datos" });
  }

  const existente = await Usuario.findOne({ correo });
  if (existente) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Prueba iniciar sesión." });
  }

  const passwordHash = await bcrypt.hash(clave, 12);
  const usuario = await Usuario.create({
    nombre, correo, telefono, passwordHash,
    rol: "cliente", aceptoDatos: true, fechaAceptacion: new Date()
  });

  res.status(201).json({ token: crearToken(usuario), usuario: datosDeUsuario(usuario) });
}));

router.post("/login", limiteLogin, envolver(async function (req, res) {
  const correo = texto(req.body.correo, 120).toLowerCase();
  const clave = String(req.body.clave || "");

  const usuario = await Usuario.findOne({ correo });
  const coincide = usuario ? await bcrypt.compare(clave, usuario.passwordHash) : false;

  // el mismo mensaje si falla el correo o la contraseña, para no dar pistas
  if (!coincide) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  res.json({ token: crearToken(usuario), usuario: datosDeUsuario(usuario) });
}));

// la página lo usa para comprobar que la sesión guardada todavía sirve
router.get("/yo", verificarToken, envolver(async function (req, res) {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) {
    return res.status(401).json({ error: "Esa cuenta ya no existe" });
  }
  res.json({ usuario: datosDeUsuario(usuario) });
}));

module.exports = router;
