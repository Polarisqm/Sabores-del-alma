// crea el primer administrador: npm run admin
// así la contraseña no queda escrita en ningún archivo del proyecto
require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcryptjs");
const { conectar, mongoose } = require("./db");
const Usuario = require("./modelos/Usuario");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function preguntar(texto) {
  return new Promise(function (resolver) {
    rl.question(texto, resolver);
  });
}

async function main() {
  const nombre = (await preguntar("Nombre del administrador: ")).trim();
  const correo = (await preguntar("Correo: ")).trim().toLowerCase();
  const telefono = (await preguntar("Teléfono: ")).trim();
  const clave = await preguntar("Contraseña (mínimo 10 caracteres): ");
  rl.close();

  if (nombre.length < 2 || !correo.includes("@") || telefono.length < 7) {
    console.log("Revisa el nombre, el correo y el teléfono.");
    process.exit(1);
  }
  if (clave.length < 10) {
    console.log("La contraseña es muy corta.");
    process.exit(1);
  }

  await conectar();
  const passwordHash = await bcrypt.hash(clave, 12);
  await Usuario.create({ nombre, correo, telefono, passwordHash, rol: "admin", aceptoDatos: true, fechaAceptacion: new Date() });
  console.log("Administrador creado:", correo);
  await mongoose.disconnect();
}

main().catch(function (error) {
  console.error("No se pudo crear el administrador:", error.message);
  process.exit(1);
});
