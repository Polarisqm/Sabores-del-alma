// Carga o actualiza las emociones, postres y frases iniciales en MongoDB: npm run sembrar.
// Usa upsert por clave para poder volver a ejecutarse sin duplicar documentos.
require("dotenv").config();
const { conectar, mongoose } = require("./db");
const Emocion = require("./modelos/Emocion");
const Postre = require("./modelos/Postre");
const Frase = require("./modelos/Frase");
const semilla = require("./datos/semilla.json");

// Precio provisional solo para pruebas; debe reemplazarse por el real desde el panel.
const PRECIO_PROVISIONAL = 12000;

async function main() {
  // No comienza la carga hasta confirmar conexión con la base configurada.
  await conectar();

  // Recorre las emociones en orden y reemplaza sus frases para mantener la semilla coherente.
  for (let i = 0; i < semilla.emociones.length; i++) {
    const datos = semilla.emociones[i];
    const { frases, ...campos } = datos;

    // Actualiza por clave; upsert crea la emoción si todavía no existe.
    const emocion = await Emocion.findOneAndUpdate(
      { clave: datos.clave },
      { ...campos, orden: i + 1 },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    // Reemplaza el conjunto de frases para que no queden frases antiguas duplicadas.
    await Frase.deleteMany({ emocion: datos.clave });
    await Frase.insertMany(frases.map(function (texto) { return { emocion: datos.clave, texto }; }));

    // Busca el postre emparejado con la emoción que se está procesando.
    const postre = semilla.postres.find(function (p) { return p.clave === datos.clave; });
    await Postre.findOneAndUpdate(
      { clave: datos.clave },
      {
        $set: {
          orden: i + 1, emocion: emocion._id, nombre: postre.nombre, sabor: postre.sabor,
          historia: postre.historia, imagen: postre.imagen,
          ingredientes: postre.ingredientes, alergenos: postre.alergenos
        },
        // Los valores iniciales se aplican solo al crear, para no sobrescribir precios editados luego.
        $setOnInsert: { precio: PRECIO_PROVISIONAL, activo: true, fichaConfirmada: false }
      },
      { upsert: true }
    );
  }

  // Informa cantidades cargadas y recuerda que el precio de prueba debe revisarse.
  console.log("Listo:", await Emocion.countDocuments(), "emociones,", await Postre.countDocuments(), "postres,", await Frase.countDocuments(), "frases.");
  console.log("Recuerda cambiar los precios desde el panel de administrador (ahora valen $" + PRECIO_PROVISIONAL + " cada uno).");
  await mongoose.disconnect();
}

// Si falla cualquier operación, muestra la causa y devuelve error al proceso de npm.
main().catch(function (error) {
  console.error("No se pudo sembrar la base de datos:", error.message);
  process.exit(1);
});
