// Script interactivo para crear un administrador sin poner su contraseña en archivos del proyecto.
require("dotenv").config();
// readline solicita los datos desde la terminal.
const readline = require("readline");
// bcrypt transforma la contraseña en un hash irreversible antes de guardarla.
const bcrypt = require("bcryptjs");
// Se reutilizan la conexión y los modelos del backend.
const { conectar, mongoose } = require("./db");
const Usuario = require("./modelos/Usuario");

// Mantiene abiertas las preguntas interactivas mientras se recopilan los datos.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Envuelve readline en una promesa para poder esperar cada respuesta con await.
function preguntar(texto) {
  return new Promise(function (resolver) {
    rl.question(texto, resolver);
  });
}

async function main() {
  // Recoge los datos y normaliza el correo para evitar duplicados por mayúsculas.
  const nombre = (await preguntar("Nombre del administrador: ")).trim();
  const correo = (await preguntar("Correo: ")).trim().toLowerCase();
  const telefono = (await preguntar("Teléfono: ")).trim();
  const clave = await preguntar("Contraseña (mínimo 10 caracteres): ");
  // Cierra la entrada interactiva antes de validar y conectar a la base.
  rl.close();

  // Rechaza datos básicos inválidos antes de realizar operaciones en MongoDB.
  if (nombre.length < 2 || !correo.includes("@") || telefono.length < 7) {
    console.log("Revisa el nombre, el correo y el teléfono.");
    process.exit(1);
  }
  if (clave.length < 10) {
    console.log("La contraseña es muy corta.");
    process.exit(1);
  }

  // Se conecta solo después de validar; el costo 12 fortalece el hash frente a intentos de adivinar.
  await conectar();
  const passwordHash = await bcrypt.hash(clave, 12);
  // Guarda el rol administrativo y cierra la conexión al terminar.
  await Usuario.create({ nombre, correo, telefono, passwordHash, rol: "admin", aceptoDatos: true, fechaAceptacion: new Date() });
  console.log("Administrador creado:", correo);
  await mongoose.disconnect();
}

// Expone errores de inicialización y devuelve un código distinto de cero a la terminal.
main().catch(function (error) {
  console.error("No se pudo crear el administrador:", error.message);
  process.exit(1);
});
