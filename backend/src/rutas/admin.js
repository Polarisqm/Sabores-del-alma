// Endpoints exclusivos del panel: cada ruta exige autenticación y rol de administrador.
const express = require("express");
const Pedido = require("../modelos/Pedido");
const Postre = require("../modelos/Postre");
const Mensaje = require("../modelos/Mensaje");
const Usuario = require("../modelos/Usuario");
const envolver = require("../envolver");
const { verificarToken, soloAdmin } = require("../middleware/auth");
const { texto, idValido } = require("../validar");

const router = express.Router();
// Aplica ambos controles a todas las rutas de este router, no solo a las que se recuerde proteger.
router.use(verificarToken, soloAdmin);

// Valida identificadores antes de usarlos en consultas MongoDB.
function revisarId(req, res, next) {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ error: "Identificador no válido" });
  }
  next();
}

// ---------- Pedidos: listar los más recientes y actualizar su estado ----------
router.get("/pedidos", envolver(async function (req, res) {
  // Limita la respuesta a 200 para evitar devolver un historial ilimitado.
  const pedidos = await Pedido.find().sort({ creadoEn: -1 }).limit(200);
  res.json(pedidos);
}));

router.patch("/pedidos/:id/estado", revisarId, envolver(async function (req, res) {
  // Normaliza y comprueba el estado contra la lista central del modelo.
  const estado = texto(req.body.estado, 20);
  if (!Pedido.ESTADOS.includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }
  // Devuelve el documento ya actualizado para que la interfaz muestre el nuevo estado.
  const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado }, { returnDocument: "after" });
  if (!pedido) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }
  res.json(pedido);
}));

// ---------- Mensajes: listar, marcar como leídos y borrar ----------
router.get("/mensajes", envolver(async function (req, res) {
  // Ordena de más reciente a más antiguo y limita el tamaño de la respuesta.
  const mensajes = await Mensaje.find().sort({ creadoEn: -1 }).limit(200);
  res.json(mensajes);
}));

router.patch("/mensajes/:id/leido", revisarId, envolver(async function (req, res) {
  // Marca el mensaje como leído sin reemplazar los demás campos.
  const mensaje = await Mensaje.findByIdAndUpdate(req.params.id, { leido: true }, { returnDocument: "after" });
  if (!mensaje) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.json(mensaje);
}));

router.delete("/mensajes/:id", revisarId, envolver(async function (req, res) {
  // Elimina un mensaje seleccionado y diferencia el caso de id inexistente.
  const mensaje = await Mensaje.findByIdAndDelete(req.params.id);
  if (!mensaje) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  res.json({ ok: true });
}));

// ---------- Postres: lista del panel y edición de campos permitidos ----------
router.get("/postres", envolver(async function (req, res) {
  // El panel también puede ver postres inactivos para volver a habilitarlos.
  const postres = await Postre.find().sort({ orden: 1 });
  res.json(postres);
}));

router.put("/postres/:id", revisarId, envolver(async function (req, res) {
  // Construye una lista blanca de campos; no copia directamente todo req.body a MongoDB.
  const cambios = {};

  // Valida rango y tipo del precio antes de guardarlo.
  if (req.body.precio !== undefined) {
    const precio = Number(req.body.precio);
    if (!Number.isFinite(precio) || precio < 0 || precio > 1000000) {
      return res.status(400).json({ error: "El precio debe estar entre 0 y 1.000.000" });
    }
    cambios.precio = precio;
  }
  // Convierte los indicadores en booleanos explícitos para no aceptar valores ambiguos.
  if (req.body.activo !== undefined) cambios.activo = req.body.activo === true;
  if (req.body.fichaConfirmada !== undefined) cambios.fichaConfirmada = req.body.fichaConfirmada === true;
  if (req.body.nombre !== undefined) {
    const nombre = texto(req.body.nombre, 80);
    if (nombre.length < 2) return res.status(400).json({ error: "El nombre es muy corto" });
    cambios.nombre = nombre;
  }
  if (req.body.sabor !== undefined) cambios.sabor = texto(req.body.sabor, 120);

  // Actualiza solo los campos validados y devuelve la versión resultante.
  const postre = await Postre.findByIdAndUpdate(req.params.id, cambios, { returnDocument: "after" });
  if (!postre) {
    return res.status(404).json({ error: "Postre no encontrado" });
  }
  res.json(postre);
}));

// ---------- Usuarios: devuelve datos de perfil, nunca hashes de contraseña ----------
router.get("/usuarios", envolver(async function (req, res) {
  const usuarios = await Usuario.find({}, "nombre correo telefono rol creadoEn").sort({ creadoEn: -1 }).limit(500);
  res.json(usuarios);
}));

module.exports = router;
