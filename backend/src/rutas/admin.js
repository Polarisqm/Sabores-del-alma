// rutas del panel de administrador: todas piden token y rol "admin"
const express = require("express");
const db = require("../db");
const envolver = require("../envolver");
const { verificarToken, soloAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(verificarToken, soloAdmin);

// ---------- mensajes de contacto ----------
router.get("/mensajes", envolver(async function (req, res) {
  const [filas] = await db.query(
    "SELECT id, nombre, correo, asunto, mensaje, leido, creado_en FROM mensajes_contacto ORDER BY creado_en DESC"
  );
  res.json(filas);
}));

router.patch("/mensajes/:id/leido", envolver(async function (req, res) {
  const [resultado] = await db.query("UPDATE mensajes_contacto SET leido = TRUE WHERE id = ?", [req.params.id]);
  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.json({ ok: true });
}));

router.delete("/mensajes/:id", envolver(async function (req, res) {
  const [resultado] = await db.query("DELETE FROM mensajes_contacto WHERE id = ?", [req.params.id]);
  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.json({ ok: true });
}));

// ---------- postres ----------
// revisa y ordena los datos de un postre que llegan en el cuerpo de la petición
function leerPostre(cuerpo) {
  const nombre = String(cuerpo.nombre || "").trim();
  if (nombre.length < 2 || nombre.length > 80) {
    return { error: "El nombre debe tener entre 2 y 80 caracteres" };
  }
  return {
    nombre: nombre,
    sabor: cuerpo.sabor || null,
    historia: cuerpo.historia || null,
    imagen: cuerpo.imagen || null
  };
}

router.get("/postres", envolver(async function (req, res) {
  const [filas] = await db.query(
    `SELECT p.id, p.nombre, p.sabor, p.activo, p.ficha_confirmada, e.nombre AS emocion
     FROM postres p JOIN emociones e ON e.id = p.emocion_id ORDER BY e.id`
  );
  res.json(filas);
}));

router.post("/postres", envolver(async function (req, res) {
  const datos = leerPostre(req.body);
  if (datos.error) return res.status(400).json({ error: datos.error });
  if (!Number.isInteger(req.body.emocion_id)) {
    return res.status(400).json({ error: "Falta el emocion_id (un número)" });
  }

  const [resultado] = await db.query(
    `INSERT INTO postres (emocion_id, nombre, sabor, historia, imagen)
     VALUES (?, ?, ?, ?, ?)`,
    [req.body.emocion_id, datos.nombre, datos.sabor, datos.historia, datos.imagen]
  );
  res.status(201).json({ id: resultado.insertId });
}));

router.put("/postres/:id", envolver(async function (req, res) {
  const datos = leerPostre(req.body);
  if (datos.error) return res.status(400).json({ error: datos.error });

  const [resultado] = await db.query(
    `UPDATE postres
     SET nombre = ?, sabor = ?, historia = ?, imagen = ?, activo = ?, ficha_confirmada = ?
     WHERE id = ?`,
    [datos.nombre, datos.sabor, datos.historia, datos.imagen,
     req.body.activo !== false, req.body.ficha_confirmada === true, req.params.id]
  );
  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: "Postre no encontrado" });
  }
  res.json({ ok: true });
}));

router.delete("/postres/:id", envolver(async function (req, res) {
  const [resultado] = await db.query("DELETE FROM postres WHERE id = ?", [req.params.id]);
  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: "Postre no encontrado" });
  }
  res.json({ ok: true });
}));

module.exports = router;
