// rutas que puede usar cualquier visitante de la página
const express = require("express");
const rateLimit = require("express-rate-limit");
const db = require("../db");
const envolver = require("../envolver");

const router = express.Router();

// máximo 5 mensajes por hora desde la misma conexión, para evitar spam
const limiteContacto = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Has enviado varios mensajes, intenta de nuevo más tarde." }
});

router.get("/emociones", envolver(async function (req, res) {
  const [filas] = await db.query(
    "SELECT clave, nombre, color_hex, color_nombre, significado, regulacion FROM emociones ORDER BY id"
  );
  res.json(filas);
}));

// la lista del menú
router.get("/postres", envolver(async function (req, res) {
  const [filas] = await db.query(
    `SELECT p.id, p.nombre, p.sabor, p.imagen, e.clave AS emocion_clave,
            e.nombre AS emocion, e.color_hex
     FROM postres p
     JOIN emociones e ON e.id = p.emocion_id
     WHERE p.activo = TRUE
     ORDER BY e.id`
  );
  res.json(filas);
}));

// un postre completo, buscándolo por la clave de su emoción (por ejemplo "alegria")
router.get("/postres/:clave", envolver(async function (req, res) {
  const [postres] = await db.query(
    `SELECT p.id, p.nombre, p.sabor, p.historia, p.imagen, p.ficha_confirmada,
            e.id AS emocion_id, e.clave AS emocion_clave, e.nombre AS emocion,
            e.color_hex, e.color_nombre, e.significado, e.regulacion
     FROM postres p
     JOIN emociones e ON e.id = p.emocion_id
     WHERE e.clave = ? AND p.activo = TRUE
     LIMIT 1`,
    [req.params.clave]
  );

  if (postres.length === 0) {
    return res.status(404).json({ error: "Postre no encontrado" });
  }
  const postre = postres[0];

  const [ingredientes] = await db.query(
    "SELECT seccion, texto FROM ingredientes WHERE postre_id = ? ORDER BY orden, id", [postre.id]
  );
  const [alergenos] = await db.query(
    `SELECT a.nombre FROM alergenos a
     JOIN postre_alergenos pa ON pa.alergeno_id = a.id
     WHERE pa.postre_id = ?`, [postre.id]
  );
  const [frases] = await db.query(
    "SELECT id, texto FROM frases WHERE emocion_id = ? ORDER BY RAND() LIMIT 1", [postre.emocion_id]
  );

  res.json({
    ...postre,
    ingredientes: ingredientes,
    alergenos: alergenos.map(function (a) { return a.nombre; }),
    frase: frases[0] || null
  });
}));

// otra frase de la misma emoción, distinta a la que ya se está viendo (?excluir=id)
router.get("/emociones/:clave/frase", envolver(async function (req, res) {
  const excluir = Number(req.query.excluir) || 0;
  const [filas] = await db.query(
    `SELECT f.id, f.texto FROM frases f
     JOIN emociones e ON e.id = f.emocion_id
     WHERE e.clave = ? AND f.id <> ?
     ORDER BY RAND() LIMIT 1`,
    [req.params.clave, excluir]
  );
  if (filas.length === 0) {
    return res.status(404).json({ error: "No hay frases para esa emoción" });
  }
  res.json(filas[0]);
}));

// formulario de contacto
router.post("/contacto", limiteContacto, envolver(async function (req, res) {
  const nombre = String(req.body.nombre || "").trim();
  const correo = String(req.body.correo || "").trim();
  const asunto = String(req.body.asunto || "");
  const mensaje = String(req.body.mensaje || "").trim();

  const asuntosValidos = ["consulta", "sugerencia", "colaboracion", "otro"];
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  if (nombre.length < 2 || nombre.length > 80) {
    return res.status(400).json({ error: "Escribe tu nombre (entre 2 y 80 caracteres)" });
  }
  if (!correoValido || correo.length > 120) {
    return res.status(400).json({ error: "El correo no parece válido" });
  }
  if (!asuntosValidos.includes(asunto)) {
    return res.status(400).json({ error: "Elige un asunto de la lista" });
  }
  if (mensaje.length < 5 || mensaje.length > 1000) {
    return res.status(400).json({ error: "El mensaje debe tener entre 5 y 1000 caracteres" });
  }

  // los ? evitan la inyección SQL: los datos nunca se pegan dentro de la consulta
  await db.query(
    "INSERT INTO mensajes_contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)",
    [nombre, correo, asunto, mensaje]
  );
  res.status(201).json({ ok: true });
}));

module.exports = router;
