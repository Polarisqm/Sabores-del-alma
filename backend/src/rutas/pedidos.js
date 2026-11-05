// Endpoints de pedidos: requieren un token válido de cliente o administrador.
const express = require("express");
const Pedido = require("../modelos/Pedido");
const Postre = require("../modelos/Postre");
const Usuario = require("../modelos/Usuario");
const envolver = require("../envolver");
const { verificarToken } = require("../middleware/auth");
const { texto } = require("../validar");

const router = express.Router();
// Protege todas las rutas de este archivo antes de procesar sus datos.
router.use(verificarToken);

// Genera un número corto para mostrar al cliente; MongoDB conserva además su identificador interno.
function crearNumero() {
  const tiempo = Date.now().toString(36).toUpperCase().slice(-4);
  const azar = Math.random().toString(36).toUpperCase().slice(2, 4);
  return "SDA-" + tiempo + azar;
}

function pedidoPublico(pedido) {
  // Limita los campos de respuesta para no exponer datos internos innecesarios.
  return { id: pedido._id, numero: pedido.numero, items: pedido.items, total: pedido.total, notas: pedido.notas, estado: pedido.estado, creadoEn: pedido.creadoEn };
}

router.post("/", envolver(async function (req, res) {
  // Solo acepta una lista acotada de productos; el cliente no envía datos de precio confiables.
  const itemsPedidos = Array.isArray(req.body.items) ? req.body.items : [];
  if (itemsPedidos.length === 0 || itemsPedidos.length > 7) {
    return res.status(400).json({ error: "Elige al menos un postre" });
  }

  // Recupera la cuenta asociada al token para usar sus datos reales en el pedido.
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) {
    return res.status(401).json({ error: "Tu cuenta ya no existe. Crea una nueva." });
  }

  // el precio sale SIEMPRE de la base de datos, nunca de lo que mande la página
  // Busca cada producto activo en MongoDB y calcula el total con precios del servidor.
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

  // Copia los datos del cliente autenticado y limpia las notas opcionales.
  const datos = {
    usuario: usuario._id,
    cliente: { nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono },
    items, total,
    notas: texto(req.body.notas, 200)
  };

  // si por casualidad el número ya existe, se intenta con otro
  // Reintenta si la probabilidad remota de colisión del número de pedido se materializa.
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
  // Filtra siempre por el id del token para que un cliente no consulte pedidos ajenos.
  const pedidos = await Pedido.find({ usuario: req.usuario.id }).sort({ creadoEn: -1 }).limit(50);
  res.json(pedidos.map(pedidoPublico));
}));

module.exports = router;
