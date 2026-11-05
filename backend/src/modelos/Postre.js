const mongoose = require("mongoose");

// En este modelo documental, ingredientes y alérgenos se guardan dentro del documento de postre.
const ingredienteEsquema = new mongoose.Schema({
  seccion: String,   // por ejemplo "Capa cremosa" o "Cobertura"
  texto: String      // por ejemplo "200 g de queso crema"
}, { _id: false });

// Esquema principal de un postre y su emoción asociada.
const esquema = new mongoose.Schema({
  clave: { type: String, required: true, unique: true },   // es la misma clave de su emoción
  orden: { type: Number, default: 0 },
  emocion: { type: mongoose.Schema.Types.ObjectId, ref: "Emocion", required: true },
  nombre: { type: String, required: true, trim: true, maxlength: 80 },
  sabor: String,
  historia: String,
  imagen: String,
  precio: { type: Number, min: 0, max: 1000000, default: null },   // en pesos colombianos
  activo: { type: Boolean, default: true },
  // mientras sea false, la página avisa que los alérgenos todavía no están confirmados
  fichaConfirmada: { type: Boolean, default: false },
  ingredientes: [ingredienteEsquema],
  alergenos: [String]
}, { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } });

// Registra el modelo utilizado por las rutas públicas, de pedidos y del panel administrador.
module.exports = mongoose.model("Postre", esquema);
