// Configuración y conexión compartida a MongoDB Atlas mediante Mongoose.
require("dotenv").config();
const mongoose = require("mongoose");

// Evita que operadores enviados por el cliente se interpreten como filtros de consulta.
mongoose.set("sanitizeFilter", true);

async function conectar() {
  // Falla explícitamente si falta la URI, en vez de iniciar el servidor sin base de datos.
  if (!process.env.MONGODB_URI) {
    throw new Error("Falta MONGODB_URI en el archivo .env");
  }
  // Limita a ocho segundos la espera de selección de servidor ante problemas de red.
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  // Informa qué base quedó conectada, sin imprimir credenciales.
  console.log("Conectado a MongoDB:", mongoose.connection.name);
}

// Exporta la función de conexión y Mongoose para compartirlos con scripts y rutas.
module.exports = { conectar, mongoose };
