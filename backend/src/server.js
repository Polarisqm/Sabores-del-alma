require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rutasPublicas = require("./rutas/publicas");
const rutasAuth = require("./rutas/auth");
const rutasAdmin = require("./rutas/admin");

// sin esta clave los tokens no se podrían firmar, mejor avisar de una vez
if (!process.env.JWT_SECRETO) {
  console.error("Falta JWT_SECRETO en el archivo .env");
  process.exit(1);
}

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: (process.env.FRONTEND_URL || "").split(",") }));

app.get("/api/salud", function (req, res) {
  res.json({ ok: true });
});

app.use("/api", rutasPublicas);
app.use("/api/auth", rutasAuth);
app.use("/api/admin", rutasAdmin);

app.use(function (req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// manejador general de errores
app.use(function (error, req, res, next) {
  console.error(error);
  res.status(500).json({ error: "Algo falló en el servidor" });
});

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function () {
  console.log("API de Sabores del Alma escuchando en http://localhost:" + puerto);
});
