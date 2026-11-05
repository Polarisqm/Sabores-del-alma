const mongoose = require("mongoose");

const esquema = new mongoose.Schema({
  emocion: { type: String, required: true, index: true },   // la clave de la emoción
  texto: { type: String, required: true, maxlength: 200 }
});

module.exports = mongoose.model("Frase", esquema);
