require("dotenv").config();
// Express administra las rutas HTTP; CORS autoriza el frontend y Helmet agrega cabeceras seguras.
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { conectar } = require("./db");
const rutasPublicas = require("./rutas/publicas");
const rutasAuth = require("./rutas/auth");
const rutasPedidos = require("./rutas/pedidos");
const rutasAdmin = require("./rutas/admin");

// Sin este secreto no pueden firmarse sesiones; detenerse aquí evita iniciar una API insegura.
if (!process.env.JWT_SECRETO) {
  console.error("Falta JWT_SECRETO en el archivo .env");
  process.exit(1);
}

// Crea la aplicación que recibe y distribuye las peticiones.
const app = express();

// En despliegues detrás de proxy, permite que Express lea la IP original para límites de frecuencia.
if (process.env.CONFIAR_PROXY) app.set("trust proxy", 1);

// Instala protecciones HTTP, parseo JSON con límite de tamaño y política CORS del frontend.
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: (process.env.FRONTEND_URL || "").split(",") }));

// Ruta de salud usada para comprobar que el backend responde.
app.get("/api/salud", function (req, res) {
  res.json({ ok: true });
});

// Monta cada grupo de endpoints bajo su prefijo común.
app.use("/api", rutasPublicas);
app.use("/api/auth", rutasAuth);
app.use("/api/pedidos", rutasPedidos);
app.use("/api/admin", rutasAdmin);

// Si ninguna ruta coincide, responde 404 en formato JSON.
app.use(function (req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador común: registra fallos, distingue JSON mal formado y evita filtrar detalles al cliente.
app.use(function (error, req, res, next) {
  console.error(error);
  // un JSON mal escrito es culpa de quien lo mandó, no del servidor
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido" });
  }
  res.status(500).json({ error: "Algo falló en el servidor" });
});

// Permite cambiar el puerto en despliegue; localmente usa 3000.
const puerto = process.env.PUERTO || 3000;

// Conecta a MongoDB antes de aceptar peticiones para evitar responder con una base desconectada.
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

// Exporta la aplicación para pruebas automatizadas o integración con otras herramientas.
module.exports = app;
