// rutas que puede usar cualquier visitante de la página
const express = require("express");
const rateLimit = require("express-rate-limit");
const Emocion = require("../modelos/Emocion");
const Postre = require("../modelos/Postre");
const Frase = require("../modelos/Frase");
const Mensaje = require("../modelos/Mensaje");
const envolver = require("../envolver");
const { texto, correoValido } = require("../validar");

const router = express.Router();

// máximo 5 mensajes por hora desde la misma conexión, para evitar spam
const limiteContacto = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Has enviado varios mensajes, intenta de nuevo más tarde." }
});

// lo que se le muestra al público de un postre (nunca se manda de más)
function postrePublico(postre) {
  return {
    clave: postre.clave,
    nombre: postre.nombre,
    sabor: postre.sabor,
    historia: postre.historia,
    imagen: postre.imagen,
    precio: postre.precio,
    alergenos: postre.alergenos,
    ingredientes: postre.ingredientes,
    fichaConfirmada: postre.fichaConfirmada,
    emocion: postre.emocion && postre.emocion.clave ? {
      clave: postre.emocion.clave,
      nombre: postre.emocion.nombre,
      colorHex: postre.emocion.colorHex,
      significado: postre.emocion.significado,
      regulacion: postre.emocion.regulacion
    } : undefined
  };
}

// cada emoción llega con sus frases, para que la página las tome de la base de datos
router.get("/emociones", envolver(async function (req, res) {
  const emociones = await Emocion.find().sort({ orden: 1 }).lean();
  const frases = await Frase.find().lean();
  const porEmocion = {};
  frases.forEach(function (f) {
    (porEmocion[f.emocion] = porEmocion[f.emocion] || []).push(f.texto);
  });
  res.json(emociones.map(function (e) { return { ...e, frases: porEmocion[e.clave] || [] }; }));
}));

// la lista del menú y de la tienda
router.get("/postres", envolver(async function (req, res) {
  const postres = await Postre.find({ activo: true }).sort({ orden: 1 }).populate("emocion");
  res.json(postres.map(postrePublico));
}));

// un postre completo, buscándolo por la clave de su emoción (por ejemplo "alegria")
router.get("/postres/:clave", envolver(async function (req, res) {
  const postre = await Postre.findOne({ clave: texto(req.params.clave, 30), activo: true }).populate("emocion");
  if (!postre) {
    return res.status(404).json({ error: "Postre no encontrado" });
  }
  const frases = await Frase.find({ emocion: postre.clave }).lean();
  const frase = frases.length > 0 ? frases[Math.floor(Math.random() * frases.length)] : null;
  res.json({ ...postrePublico(postre), frase: frase ? { id: frase._id, texto: frase.texto } : null });
}));

// otra frase de la misma emoción, distinta a la que ya se está viendo (?excluir=id)
router.get("/emociones/:clave/frase", envolver(async function (req, res) {
  const excluir = texto(req.query.excluir, 40);
  const frases = await Frase.find({ emocion: texto(req.params.clave, 30) }).lean();
  const otras = frases.filter(function (f) { return String(f._id) !== excluir; });
  if (otras.length === 0) {
    return res.status(404).json({ error: "No hay frases para esa emoción" });
  }
  const frase = otras[Math.floor(Math.random() * otras.length)];
  res.json({ id: frase._id, texto: frase.texto });
}));

// formulario de contacto
router.post("/contacto", limiteContacto, envolver(async function (req, res) {
  const nombre = texto(req.body.nombre, 80);
  const correo = texto(req.body.correo, 120);
  const asunto = texto(req.body.asunto, 20);
  const mensaje = texto(req.body.mensaje, 1000);

  if (nombre.length < 2) {
    return res.status(400).json({ error: "Escribe tu nombre (mínimo 2 caracteres)" });
  }
  if (!correoValido(correo)) {
    return res.status(400).json({ error: "El correo no parece válido" });
  }
  if (!["consulta", "sugerencia", "colaboracion", "otro"].includes(asunto)) {
    return res.status(400).json({ error: "Elige un asunto de la lista" });
  }
  if (mensaje.length < 5) {
    return res.status(400).json({ error: "El mensaje debe tener entre 5 y 1000 caracteres" });
  }

  await Mensaje.create({ nombre, correo, asunto, mensaje });
  res.status(201).json({ ok: true });
}));

module.exports = router;
