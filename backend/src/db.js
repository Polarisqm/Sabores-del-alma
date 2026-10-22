// conexión a MySQL. Un pool"reutiliza las conexiones en vez de abrir una por consulta. Se usará AIVEN en la nuve
require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2/promise");

const configuracion = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PUERTO) || 3306,
  user: process.env.DB_USUARIO,
  password: process.env.DB_CLAVE,
  database: process.env.DB_NOMBRE,
  waitForConnections: true,
  connectionLimit: 5, // el plan gratis de Aiven permite pocas conexiones a la vez// 1gb(ram) de datos como maximo
  charset: "utf8mb4"
};

// Aiven obliga a conectarse cifrado, con el certificado (ca.pem) que se descarga de su consola (importante)
if (process.env.DB_CA_RUTA) {
  configuracion.ssl = { ca: fs.readFileSync(process.env.DB_CA_RUTA) };
}

module.exports = mysql.createPool(configuracion);
