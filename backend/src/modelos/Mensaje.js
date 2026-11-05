const mongoose = require("mongoose");

// lo que llega por el formulario de contacto
const esquema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 80 },
  correo: { type: String, required: true, maxlength: 120 },
  asunto: { type: String, enum: ["consulta", "sugerencia", "colaboracion", "otro"], required: true },
  mensaje: { type: String, required: true, maxlength: 1000 },
  leido: { type: Boolean, default: false }
}, { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } });

module.exports = mongoose.model("Mensaje", esquema);
