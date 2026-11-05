// conexión a MongoDB con mongoose
require("dotenv").config();
const mongoose = require("mongoose");

// evita que alguien mande cosas como { "$ne": "" } dentro de una búsqueda
mongoose.set("sanitizeFilter", true);

async function conectar() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Falta MONGODB_URI en el archivo .env");
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("Conectado a MongoDB:", mongoose.connection.name);
}

module.exports = { conectar, mongoose };
