// Validaciones reutilizables para normalizar campos y comprobar formatos antes de usar la base.
const mongoose = require("mongoose");

// Convierte valores nulos en texto vacío, elimina espacios exteriores y aplica longitud máxima.
function texto(valor, maximo) {
  return String(valor === undefined || valor === null ? "" : valor).trim().slice(0, maximo);
}

function correoValido(correo) {
  // Exige una estructura básica usuario@dominio y limita el tamaño almacenado.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && correo.length <= 120;
}

// acepta espacios, guiones, paréntesis y el + del indicativo, pero tienen que quedar entre 7 y 15 números
function telefonoValido(telefono) {
  // Quita separadores legibles y valida que queden entre siete y quince dígitos.
  const soloNumeros = telefono.replace(/[\s()+-]/g, "");
  return /^\d{7,15}$/.test(soloNumeros);
}

function idValido(id) {
  // Evita pedir a MongoDB que busque identificadores con formato inválido.
  return mongoose.isValidObjectId(id);
}

// Exporta las reglas para que rutas distintas mantengan criterios consistentes.
module.exports = { texto, correoValido, telefonoValido, idValido };
