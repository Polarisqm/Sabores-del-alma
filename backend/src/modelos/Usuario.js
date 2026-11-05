const mongoose = require("mongoose");

const esquema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
  telefono: { type: String, required: true, trim: true, maxlength: 20 },
  // la contraseña NUNCA se guarda tal cual, solo su hash
  passwordHash: { type: String, required: true },
  rol: { type: String, enum: ["cliente", "admin"], default: "cliente" },
  // la persona autorizó que guardemos sus datos al registrarse
  aceptoDatos: { type: Boolean, default: false },
  fechaAceptacion: Date
}, { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } });

module.exports = mongoose.model("Usuario", esquema);
