// rutas del panel de administrador: todas piden token y rol "admin"
const express = require("express");
const Pedido = require("../modelos/Pedido");
const Postre = require("../modelos/Postre");
const Mensaje = require("../modelos/Mensaje");
const Usuario = require("../modelos/Usuario");
const envolver = require("../envolver");
const { verificarToken, soloAdmin } = require("../middleware/auth");
const { texto, idValido } = require("../validar");

const router = express.Router();
router.use(verificarToken, soloAdmin);

// si el id que llega no tiene forma de id de Mongo, ni se busca
function revisarId(req, res, next) {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ error: "Identificador no válido" });
  }
  next();
}

// ---------- pedidos ----------
router.get("/pedidos", envolver(async function (req, res) {
  const pedidos = await Pedido.find().sort({ creadoEn: -1 }).limit(200);
  res.json(pedidos);
}));

router.patch("/pedidos/:id/estado", revisarId, envolver(async function (req, res) {
  const estado = texto(req.body.estado, 20);
  if (!Pedido.ESTADOS.includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }
  const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado }, { returnDocument: "after" });
  if (!pedido) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }
  res.json(pedido);
}));

// ---------- mensajes de contacto ----------
router.get("/mensajes", envolver(async function (req, res) {
  const mensajes = await Mensaje.find().sort({ creadoEn: -1 }).limit(200);
  res.json(mensajes);
}));

router.patch("/mensajes/:id/leido", revisarId, envolver(async function (req, res) {
  const mensaje = await Mensaje.findByIdAndUpdate(req.params.id, { leido: true }, { returnDocument: "after" });
  if (!mensaje) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.json(mensaje);
}));

router.delete("/mensajes/:id", revisarId, envolver(async function (req, res) {
  const mensaje = await Mensaje.findByIdAndDelete(req.params.id);
  if (!mensaje) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.json({ ok: true });
}));

// ---------- postres (aquí se cambian los precios) ----------
router.get("/postres", envolver(async function (req, res) {
  const postres = await Postre.find().sort({ orden: 1 });
  res.json(postres);
}));

router.put("/postres/:id", revisarId, envolver(async function (req, res) {
  const cambios = {};

  if (req.body.precio !== undefined) {
    const precio = Number(req.body.precio);
    if (!Number.isFinite(precio) || precio < 0 || precio > 1000000) {
      return res.status(400).json({ error: "El precio debe estar entre 0 y 1.000.000" });
    }
    cambios.precio = precio;
  }
  if (req.body.activo !== undefined) cambios.activo = req.body.activo === true;
  if (req.body.fichaConfirmada !== undefined) cambios.fichaConfirmada = req.body.fichaConfirmada === true;
  if (req.body.nombre !== undefined) {
    const nombre = texto(req.body.nombre, 80);
    if (nombre.length < 2) return res.status(400).json({ error: "El nombre es muy corto" });
    cambios.nombre = nombre;
  }
  if (req.body.sabor !== undefined) cambios.sabor = texto(req.body.sabor, 120);

  const postre = await Postre.findByIdAndUpdate(req.params.id, cambios, { returnDocument: "after" });
  if (!postre) {
    return res.status(404).json({ error: "Postre no encontrado" });
  }
  res.json(postre);
}));

// ---------- usuarios registrados ----------
router.get("/usuarios", envolver(async function (req, res) {
  const usuarios = await Usuario.find({}, "nombre correo telefono rol creadoEn").sort({ creadoEn: -1 }).limit(500);
  res.json(usuarios);
}));

module.exports = router;
