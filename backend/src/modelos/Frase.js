const mongoose = require("mongoose");

// Esquema de las frases asociadas a la clave de una emoción.
const esquema = new mongoose.Schema({
  emocion: { type: String, required: true, index: true },   // la clave de la emoción
  texto: { type: String, required: true, maxlength: 200 }
});

// Registra el modelo que usan las rutas para buscar frases.
module.exports = mongoose.model("Frase", esquema);
