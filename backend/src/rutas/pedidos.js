// pedidos de los clientes: hay que haber iniciado sesión
const express = require("express");
const Pedido = require("../modelos/Pedido");
const Postre = require("../modelos/Postre");
const Usuario = require("../modelos/Usuario");
const envolver = require("../envolver");
const { verificarToken } = require("../middleware/auth");
const { texto } = require("../validar");

const router = express.Router();
router.use(verificarToken);

// un número de pedido corto y fácil de leer, por ejemplo SDA-K3F9A2
function crearNumero() {
  const tiempo = Date.now().toString(36).toUpperCase().slice(-4);
  const azar = Math.random().toString(36).toUpperCase().slice(2, 4);
  return "SDA-" + tiempo + azar;
}

function pedidoPublico(pedido) {
  return { id: pedido._id, numero: pedido.numero, items: pedido.items, total: pedido.total, notas: pedido.notas, estado: pedido.estado, creadoEn: pedido.creadoEn };
}

router.post("/", envolver(async function (req, res) {
  const itemsPedidos = Array.isArray(req.body.items) ? req.body.items : [];
  if (itemsPedidos.length === 0 || itemsPedidos.length > 7) {
    return res.status(400).json({ error: "Elige al menos un postre" });
  }

  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) {
    return res.status(401).json({ error: "Tu cuenta ya no existe. Crea una nueva." });
  }

  // el precio sale SIEMPRE de la base de datos, nunca de lo que mande la página
  const items = [];
  let total = 0;
  for (const pedido of itemsPedidos) {
    const clave = texto(pedido.clave, 30);
    const cantidad = Number(pedido.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
      return res.status(400).json({ error: "La cantidad de cada postre debe ser entre 1 y 20" });
    }
    const postre = await Postre.findOne({ clave, activo: true });
    if (!postre || !(postre.precio > 0)) {
      return res.status(400).json({ error: "Uno de los postres no está disponible por ahora" });
    }
    items.push({ postre: postre._id, clave: postre.clave, nombre: postre.nombre, cantidad, precioUnitario: postre.precio });
    total += postre.precio * cantidad;
  }

  const datos = {
    usuario: usuario._id,
    cliente: { nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono },
    items, total,
    notas: texto(req.body.notas, 200)
  };

  // si por casualidad el número ya existe, se intenta con otro
  let pedido = null;
  for (let intento = 0; intento < 4 && !pedido; intento++) {
    try {
      pedido = await Pedido.create({ ...datos, numero: crearNumero() });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }
  if (!pedido) {
    return res.status(500).json({ error: "No pudimos registrar el pedido, intenta de nuevo" });
  }

  res.status(201).json({ pedido: pedidoPublico(pedido) });
}));

router.get("/mios", envolver(async function (req, res) {
  const pedidos = await Pedido.find({ usuario: req.usuario.id }).sort({ creadoEn: -1 }).limit(50);
  res.json(pedidos.map(pedidoPublico));
}));

module.exports = router;
