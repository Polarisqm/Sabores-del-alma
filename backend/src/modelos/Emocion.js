const mongoose = require("mongoose");

// Define los campos y validaciones que Mongoose guarda para cada emoción.
const esquema = new mongoose.Schema({
  clave: { type: String, required: true, unique: true },   // por ejemplo "alegria"
  orden: { type: Number, default: 0 },
  nombre: { type: String, required: true },
  colorHex: { type: String, required: true },
  colorNombre: String,
  significado: String,
  regulacion: String
});

// Registra el esquema y permite consultar la colección de emociones desde las rutas.
module.exports = mongoose.model("Emocion", esquema);
