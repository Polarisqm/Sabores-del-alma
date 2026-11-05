// Endpoints para registrar cuentas, iniciar sesión y recuperar el perfil autenticado.
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Usuario = require("../modelos/Usuario");
const envolver = require("../envolver");
const { verificarToken } = require("../middleware/auth");
const { texto, correoValido, telefonoValido } = require("../validar");

const router = express.Router();

// Limita intentos de login para dificultar ataques automatizados de adivinación de contraseñas.
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos, espera unos minutos." }
});

// Limita registros repetidos desde una misma conexión.
const limiteRegistro = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Se han creado muchas cuentas desde esta conexión, intenta más tarde." }
});

// Proyección pública del usuario: solo devuelve datos necesarios y excluye el hash de contraseña.
function datosDeUsuario(usuario) {
  return { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono, rol: usuario.rol };
}

// Crea un JWT firmado: sesiones de cliente duran una semana y las administrativas dos horas.
function crearToken(usuario) {
  const duracion = usuario.rol === "admin" ? "2h" : "7d";
  return jwt.sign({ id: String(usuario._id), rol: usuario.rol }, process.env.JWT_SECRETO, { expiresIn: duracion });
}

router.post("/registro", limiteRegistro, envolver(async function (req, res) {
  // Normaliza los campos de entrada antes de validarlos o guardarlos.
  const nombre = texto(req.body.nombre, 80);
  const correo = texto(req.body.correo, 120).toLowerCase();
  const telefono = texto(req.body.telefono, 20);
  const clave = String(req.body.clave || "");

  // Cada validación responde temprano para evitar crear cuentas con datos inválidos.
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

  // Comprueba duplicados para devolver un mensaje claro antes de intentar insertar.
  const existente = await Usuario.findOne({ correo });
  if (existente) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Prueba iniciar sesión." });
  }

  // Guarda solo un hash con factor de costo 12, nunca la contraseña original.
  const passwordHash = await bcrypt.hash(clave, 12);
  const usuario = await Usuario.create({
    nombre, correo, telefono, passwordHash,
    rol: "cliente", aceptoDatos: true, fechaAceptacion: new Date()
  });

  res.status(201).json({ token: crearToken(usuario), usuario: datosDeUsuario(usuario) });
}));

router.post("/login", limiteLogin, envolver(async function (req, res) {
  // Busca por correo normalizado y compara la clave con el hash almacenado.
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
  // El middleware ya verificó el token; aquí se consulta el perfil más reciente en la base.
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) {
    return res.status(401).json({ error: "Esa cuenta ya no existe" });
  }
  res.json({ usuario: datosDeUsuario(usuario) });
}));

module.exports = router;
