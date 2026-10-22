// crea el primer administrador: npm run admin como funcion principal
require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcryptjs");
const db = require("./db");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function preguntar(texto) {
  return new Promise(function (resolver) {
    rl.question(texto, resolver);
  });
}

async function main() {
  const nombre = (await preguntar("Nombre del administrador: ")).trim();
  const correo = (await preguntar("Correo: ")).trim().toLowerCase();
  const clave = await preguntar("Contraseña (mínimo 10 caracteres): ");
  rl.close();

  if (nombre.length < 2 || !correo.includes("@")) {
    console.log("Revisa el nombre y el correo.");
    process.exit(1);
  }
  if (clave.length < 10) {
    console.log("La contraseña es muy corta.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(clave, 12);
  await db.query(
    "INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, 'admin')",
    [nombre, correo, hash]
  );
  console.log("Administrador creado:", correo);
  process.exit(0);
}

main().catch(function (error) {
  console.error("No se pudo crear el administrador:", error.message);
  process.exit(1);
});
