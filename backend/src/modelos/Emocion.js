const mongoose = require("mongoose");

const esquema = new mongoose.Schema({
  clave: { type: String, required: true, unique: true },   // por ejemplo "alegria"
  orden: { type: Number, default: 0 },
  nombre: { type: String, required: true },
  colorHex: { type: String, required: true },
  colorNombre: String,
  significado: String,
  regulacion: String
});

module.exports = mongoose.model("Emocion", esquema);
