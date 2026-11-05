const mongoose = require("mongoose");

// Estados permitidos en el ciclo de vida de un pedido; las rutas administrativas los reutilizan.
const ESTADOS = ["pendiente", "confirmado", "preparando", "entregado", "cancelado"];

// Cada línea conserva una copia del precio y nombre vigentes al momento de comprar.
const itemEsquema = new mongoose.Schema({
  postre: { type: mongoose.Schema.Types.ObjectId, ref: "Postre" },
  clave: String,
  nombre: String,                                  // se copia el nombre y el precio del momento de la compra,
  cantidad: { type: Number, min: 1, max: 20 },     // así el pedido no cambia si después cambian los precios
  precioUnitario: Number
}, { _id: false });

// El pedido vincula al usuario, datos de contacto, productos, total, notas y estado.
const esquema = new mongoose.Schema({
  numero: { type: String, unique: true },          // por ejemplo "SDA-K3F9A2"
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, index: true },
  cliente: { nombre: String, correo: String, telefono: String },
  items: { type: [itemEsquema], validate: [(lista) => lista.length > 0, "El pedido necesita al menos un postre"] },
  total: { type: Number, required: true },
  notas: { type: String, maxlength: 200, default: "" },
  estado: { type: String, enum: ESTADOS, default: "pendiente" }
}, { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } });

// Se exporta el modelo y la lista de estados para validar cambios desde la API.
module.exports = mongoose.model("Pedido", esquema);
module.exports.ESTADOS = ESTADOS;
