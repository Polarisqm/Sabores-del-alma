// funciones pequeñas para revisar lo que escribe la gente en los formularios
const mongoose = require("mongoose");

// convierte cualquier cosa en texto, lo recorta y le pone un máximo de caracteres
function texto(valor, maximo) {
  return String(valor === undefined || valor === null ? "" : valor).trim().slice(0, maximo);
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && correo.length <= 120;
}

// acepta espacios, guiones, paréntesis y el + del indicativo, pero tienen que quedar entre 7 y 15 números
function telefonoValido(telefono) {
  const soloNumeros = telefono.replace(/[\s()+-]/g, "");
  return /^\d{7,15}$/.test(soloNumeros);
}

function idValido(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = { texto, correoValido, telefonoValido, idValido };
