require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { conectar } = require("./db");
const rutasPublicas = require("./rutas/publicas");
const rutasAuth = require("./rutas/auth");
const rutasPedidos = require("./rutas/pedidos");
const rutasAdmin = require("./rutas/admin");

// sin esta clave los tokens no se podrían firmar, mejor avisar de una vez
if (!process.env.JWT_SECRETO) {
  console.error("Falta JWT_SECRETO en el archivo .env");
  process.exit(1);
}

const app = express();

// cuando el servidor esté publicado detrás de un proxy, el límite de intentos necesita saberlo
if (process.env.CONFIAR_PROXY) app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: (process.env.FRONTEND_URL || "").split(",") }));

app.get("/api/salud", function (req, res) {
  res.json({ ok: true });
});

app.use("/api", rutasPublicas);
app.use("/api/auth", rutasAuth);
app.use("/api/pedidos", rutasPedidos);
app.use("/api/admin", rutasAdmin);

app.use(function (req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// manejador general de errores
app.use(function (error, req, res, next) {
  console.error(error);
  // un JSON mal escrito es culpa de quien lo mandó, no del servidor
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido" });
  }
  res.status(500).json({ error: "Algo falló en el servidor" });
});

const puerto = process.env.PUERTO || 3000;

conectar()
  .then(function () {
    app.listen(puerto, function () {
      console.log("API de Sabores del Alma escuchando en http://localhost:" + puerto);
    });
  })
  .catch(function (error) {
    console.error("No se pudo conectar con MongoDB:", error.message);
    process.exit(1);
  });

module.exports = app;
