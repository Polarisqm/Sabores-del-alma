// carga las emociones, los postres y las frases en MongoDB: npm run sembrar
// se puede ejecutar varias veces sin duplicar nada
require("dotenv").config();
const { conectar, mongoose } = require("./db");
const Emocion = require("./modelos/Emocion");
const Postre = require("./modelos/Postre");
const Frase = require("./modelos/Frase");
const semilla = require("./datos/semilla.json");

// OJO: este precio es solo para poder probar la tienda.
// Cámbialo desde el panel de administrador por el precio real de cada postre.
const PRECIO_PROVISIONAL = 12000;

async function main() {
  await conectar();

  for (let i = 0; i < semilla.emociones.length; i++) {
    const datos = semilla.emociones[i];
    const { frases, ...campos } = datos;

    const emocion = await Emocion.findOneAndUpdate(
      { clave: datos.clave },
      { ...campos, orden: i + 1 },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    // las frases se vuelven a cargar completas
    await Frase.deleteMany({ emocion: datos.clave });
    await Frase.insertMany(frases.map(function (texto) { return { emocion: datos.clave, texto }; }));

    const postre = semilla.postres.find(function (p) { return p.clave === datos.clave; });
    await Postre.findOneAndUpdate(
      { clave: datos.clave },
      {
        $set: {
          orden: i + 1, emocion: emocion._id, nombre: postre.nombre, sabor: postre.sabor,
          historia: postre.historia, imagen: postre.imagen,
          ingredientes: postre.ingredientes, alergenos: postre.alergenos
        },
        // estos solo se ponen la primera vez, para no pisar los precios que cambies después
        $setOnInsert: { precio: PRECIO_PROVISIONAL, activo: true, fichaConfirmada: false }
      },
      { upsert: true }
    );
  }

  console.log("Listo:", await Emocion.countDocuments(), "emociones,", await Postre.countDocuments(), "postres,", await Frase.countDocuments(), "frases.");
  console.log("Recuerda cambiar los precios desde el panel de administrador (ahora valen $" + PRECIO_PROVISIONAL + " cada uno).");
  await mongoose.disconnect();
}

main().catch(function (error) {
  console.error("No se pudo sembrar la base de datos:", error.message);
  process.exit(1);
});
