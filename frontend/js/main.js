//Sabores del Alma//navegación y vistas
const emociones = {
  alegria: { nombre: "Alegría", color: "Ámbar y rosa", sabor: "Mango y fresa", postre: "Dulce Aurora",
    significado: "Es una emoción agradable que aparece cuando algo nos hace sentir bien. Sirve para celebrar y compartir.",
    frase: "Hoy mereces celebrar lo que sí está saliendo bien.",
    regulacion: "Compártela con alguien y date un momento para notar qué la provocó." },

  tristeza: { nombre: "Tristeza", color: "Violeta lavanda", sabor: "Arándanos y crema", postre: "Luna Serena",
    significado: "Suele aparecer ante una pérdida o una decepción. Sentirla no es malo: nos invita a parar y cuidarnos.",
    frase: "Puedes sentir esto sin tener que explicarlo todavía.",
    regulacion: "Escribe lo que sientes o cuéntaselo a alguien de confianza. Si dura mucho, busca apoyo profesional." },

  ira: { nombre: "Ira", color: "Carmesí", sabor: "Chocolate y frutos rojos", postre: "Fuego Carmesí",
    significado: "Es una emoción intensa que suele aparecer cuando algo nos parece injusto o nos frustra. Activa el cuerpo.",
    frase: "Sentir enojo no te hace una mala persona; lo importante es qué haces con él.",
    regulacion: "Haz una pausa, respira lento unas cuantas veces y espera antes de responder." },



    
  miedo: { nombre: "Miedo", color: "Ciruela oscuro", sabor: "Chocolate y mora", postre: "Velo Nocturno",
    significado: "Es una alarma del cuerpo ante algo que percibimos como una amenaza. Nos prepara para cuidarnos.",
    frase: "Tener miedo no significa que no puedas con esto.",
    regulacion: "Respira lento, nombra lo que te asusta y busca a alguien con quien hablarlo." },
  asco: { nombre: "Asco", color: "Verde oliva", sabor: "Manzana suave", postre: "Ámbar Velado",
    significado: "Es una reacción de rechazo hacia algo que sentimos que nos puede hacer daño o que no nos gusta.",
    frase: "Tu cuerpo también te avisa lo que no quieres cerca.",
    regulacion: "Aléjate de lo que lo provoca y date un momento para que se te pase." },
  sorpresa: { nombre: "Sorpresa", color: "Dorado", sabor: "Mango y maracuyá", postre: "Secreto Dorado",
    significado: "Aparece de golpe ante algo inesperado. Dura poco y suele dar paso a otra emoción.",
    frase: "Lo inesperado también puede traer algo bueno.",
    regulacion: "Date unos segundos para entender qué pasó antes de reaccionar." },
  desprecio: { nombre: "Desprecio", color: "Café caramelo", sabor: "Chocolate, café y caramelo", postre: "Desdén",
    significado: "Es sentir que algo o alguien está por debajo de nosotros. Conviene mirar de dónde viene ese rechazo.",
    frase: "Preguntarte de dónde viene lo que sientes ya es un paso.",
    regulacion: "Piensa qué lo provocó y trata de ponerte en el lugar del otro antes de juzgar." }
};

// la historia de cada postre, así lo imaginamos
const historias = {
  alegria: "Dulce Aurora nace de la primera luz del día: capas de color ámbar que se funden entre sí, como cuando algo bueno apenas empieza y ya se siente.",
  tristeza: "Luna Serena es el postre de las noches tranquilas. Su azul suave recuerda a la luna cuando todo se calma, y su textura invita a ir despacio.",
  ira: "Fuego Carmesí es un rojo profundo que se siente antes de probarse. Es intenso a propósito, porque hay emociones que merecen sentirse con toda su fuerza y con cuidado.",
  miedo: "Velo Nocturno es un violeta oscuro, como una cortina de noche. Lo que no vemos asusta, pero con una cucharada a la vez el misterio se vuelve conocido.",
  asco: "Ámbar Velado es un dorado apagado, como una luz detrás de un cristal empañado. Habla de lo que preferimos mantener a distancia y del valor de decir que no.",
  sorpresa: "Secreto Dorado guarda un destello inesperado. Es el postre del asombro: nunca sabes del todo qué vas a encontrar hasta que lo pruebas.",
  desprecio: "Desdén es elegante y de pocas palabras, con un color que mantiene la distancia. Nos invita a mirar de dónde viene lo que rechazamos antes de dar la espalda."
};

// frases de cada emoción: cada vez que se entra a una, sale una distinta
const frases = {
  alegria: ["Hoy la vida te sabe a algo dulce.", "Tu alegría también ilumina a quienes te rodean.", "Celebrar lo pequeño es otra forma de agradecer.", "Que no falte una razón para sonreír hoy.", "La alegría compartida sabe el doble."],
  tristeza: ["Incluso la noche más larga termina en amanecer.", "Está bien detenerse un momento a sentir.", "Lo que hoy pesa, mañana puede ser sabiduría.", "Hasta la luna descansa antes de volver a brillar.", "No tienes que explicarlo todo para que sea válido."],
  ira: ["El fuego también da calor si lo cuidas.", "Sentir enojo no te define; lo que haces con él, sí.", "Antes de responder, deja que el fuego baje.", "Detrás de cada enojo suele haber algo que te importa.", "Tu fuerza vale más cuando la usas con calma."],
  miedo: ["Hasta en la noche más oscura se aprende a ver.", "Tener miedo no te hace menos valiente.", "Lo desconocido también guarda cosas buenas.", "Dar un paso pequeño ya es dar un paso.", "Ponerle nombre al miedo le quita algo de poder."],
  asco: ["Tus límites también hablan de lo que valoras.", "Rechazar lo que no te gusta es una forma de cuidarte.", "No todo tiene que gustarte para que lo entiendas.", "Saber qué no quieres te acerca a lo que sí.", "Tomar distancia también es una decisión."],
  sorpresa: ["La vida guarda secretos que valen la pena.", "Hoy puede pasar algo que no esperabas.", "Lo inesperado a veces llega envuelto en dorado.", "Quédate con la curiosidad; casi nunca falla.", "Un instante de asombro cambia todo el día."],
  desprecio: ["Antes de juzgar, pregúntate de dónde viene el rechazo.", "Mirar con curiosidad abre más puertas que mirar por encima.", "Lo que desdeñas dice algo de lo que valoras.", "Cambiar la mirada también es cambiar la historia.", "Detrás de cada distancia hay una razón que entender."]
};

// fichas de los postres (provisionales: hay que confirmar con las recetas reales)
const fichas = {
  alegria: {
    "ingredientes": [
      {
        "seccion": "Capa principal",
        "items": [
          "100 ml de leche",
          "100 g de pulpa de mango",
          "100 g de puré de fresa",
          "1 cucharadita de vainilla",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia líquida: cantidad equivalente a 15–20 g de azúcar, según la etiqueta"
        ]
      },
      {
        "seccion": "Cobertura",
        "items": [
          "80 g de mango",
          "60 g de fresa",
          "3 g de gelatina sin sabor y 15 ml de agua",
          "Estevia al gusto, comenzando con una cantidad equivalente a 5 g de azúcar"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  },
  tristeza: {
    "ingredientes": [
      {
        "seccion": "Capa cremosa",
        "items": [
          "200 g de queso crema",
          "150 ml de crema de leche",
          "100 ml de leche",
          "100 g de puré de arándanos",
          "1 cucharadita de vainilla",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia equivalente a 20–25 g de azúcar"
        ]
      },
      {
        "seccion": "Cobertura",
        "items": [
          "100 g de arándanos triturados",
          "20 ml de agua",
          "3 g de gelatina sin sabor",
          "Estevia equivalente a 5–10 g de azúcar"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  },
  ira: {
    "ingredientes": [
      {
        "seccion": "Capa cremosa",
        "items": [
          "200 g de queso crema",
          "150 ml de crema de leche",
          "100 g de chocolate semiamargo",
          "80 g de puré de frutos rojos",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia equivalente a 10–15 g de azúcar"
        ]
      },
      {
        "seccion": "Cobertura",
        "items": [
          "100 g de puré de frutos rojos",
          "3 g de gelatina sin sabor y 15 ml de agua",
          "Estevia equivalente a 5–10 g de azúcar"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  },
  miedo: {
    "ingredientes": [
      {
        "seccion": "Capa cremosa",
        "items": [
          "200 g de queso crema",
          "150 ml de crema de leche",
          "100 g de chocolate semiamargo, preferiblemente con 60–70 % de cacao",
          "80 g de puré de mora",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia equivalente a 10–15 g de azúcar, ajustando después de probar el chocolate"
        ]
      },
      {
        "seccion": "Cobertura",
        "items": [
          "100 g de puré de mora",
          "3 g de gelatina sin sabor y 15 ml de agua",
          "Estevia equivalente a 5–10 g de azúcar"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  },
  asco: {
    "ingredientes": [
      {
        "seccion": "Capa cremosa",
        "items": [
          "200 g de queso crema",
          "150 ml de crema de leche",
          "100 ml de leche",
          "120 g de puré de manzana",
          "Una pizca de canela, opcional",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia equivalente a 15–20 g de azúcar"
        ]
      },
      {
        "seccion": "Cobertura",
        "items": [
          "80 g de puré de manzana",
          "3 g de gelatina sin sabor y 15 ml de agua",
          "Estevia equivalente a 5 g de azúcar",
          "Una pequeña cantidad de colorante verde, opcional"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  },
  sorpresa: {
    "ingredientes": [
      {
        "seccion": "Capa cremosa",
        "items": [
          "200 g de queso crema",
          "150 ml de crema de leche",
          "100 ml de leche",
          "100 g de pulpa de mango",
          "60 g de pulpa de maracuyá colada",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia equivalente a 15–20 g de azúcar"
        ]
      },
      {
        "seccion": "Cobertura",
        "items": [
          "80 g de pulpa de maracuyá",
          "40 g de mango",
          "3 g de gelatina sin sabor y 15 ml de agua",
          "Estevia equivalente a 5–10 g de azúcar"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  },
  desprecio: {
    "ingredientes": [
      {
        "seccion": "Capa principal",
        "items": [
          "100 g de chocolate semiamargo",
          "50 ml de café concentrado y frío",
          "7 g de gelatina sin sabor y 35 ml de agua",
          "Estevia equivalente a 10–15 g de azúcar"
        ]
      },
      {
        "seccion": "Cobertura de chocolate",
        "items": [
          "50 g de chocolate semiamargo",
          "30 ml de crema de leche"
        ]
      },
      {
        "seccion": "Salsa tipo caramelo reducida en azúcar",
        "items": [
          "15 g de azúcar convencional",
          "30 ml de crema de leche",
          "10 g de mantequilla",
          "Una pizca de sal, opcional"
        ]
      }
    ],
    "alergenos": [
      "Lácteos"
    ]
  }
};

const vistas = document.querySelectorAll(".vista");
const botonMenu = document.getElementById("boton-menu");
const menu = document.getElementById("menu-principal");

function mostrarVista() {
  // la ruta es algo como "#/emocion/ira"
  const partes = location.hash.replace("#/", "").split("/");
  let nombre = partes[0] || "inicio";
  if (nombre === "emocion" && !emociones[partes[1]]) nombre = "emociones";

  let actual = null;
  vistas.forEach(function (v) {
    const esta = v.dataset.vista === nombre;
    v.classList.toggle("activa", esta);
    if (esta) actual = v;
  });
  if (!actual) { location.hash = "#/"; return; }

  if (nombre === "emocion") llenarEmocion(partes[1]);
  else delete document.body.dataset.emocion;

  const titulo = nombre === "emocion" ? emociones[partes[1]].postre : actual.dataset.titulo;
  document.title = titulo + " | Sabores del Alma";
  document.querySelectorAll(".menu a.enlace-menu").forEach(function (a) {
    const activo = a.getAttribute("href") === "#/" + nombre;
    if (activo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  cerrarMenus();
  window.scrollTo(0, 0);
  document.getElementById("contenido").focus({ preventScroll: true });
}

function llenarEmocion(clave) {
  const e = emociones[clave];
  document.body.dataset.emocion = clave;
  document.getElementById("e-nombre").textContent = e.postre;
  document.getElementById("e-color").textContent = e.color;
  document.getElementById("e-sabor").textContent = e.sabor;
  document.getElementById("e-emocion").textContent = e.nombre;
  document.getElementById("e-emocion-sub").textContent = e.nombre.toLowerCase();
  const foto = document.getElementById("e-img");
  foto.src = "img/postre-" + clave + ".jpg";
  foto.alt = e.postre;
  document.getElementById("e-significado").textContent = e.significado;
  ponerFrase(clave);
  document.getElementById("e-historia").textContent = historias[clave];
  document.getElementById("e-regulacion").textContent = e.regulacion;
  llenarFicha(clave);
  claveActual = clave;
  nuevoArte(clave);
  dibujarTarjeta(clave);
}

function cerrarMenus() {
  menu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
  document.querySelectorAll(".con-panel").forEach(function (p) {
    p.classList.remove("abierto");
    p.querySelector("button").setAttribute("aria-expanded", "false");
  });
}

botonMenu.addEventListener("click", function () {
  const abierto = menu.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", abierto);
});

document.querySelectorAll(".con-panel > button").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const li = boton.parentElement;
    const estabaAbierto = li.classList.contains("abierto");
    cerrarPaneles();
    li.classList.toggle("abierto", !estabaAbierto);
    boton.setAttribute("aria-expanded", !estabaAbierto);
  });
});

function cerrarPaneles() {
  document.querySelectorAll(".con-panel").forEach(function (p) {
    p.classList.remove("abierto");
    p.querySelector("button").setAttribute("aria-expanded", "false");
  });
}

// cerrar el panel al hacer click afuera o con Escape
document.addEventListener("click", function (ev) {
  if (!ev.target.closest(".con-panel")) cerrarPaneles();
});
document.addEventListener("keydown", function (ev) {
  if (ev.key === "Escape") cerrarMenus();
});

// ---- ficha del postre ----
function agregarItems(lista, textos) {
  lista.innerHTML = "";
  textos.forEach(function (texto) {
    const li = document.createElement("li");
    li.textContent = texto;
    lista.appendChild(li);
  });
}

function llenarFicha(clave) {
  const f = fichas[clave];
  // los ingredientes vienen por secciones: capa, cobertura, salsa...
  const contenedor = document.getElementById("e-ingredientes");
  contenedor.innerHTML = "";
  f.ingredientes.forEach(function (grupo) {
    const titulo = document.createElement("h4");
    titulo.textContent = grupo.seccion;
    const lista = document.createElement("ul");
    lista.className = "ingredientes";
    agregarItems(lista, grupo.items);
    contenedor.append(titulo, lista);
  });
  // null significa que el postre todavía no está definido
  agregarItems(document.getElementById("e-alergenos"), f.alergenos === null ? ["Por definir"] : f.alergenos);
}

// ---- tarjeta para compartir ----
const canvas = document.getElementById("tarjeta");
let ctx = canvas.getContext("2d");
let claveActual = null;

function partirTexto(texto, anchoMax) {
  const palabras = texto.split(" ");
  const lineas = [];
  let linea = "";
  palabras.forEach(function (palabra) {
    const prueba = linea ? linea + " " + palabra : palabra;
    if (ctx.measureText(prueba).width > anchoMax && linea) {
      lineas.push(linea);
      linea = palabra;
    } else {
      linea = prueba;
    }
  });
  lineas.push(linea);
  return lineas;
}

function rectRedondeado(x, y, ancho, alto, radio) {
  ctx.beginPath();
  ctx.moveTo(x + radio, y);
  ctx.arcTo(x + ancho, y, x + ancho, y + alto, radio);
  ctx.arcTo(x + ancho, y + alto, x, y + alto, radio);
  ctx.arcTo(x, y + alto, x, y, radio);
  ctx.arcTo(x, y, x + ancho, y, radio);
  ctx.closePath();
}

function leerColor(nombre) {
  return getComputedStyle(document.body).getPropertyValue(nombre).trim();
}

function dibujarTarjeta(clave) {
  const e = emociones[clave];
  const acento = leerColor("--acento");
  const fondo = leerColor("--fondo");
  const tinta = leerColor("--tinta");
  const oro = leerColor("--oro");
  const titulos = '"Cormorant Garamond", Georgia, serif';
  const texto = '"Lora", Georgia, serif';
  const ancho = canvas.width;
  const alto = canvas.height;
  const para = document.getElementById("dedicatoria").value.trim();

  ctx.clearRect(0, 0, ancho, alto);
  ctx.fillStyle = acento;
  ctx.fillRect(0, 0, ancho, alto);

  ctx.fillStyle = fondo;
  rectRedondeado(70, 70, ancho - 140, alto - 140, 60);
  ctx.fill();
  ctx.strokeStyle = oro;
  ctx.lineWidth = 3;
  rectRedondeado(100, 100, ancho - 200, alto - 200, 40);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = oro;
  ctx.font = '600 34px "Jost", sans-serif';
  ctx.letterSpacing = "8px";
  ctx.fillText("POSTRES DE EMOCIONES", ancho / 2, 190);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = tinta;
  ctx.font = "700 70px " + titulos;
  ctx.fillText("Sabores del Alma", ancho / 2, 275);

  // el dibujo de la emoción
  dibujarArte(clave, acento, oro);

  ctx.fillStyle = tinta;
  ctx.font = "700 104px " + titulos;
  ctx.fillText(e.postre, ancho / 2, 800);

  ctx.fillStyle = oro;
  ctx.font = "italic 600 52px " + titulos;
  ctx.fillText(e.nombre, ancho / 2, 868);
  ctx.font = "600 32px " + texto;
  ctx.fillText("Color " + e.color.toLowerCase(), ancho / 2, 920);

  ctx.fillStyle = tinta;
  ctx.font = "italic 600 50px " + titulos;
  const lineas = partirTexto("“" + fraseActual + "”", 780);
  lineas.forEach(function (linea, i) {
    ctx.fillText(linea, ancho / 2, 1010 + i * 60);
  });

  if (para) {
    ctx.fillStyle = oro;
    ctx.font = "600 38px " + texto;
    ctx.fillText("Para " + para, ancho / 2, alto - 175);
  }
  ctx.fillStyle = tinta;
  ctx.font = "600 32px " + texto;
  ctx.fillText("Siente, expresa y saborea", ancho / 2, alto - 125);
}

document.getElementById("descargar").addEventListener("click", function () {
  const enlace = document.createElement("a");
  enlace.download = "sabores-del-alma-" + claveActual + ".png";
  enlace.href = canvas.toDataURL("image/png");
  enlace.click();
});

// cuando carguen las tipografías, la tarjeta se vuelve a dibujar
document.fonts.ready.then(function () {
  if (claveActual) dibujarTarjeta(claveActual);
});

// ---- frases al azar ----
let fraseActual = "";
const ultimaFrase = {};

function elegirFrase(clave) {
  const lista = frases[clave];
  let nueva;
  // busco una distinta a la que salió la última vez en esta emoción
  do {
    nueva = lista[Math.floor(Math.random() * lista.length)];
  } while (nueva === ultimaFrase[clave]);
  ultimaFrase[clave] = nueva;
  return nueva;
}

function ponerFrase(clave) {
  fraseActual = elegirFrase(clave);
  document.getElementById("e-frase").textContent = fraseActual;
}

document.getElementById("otra-frase").addEventListener("click", function () {
  ponerFrase(claveActual);
  dibujarTarjeta(claveActual);
});

document.getElementById("dedicatoria").addEventListener("input", function () {
  if (claveActual) dibujarTarjeta(claveActual);
});

// ---- postre del día: cambia solo cada día ----
function postreDelDia() {
  const claves = Object.keys(emociones);
  const dia = Math.floor(Date.now() / 86400000);
  const clave = claves[dia % claves.length];
  const caja = document.getElementById("del-dia");
  caja.href = "#/emocion/" + clave;
  caja.dataset.emocion = clave;
  const foto = document.getElementById("dd-img");
  foto.src = "img/postre-" + clave + ".jpg";
  foto.alt = emociones[clave].postre;
  document.getElementById("dd-nombre").textContent = emociones[clave].postre;
  document.getElementById("dd-emocion").textContent = "Para sentir " + emociones[clave].nombre.toLowerCase();
  document.getElementById("dd-frase").textContent = "“" + frases[clave][dia % frases[clave].length] + "”";
}
postreDelDia();

// ---- pestañas de la ciencia ----
const pestanas = document.querySelectorAll(".pestana");

function mostrarPestana(nombre) {
  pestanas.forEach(function (p) {
    const activa = p.dataset.panel === nombre;
    p.classList.toggle("activa", activa);
    p.setAttribute("aria-selected", activa);
  });
  document.querySelectorAll(".panel-ciencia").forEach(function (panel) {
    panel.hidden = panel.id !== "p-" + nombre;
  });
}

pestanas.forEach(function (p) {
  p.addEventListener("click", function () {
    mostrarPestana(p.dataset.panel);
  });
});
mostrarPestana("cerebro");

// ---- mezclador de emociones ----
// una palabra por emoción para inventar el nombre de la mezcla
const palabras = { alegria: "Luz", tristeza: "Niebla", ira: "Brasa", miedo: "Sombra", asco: "Humo", sorpresa: "Destello", desprecio: "Hielo" };
const selA = document.getElementById("mez-a");
const selB = document.getElementById("mez-b");
const avisoMezcla = document.getElementById("mez-aviso");

// lleno los dos selects con las emociones
Object.keys(emociones).forEach(function (clave) {
  [selA, selB].forEach(function (sel) {
    const opcion = document.createElement("option");
    opcion.value = clave;
    opcion.textContent = emociones[clave].postre + " (" + emociones[clave].nombre.toLowerCase() + ")";
    sel.appendChild(opcion);
  });
});
selB.selectedIndex = 1;

function fraseAlAzar(clave) {
  const lista = frases[clave];
  return lista[Math.floor(Math.random() * lista.length)];
}

function mezclar() {
  const a = selA.value;
  const b = selB.value;
  const resultado = document.getElementById("mez-resultado");

  if (a === b) {
    resultado.hidden = true;
    avisoMezcla.textContent = "Elige dos emociones distintas para mezclarlas.";
    return;
  }
  avisoMezcla.textContent = "";

  // los dos dibujos se mezclan en un solo lienzo
  pintarMezcla(a, b);

  document.getElementById("mez-titulo").textContent = palabras[a] + " y " + palabras[b];
  document.getElementById("mez-descripcion").textContent =
    "Sentir " + emociones[a].nombre.toLowerCase() + " y " + emociones[b].nombre.toLowerCase() +
    " a la vez es más común de lo que parece. Las emociones casi nunca llegan solas.";
  document.getElementById("mez-postres").textContent = emociones[a].postre + " junto a " + emociones[b].postre + ".";
  document.getElementById("mez-frases").textContent = "“" + fraseAlAzar(a) + "” “" + fraseAlAzar(b) + "”";
  resultado.hidden = false;
}

document.getElementById("mez-boton").addEventListener("click", mezclar);

// ---- fondo animado: polvo dorado que sube despacio ----
const lienzoFondo = document.getElementById("fondo");
const cf = lienzoFondo.getContext("2d");
let particulas = [];

function crearParticula(enCualquierLado) {
  return {
    x: Math.random() * lienzoFondo.width,
    y: enCualquierLado ? Math.random() * lienzoFondo.height : lienzoFondo.height + 10,
    r: 0.8 + Math.random() * 2.2,
    v: 0.15 + Math.random() * 0.35,
    fase: Math.random() * Math.PI * 2
  };
}

function iniciarFondo() {
  lienzoFondo.width = window.innerWidth;
  lienzoFondo.height = window.innerHeight;
  const cantidad = Math.min(70, Math.floor(window.innerWidth / 18));
  particulas = [];
  for (let i = 0; i < cantidad; i++) particulas.push(crearParticula(true));
}

function dibujarFondo(t) {
  cf.clearRect(0, 0, lienzoFondo.width, lienzoFondo.height);
  particulas.forEach(function (p) {
    p.y -= p.v;
    p.x += Math.sin(t / 2000 + p.fase) * 0.25;
    if (p.y < -10) Object.assign(p, crearParticula(false));
    const brillo = 0.2 + 0.35 * (Math.sin(t / 900 + p.fase) + 1) / 2;
    // un halo suave y el punto brillante encima
    cf.fillStyle = "rgba(217, 190, 139, " + (brillo * 0.2) + ")";
    cf.beginPath();
    cf.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
    cf.fill();
    cf.fillStyle = "rgba(240, 215, 160, " + brillo + ")";
    cf.beginPath();
    cf.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cf.fill();
  });
}

function animarFondo(t) {
  dibujarFondo(t);
  requestAnimationFrame(animarFondo);
}

iniciarFondo();
window.addEventListener("resize", iniciarFondo);
// si la persona pidió menos movimiento, dibujo el fondo quieto
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) dibujarFondo(0);
else requestAnimationFrame(animarFondo);

// ---- Ángel, el asistente flotante ----
const botonAsistente = document.getElementById("asistente-boton");
const panelAsistente = document.getElementById("asistente-panel");
const globoAsistente = document.getElementById("asistente-globo");
const chat = document.getElementById("chat-mensajes");

function abrirAsistente() {
  panelAsistente.hidden = false;
  globoAsistente.hidden = true;
  botonAsistente.setAttribute("aria-expanded", "true");
  document.getElementById("chat-texto").focus();
}

function cerrarAsistente() {
  panelAsistente.hidden = true;
  botonAsistente.setAttribute("aria-expanded", "false");
}

botonAsistente.addEventListener("click", function () {
  if (panelAsistente.hidden) abrirAsistente(); else cerrarAsistente();
});
document.getElementById("panel-cerrar").addEventListener("click", cerrarAsistente);
document.getElementById("globo-cerrar").addEventListener("click", function () {
  globoAsistente.hidden = true;
});

// el mensaje aparece un momento después de entrar para que se note
setTimeout(function () {
  if (panelAsistente.hidden) globoAsistente.hidden = false;
}, 1800);
setTimeout(function () {
  globoAsistente.hidden = true;
}, 16000);

// Por ahora el asistente busca palabras clave. Cuando esté lista la IA en Python
// (carpeta ai) esta función se cambia por una llamada a la API.
const palabrasClave = {
  alegria: ["feliz", "contento", "alegre", "emocionado", "genial", "celebrar", "orgulloso"],
  tristeza: ["triste", "llorar", "lloro", "vacio", "extrano", "nostalgia", "desanimado"],
  ira: ["enojado", "enojo", "rabia", "furioso", "molesto", "harto", "injusto"],
  miedo: ["miedo", "asustado", "nervioso", "preocupado", "temor", "susto", "inseguro"],
  asco: ["asco", "repugnante", "fastidio", "nauseas", "desagrado", "repulsion"],
  sorpresa: ["sorpresa", "sorprendido", "inesperado", "increible", "impactado"],
  desprecio: ["desprecio", "desden", "detesto", "superior"]
};
const senalesAlerta = ["quiero morir", "no quiero vivir", "suicid", "hacerme dano", "matarme", "acabar con todo"];

function limpiarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function agregarMensaje(texto, clase, claveEnlace) {
  const p = document.createElement("p");
  p.className = "mensaje " + clase;
  p.textContent = texto;
  if (claveEnlace) {
    const enlace = document.createElement("a");
    enlace.href = "#/emocion/" + claveEnlace;
    enlace.textContent = " Conocer " + emociones[claveEnlace].postre;
    p.appendChild(enlace);
  }
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

function responderAsistente(mensaje) {
  const texto = limpiarTexto(mensaje);

  // lo primero es cuidar a la persona, antes de recomendar nada
  if (senalesAlerta.some(function (senal) { return texto.includes(senal); })) {
    agregarMensaje("Siento que estés pasando por algo tan difícil. No tienes que cargarlo solo: habla con alguien de confianza o con un profesional. Si estás en peligro, llama ya a la línea de emergencias (en Colombia, el 123).", "asistente");
    return;
  }

  let ganadora = null;
  let maximo = 0;
  Object.keys(palabrasClave).forEach(function (clave) {
    const puntos = palabrasClave[clave].filter(function (p) { return texto.includes(p); }).length;
    if (puntos > maximo) { maximo = puntos; ganadora = clave; }
  });

  if (!ganadora) {
    agregarMensaje("Cuéntame un poco más: ¿qué pasó hoy y cómo te hizo sentir?", "asistente");
    return;
  }
  agregarMensaje("Parece que sientes " + emociones[ganadora].nombre.toLowerCase() + ". Te sugiero probar " + emociones[ganadora].postre + ".", "asistente", ganadora);
}

document.getElementById("form-chat").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const campo = document.getElementById("chat-texto");
  const mensaje = campo.value.trim();
  if (mensaje === "") return;
  agregarMensaje(mensaje, "usuario");
  campo.value = "";
  responderAsistente(mensaje);
});

// ---- arte para la tarjeta ----
// En vez de bajar fotos de internet, cada dibujo se hace con código: así nunca se repite,
// va con la emoción y se puede descargar sin problemas.
const ARTE = { x: 190, y: 320, w: 700, h: 330 };
let semillaArte = 1;
let modoArte = 0;
const ultimoModo = {};

// generador de números "al azar" que repite la misma serie con la misma semilla,
// así el dibujo no cambia cuando se escribe una dedicatoria
function crearAzar(semilla) {
  let a = semilla;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rgba(hex, alfa) {
  const n = parseInt(hex.replace("#", ""), 16);
  return "rgba(" + (n >> 16) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ", " + alfa + ")";
}

function linea(x1, y1, x2, y2, grosor, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = grosor;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function punto(x, y, radio, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, Math.PI * 2);
  ctx.fill();
}

// destello de cuatro puntas
function estrella(x, y, radio, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? radio : radio * 0.22;
    const ang = i * Math.PI / 4 - Math.PI / 2;
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
  }
  ctx.closePath();
  ctx.fill();
}

// cada emoción tiene dos dibujos distintos (modo 0 y modo 1)
const pintores = {
  alegria: function (az, color, modo) {
    const cx = ARTE.x + ARTE.w / 2;
    const cy = ARTE.y + ARTE.h / 2;
    if (modo === 0) {
      // un sol con rayos y confeti
      for (let i = 0; i < 28; i++) {
        const ang = i / 28 * Math.PI * 2;
        const largo = i % 2 ? 130 : 185;
        linea(cx + Math.cos(ang) * 78, cy + Math.sin(ang) * 78, cx + Math.cos(ang) * largo, cy + Math.sin(ang) * largo, 7, rgba(color, 0.85));
      }
      punto(cx, cy, 64, color);
      const tonos = [color, "#F0D7A0", "#E87C93", "#FFF3DD"];
      for (let i = 0; i < 60; i++) {
        ctx.save();
        ctx.translate(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h);
        ctx.rotate(az() * 6.28);
        ctx.fillStyle = tonos[Math.floor(az() * tonos.length)];
        ctx.fillRect(-6, -3, 12, 6);
        ctx.restore();
      }
    } else {
      // burbujas que suben, como champaña
      for (let i = 0; i < 45; i++) {
        const r = 6 + az() * 34;
        const x = ARTE.x + az() * ARTE.w;
        const y = ARTE.y + az() * ARTE.h;
        ctx.fillStyle = rgba(color, 0.18);
        ctx.strokeStyle = rgba("#FFF3DD", 0.55);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        punto(x - r * 0.35, y - r * 0.35, r * 0.18, rgba("#FFFFFF", 0.7));
      }
    }
  },

  tristeza: function (az, color, modo) {
    if (modo === 0) {
      // luna llena y lluvia fina
      const mx = ARTE.x + 150;
      const my = ARTE.y + 95;
      punto(mx, my, 110, rgba("#F3E6D2", 0.08));
      punto(mx, my, 78, rgba("#F3E6D2", 0.12));
      punto(mx, my, 56, "#F3E6D2");
      punto(mx - 16, my - 10, 10, rgba(color, 0.35));
      punto(mx + 18, my + 14, 14, rgba(color, 0.3));
      for (let i = 0; i < 130; i++) {
        const x = ARTE.x + az() * ARTE.w;
        const y = ARTE.y + az() * ARTE.h;
        linea(x, y, x - 12, y + 34, 2, rgba("#D8D0F2", 0.4));
      }
    } else {
      // ondas en el agua, con gotas que caen
      for (let k = 0; k < 3; k++) {
        const x = ARTE.x + 120 + az() * (ARTE.w - 240);
        const y = ARTE.y + 110 + az() * (ARTE.h - 190);
        for (let r = 1; r <= 6; r++) {
          ctx.strokeStyle = rgba("#D8D0F2", 0.6 - r * 0.08);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(x, y, r * 34, r * 12, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        punto(x, y - 70 - az() * 40, 7, rgba("#D8D0F2", 0.8));
      }
    }
  },

  ira: function (az, color, modo) {
    if (modo === 0) {
      // llamas en tres capas
      const base = ARTE.y + ARTE.h;
      const capas = [[color, 1], ["#F29B4B", 0.8], ["#F2C14E", 0.7]];
      capas.forEach(function (capa, n) {
        for (let i = 0; i < 11; i++) {
          const x = ARTE.x + (i + 0.5) * ARTE.w / 11 + (az() - 0.5) * 40;
          const alto = (150 + az() * 130) * (1 - n * 0.28);
          ctx.fillStyle = rgba(capa[0], capa[1] * 0.85);
          ctx.beginPath();
          ctx.moveTo(x - 38, base);
          ctx.bezierCurveTo(x - 50, base - alto * 0.5, x + 20, base - alto * 0.6, x, base - alto);
          ctx.bezierCurveTo(x + 55, base - alto * 0.55, x + 48, base - alto * 0.2, x + 38, base);
          ctx.closePath();
          ctx.fill();
        }
      });
      for (let i = 0; i < 40; i++) {
        punto(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h * 0.7, 1.5 + az() * 3, rgba("#F2C14E", 0.8));
      }
    } else {
      // grietas con brasa por dentro
      const cx = ARTE.x + ARTE.w / 2;
      const cy = ARTE.y + ARTE.h / 2;
      for (let i = 0; i < 16; i++) {
        let x = cx;
        let y = cy;
        let ang = i / 16 * Math.PI * 2 + az() * 0.3;
        for (let paso = 0; paso < 8; paso++) {
          ang += (az() - 0.5) * 1.1;
          const largo = 30 + az() * 40;
          const nx = x + Math.cos(ang) * largo;
          const ny = y + Math.sin(ang) * largo;
          linea(x, y, nx, ny, 9 - paso, rgba(color, 0.35));
          linea(x, y, nx, ny, 3, rgba("#F2C14E", 0.9));
          x = nx;
          y = ny;
        }
      }
      punto(cx, cy, 30, "#F2C14E");
    }
  },

  miedo: function (az, color, modo) {
    if (modo === 0) {
      // niebla y ojos que brillan en la oscuridad
      for (let i = 0; i < 7; i++) {
        ctx.fillStyle = rgba("#D8D0F2", 0.07);
        ctx.beginPath();
        ctx.ellipse(ARTE.x + az() * ARTE.w, ARTE.y + 40 + az() * (ARTE.h - 80), 230, 34, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 5; i++) {
        const x = ARTE.x + 70 + az() * (ARTE.w - 140);
        const y = ARTE.y + 60 + az() * (ARTE.h - 140);
        const r = 5 + az() * 7;
        punto(x - 16, y, r * 2.6, rgba("#F2C14E", 0.15));
        punto(x + 16, y, r * 2.6, rgba("#F2C14E", 0.15));
        punto(x - 16, y, r, "#F2C14E");
        punto(x + 16, y, r, "#F2C14E");
      }
    } else {
      // árboles oscuros, una luna lejana y neblina abajo
      punto(ARTE.x + ARTE.w * 0.78, ARTE.y + 80, 70, rgba("#F3E6D2", 0.1));
      punto(ARTE.x + ARTE.w * 0.78, ARTE.y + 80, 38, "#F3E6D2");
      for (let i = 0; i < 16; i++) {
        const x = ARTE.x + az() * ARTE.w;
        const alto = 120 + az() * 180;
        const ancho = 10 + az() * 16;
        ctx.fillStyle = rgba("#14070F", 0.85);
        ctx.fillRect(x, ARTE.y + ARTE.h - alto, ancho, alto);
      }
      ctx.fillStyle = rgba("#D8D0F2", 0.12);
      ctx.fillRect(ARTE.x, ARTE.y + ARTE.h - 60, ARTE.w, 60);
    }
  },

  asco: function (az, color, modo) {
    if (modo === 0) {
      // una masa viscosa con gotas que cuelgan
      for (let i = 0; i < 26; i++) {
        punto(ARTE.x + 40 + az() * (ARTE.w - 80), ARTE.y + 30 + az() * 80, 28 + az() * 40, rgba(color, 0.55));
      }
      for (let i = 0; i < 9; i++) {
        const x = ARTE.x + 60 + az() * (ARTE.w - 120);
        const largo = 60 + az() * 170;
        ctx.fillStyle = rgba(color, 0.7);
        ctx.fillRect(x - 9, ARTE.y + 60, 18, largo);
        punto(x, ARTE.y + 60 + largo, 14, rgba(color, 0.9));
      }
    } else {
      // una espiral que marea
      const cx = ARTE.x + ARTE.w / 2;
      const cy = ARTE.y + ARTE.h / 2;
      ctx.strokeStyle = rgba(color, 0.9);
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let t = 0; t < 26; t += 0.1) {
        const r = 6 + t * 7.2;
        const x = cx + Math.cos(t) * r * 1.5 + Math.sin(t * 3) * 4;
        const y = cy + Math.sin(t) * r * 0.78;
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      for (let i = 0; i < 25; i++) {
        punto(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 2 + az() * 4, rgba("#F3E6D2", 0.4));
      }
    }
  },

  sorpresa: function (az, color, modo) {
    if (modo === 0) {
      // fuegos artificiales
      for (let k = 0; k < 3; k++) {
        const cx = ARTE.x + 120 + az() * (ARTE.w - 240);
        const cy = ARTE.y + 90 + az() * (ARTE.h - 180);
        for (let i = 0; i < 22; i++) {
          const ang = i / 22 * Math.PI * 2;
          const r2 = 60 + az() * 45;
          linea(cx + Math.cos(ang) * 22, cy + Math.sin(ang) * 22, cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2, 4, rgba(i % 2 ? color : "#FFF3DD", 0.9));
          punto(cx + Math.cos(ang) * (r2 + 12), cy + Math.sin(ang) * (r2 + 12), 3, rgba(color, 0.9));
        }
      }
    } else {
      // un cielo lleno de destellos
      for (let i = 0; i < 18; i++) {
        estrella(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 10 + az() * 36, rgba(i % 3 ? color : "#FFF3DD", 0.9));
      }
      for (let i = 0; i < 50; i++) {
        punto(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 1.5 + az() * 2, rgba("#FFF3DD", 0.7));
      }
    }
  },

  desprecio: function (az, color, modo) {
    if (modo === 0) {
      // fragmentos que se alejan unos de otros
      for (let i = 0; i < 16; i++) {
        const t = 40 + az() * 90;
        ctx.save();
        ctx.translate(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h);
        ctx.rotate(az() * Math.PI * 2);
        ctx.fillStyle = rgba(i % 3 ? color : "#F3E6D2", 0.35 + az() * 0.4);
        ctx.beginPath();
        ctx.moveTo(0, -t / 2);
        ctx.lineTo(t * 0.55, t / 2);
        ctx.lineTo(-t * 0.35, t / 3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else {
      // líneas frías que se cortan y se desplazan
      for (let i = 0; i < 14; i++) {
        const y = ARTE.y + 24 + i * 22;
        const corte = ARTE.x + 120 + az() * (ARTE.w - 240);
        const desvio = (az() - 0.5) * 90;
        linea(ARTE.x, y, corte, y, 4, rgba("#F3E6D2", 0.55));
        linea(corte + 24 + desvio, y, ARTE.x + ARTE.w, y, 4, rgba(color, 0.9));
      }
    }
  }
};

// tres dibujos más por emoción (modos 2, 3 y 4)
const extras = {
  alegria: [
    function (az, color) {
      // flores de pétalos redondos
      for (let i = 0; i < 9; i++) {
        const x = ARTE.x + 60 + az() * (ARTE.w - 120);
        const y = ARTE.y + 50 + az() * (ARTE.h - 100);
        const r = 22 + az() * 30;
        const tono = [color, "#E87C93", "#F0D7A0"][i % 3];
        for (let p = 0; p < 8; p++) {
          const ang = p / 8 * Math.PI * 2;
          punto(x + Math.cos(ang) * r, y + Math.sin(ang) * r, r * 0.55, rgba(tono, 0.75));
        }
        punto(x, y, r * 0.5, "#FFF3DD");
      }
    },
    function (az, color) {
      // un arcoíris de colores cálidos
      const cx = ARTE.x + ARTE.w / 2;
      const base = ARTE.y + ARTE.h + 20;
      ["#E87C93", color, "#F2C14E", "#F0D7A0", "#FFF3DD"].forEach(function (tono, i) {
        ctx.strokeStyle = rgba(tono, 0.85);
        ctx.lineWidth = 26;
        ctx.beginPath();
        ctx.arc(cx, base, 290 - i * 30, Math.PI, 0);
        ctx.stroke();
      });
      for (let i = 0; i < 18; i++) estrella(ARTE.x + az() * ARTE.w, ARTE.y + az() * 120, 6 + az() * 12, rgba("#FFF3DD", 0.8));
    },
    function (az, color) {
      // globos con su cuerda
      const tonos = [color, "#E87C93", "#F2C14E", "#F0D7A0"];
      for (let i = 0; i < 9; i++) {
        const x = ARTE.x + 50 + az() * (ARTE.w - 100);
        const y = ARTE.y + 50 + az() * (ARTE.h * 0.5);
        linea(x, y + 44, x + (az() - 0.5) * 30, ARTE.y + ARTE.h, 2, rgba("#FFF3DD", 0.6));
        ctx.fillStyle = rgba(tonos[i % 4], 0.9);
        ctx.beginPath();
        ctx.ellipse(x, y, 30, 38, 0, 0, Math.PI * 2);
        ctx.fill();
        punto(x - 10, y - 14, 6, rgba("#FFFFFF", 0.5));
      }
    }
  ],

  tristeza: [
    function (az, color) {
      // hojas que caen
      for (let i = 0; i < 40; i++) {
        ctx.save();
        ctx.translate(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h);
        ctx.rotate(az() * Math.PI * 2);
        ctx.fillStyle = rgba(i % 2 ? color : "#D8D0F2", 0.5 + az() * 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8 + az() * 10, 22 + az() * 14, 0, 0, Math.PI * 2);
        ctx.fill();
        linea(0, -20, 0, 20, 1.5, rgba("#14070F", 0.4));
        ctx.restore();
      }
    },
    function (az, color) {
      // una ventana empañada con gotas que resbalan
      ctx.fillStyle = rgba("#D8D0F2", 0.1);
      ctx.fillRect(ARTE.x, ARTE.y, ARTE.w, ARTE.h);
      for (let i = 0; i < 26; i++) {
        const x = ARTE.x + az() * ARTE.w;
        const y = ARTE.y + az() * ARTE.h * 0.6;
        const largo = 30 + az() * 130;
        linea(x, y, x + (az() - 0.5) * 8, y + largo, 3, rgba("#D8D0F2", 0.25));
        punto(x, y + largo, 6 + az() * 4, rgba("#D8D0F2", 0.7));
      }
      for (let i = 0; i < 60; i++) punto(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 1.5 + az() * 3, rgba("#F3E6D2", 0.35));
    },
    function (az, color) {
      // un paraguas solo bajo la lluvia
      const x = ARTE.x + ARTE.w * (0.35 + az() * 0.3);
      const y = ARTE.y + 150;
      ctx.fillStyle = rgba(color, 0.95);
      ctx.beginPath();
      ctx.arc(x, y, 90, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      linea(x, y, x, y + 100, 5, "#F3E6D2");
      ctx.strokeStyle = "#F3E6D2";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x - 12, y + 100, 12, 0, Math.PI);
      ctx.stroke();
      for (let i = 0; i < 120; i++) {
        const px = ARTE.x + az() * ARTE.w;
        const py = ARTE.y + az() * ARTE.h;
        linea(px, py, px - 10, py + 28, 2, rgba("#D8D0F2", 0.35));
      }
    }
  ],

  ira: [
    function (az, color) {
      // relámpagos
      for (let k = 0; k < 3; k++) {
        let x = ARTE.x + 120 + az() * (ARTE.w - 240);
        let y = ARTE.y;
        while (y < ARTE.y + ARTE.h) {
          const nx = x + (az() - 0.5) * 90;
          const ny = y + 40 + az() * 40;
          linea(x, y, nx, ny, 12, rgba(color, 0.25));
          linea(x, y, nx, ny, 4, "#FFF3DD");
          x = nx;
          y = ny;
        }
      }
    },
    function (az, color) {
      // un volcán en erupción
      const cx = ARTE.x + ARTE.w / 2;
      const base = ARTE.y + ARTE.h;
      ctx.fillStyle = rgba("#14070F", 0.9);
      ctx.beginPath();
      ctx.moveTo(cx - 260, base);
      ctx.lineTo(cx - 50, base - 170);
      ctx.lineTo(cx + 50, base - 170);
      ctx.lineTo(cx + 260, base);
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 5; i++) linea(cx + (az() - 0.5) * 40, base - 170, cx + (az() - 0.5) * 360, base, 5, rgba("#F2C14E", 0.8));
      for (let i = 0; i < 50; i++) {
        const ang = -Math.PI / 2 + (az() - 0.5) * 1.6;
        const d = 30 + az() * 150;
        punto(cx + Math.cos(ang) * d, base - 175 + Math.sin(ang) * d, 2 + az() * 4, rgba(i % 2 ? color : "#F2C14E", 0.9));
      }
    },
    function (az, color) {
      // ondas de choque
      const cx = ARTE.x + ARTE.w / 2;
      const cy = ARTE.y + ARTE.h / 2;
      for (let r = 1; r <= 9; r++) {
        ctx.strokeStyle = rgba(color, 0.9 - r * 0.09);
        ctx.lineWidth = 10 - r * 0.7;
        ctx.setLineDash([40 + az() * 60, 14 + az() * 20]);
        ctx.beginPath();
        ctx.arc(cx, cy, r * 36, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      punto(cx, cy, 20, "#F2C14E");
    }
  ],

  miedo: [
    function (az, color) {
      // un pasillo que se hunde en la oscuridad
      const cx = ARTE.x + ARTE.w / 2;
      const cy = ARTE.y + ARTE.h / 2;
      for (let i = 0; i < 14; i++) {
        const ang = i / 14 * Math.PI * 2;
        linea(cx + Math.cos(ang) * 40, cy + Math.sin(ang) * 24, cx + Math.cos(ang) * 520, cy + Math.sin(ang) * 320, 2, rgba("#D8D0F2", 0.25));
      }
      for (let k = 1; k <= 6; k++) {
        ctx.strokeStyle = rgba("#D8D0F2", 0.3);
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - k * k * 8, cy - k * k * 5, k * k * 16, k * k * 10);
      }
      ctx.fillStyle = rgba("#F2C14E", 0.9);
      ctx.fillRect(cx - 16, cy - 10, 32, 20);
      punto(cx, cy, 70, rgba("#F2C14E", 0.12));
    },
    function (az, color) {
      // una telaraña
      const cx = ARTE.x + ARTE.w * (0.3 + az() * 0.4);
      const cy = ARTE.y + ARTE.h * 0.45;
      for (let i = 0; i < 12; i++) {
        const ang = i / 12 * Math.PI * 2;
        linea(cx, cy, cx + Math.cos(ang) * 400, cy + Math.sin(ang) * 300, 1.5, rgba("#D8D0F2", 0.45));
      }
      for (let r = 1; r <= 8; r++) {
        ctx.strokeStyle = rgba("#D8D0F2", 0.4);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= 12; i++) {
          const ang = i / 12 * Math.PI * 2;
          const rr = r * 34 + Math.sin(i * 2.1 + r) * 5;
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr * 0.8;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let i = 0; i < 6; i++) punto(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 3, rgba("#F2C14E", 0.8));
    },
    function (az, color) {
      // luciérnagas en la oscuridad
      for (let i = 0; i < 38; i++) {
        const x = ARTE.x + az() * ARTE.w;
        const y = ARTE.y + az() * ARTE.h;
        const r = 2 + az() * 4;
        punto(x, y, r * 5, rgba("#F2C14E", 0.08));
        punto(x, y, r * 2.4, rgba("#F2C14E", 0.2));
        punto(x, y, r, "#FFF3DD");
      }
    }
  ],

  asco: [
    function (az, color) {
      // colonias de moho
      for (let k = 0; k < 7; k++) {
        const x = ARTE.x + 60 + az() * (ARTE.w - 120);
        const y = ARTE.y + 50 + az() * (ARTE.h - 100);
        for (let i = 0; i < 18; i++) {
          const ang = az() * Math.PI * 2;
          const d = az() * 60;
          punto(x + Math.cos(ang) * d, y + Math.sin(ang) * d, 4 + az() * 10, rgba(i % 3 ? color : "#6E7A32", 0.6));
        }
        punto(x, y, 70, rgba(color, 0.1));
      }
    },
    function (az, color) {
      // ondas de pantano con burbujitas
      for (let i = 0; i < 8; i++) {
        const y = ARTE.y + 30 + i * 40;
        const fase = az() * Math.PI * 2;
        ctx.strokeStyle = rgba(color, 0.35 + (i % 3) * 0.2);
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let x = 0; x <= ARTE.w; x += 10) {
          const yy = y + Math.sin(x / 45 + fase) * 14;
          if (x === 0) ctx.moveTo(ARTE.x, yy); else ctx.lineTo(ARTE.x + x, yy);
        }
        ctx.stroke();
      }
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = rgba("#F3E6D2", 0.5);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 4 + az() * 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    function (az, color) {
      // células vistas al microscopio
      for (let i = 0; i < 34; i++) {
        const x = ARTE.x + az() * ARTE.w;
        const y = ARTE.y + az() * ARTE.h;
        const r = 16 + az() * 44;
        ctx.fillStyle = rgba(i % 2 ? color : "#6E7A32", 0.35);
        ctx.strokeStyle = rgba("#F3E6D2", 0.45);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        punto(x + az() * r * 0.3, y + az() * r * 0.3, r * 0.25, rgba("#14070F", 0.4));
      }
    }
  ],

  sorpresa: [
    function (az, color) {
      // estrellas fugaces
      for (let k = 0; k < 3; k++) {
        const x = ARTE.x + 200 + az() * (ARTE.w - 200);
        const y = ARTE.y + 30 + az() * (ARTE.h - 150);
        for (let i = 0; i < 30; i++) {
          punto(x - i * 7 + (az() - 0.5) * 6, y + i * 4 + (az() - 0.5) * 6, 5 - i * 0.15, rgba(i % 2 ? color : "#FFF3DD", 0.9 - i * 0.028));
        }
        estrella(x, y, 26, "#FFF3DD");
      }
      for (let i = 0; i < 40; i++) punto(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 1.5, rgba("#FFF3DD", 0.6));
    },
    function (az, color) {
      // una fuente de confeti
      const cx = ARTE.x + ARTE.w / 2;
      const base = ARTE.y + ARTE.h;
      const tonos = [color, "#FFF3DD", "#E87C93", "#F0D7A0", "#8A78C4"];
      for (let i = 0; i < 110; i++) {
        const ang = -Math.PI / 2 + (az() - 0.5) * 2.2;
        const d = 40 + az() * 250;
        ctx.save();
        ctx.translate(cx + Math.cos(ang) * d, base + Math.sin(ang) * d * 0.9);
        ctx.rotate(az() * Math.PI * 2);
        ctx.fillStyle = tonos[Math.floor(az() * tonos.length)];
        ctx.fillRect(-7, -3, 14, 6);
        ctx.restore();
      }
    },
    function (az, color) {
      // un signo de exclamación gigante
      const cx = ARTE.x + ARTE.w / 2;
      punto(cx, ARTE.y + ARTE.h / 2, 150, rgba(color, 0.12));
      ctx.fillStyle = rgba(color, 0.95);
      ctx.beginPath();
      ctx.moveTo(cx - 22, ARTE.y + 50);
      ctx.lineTo(cx + 22, ARTE.y + 50);
      ctx.lineTo(cx + 12, ARTE.y + 215);
      ctx.lineTo(cx - 12, ARTE.y + 215);
      ctx.closePath();
      ctx.fill();
      punto(cx, ARTE.y + 262, 17, rgba(color, 0.95));
      for (let i = 0; i < 16; i++) estrella(ARTE.x + az() * ARTE.w, ARTE.y + az() * ARTE.h, 6 + az() * 14, rgba("#FFF3DD", 0.8));
    }
  ],

  desprecio: [
    function (az, color) {
      // una grieta que divide el cuadro en dos
      const cx = ARTE.x + ARTE.w * (0.4 + az() * 0.2);
      const corte = [];
      for (let y = ARTE.y; y <= ARTE.y + ARTE.h; y += 30) corte.push(cx + (az() - 0.5) * 60);
      ctx.fillStyle = rgba(color, 0.55);
      ctx.beginPath();
      ctx.moveTo(ARTE.x, ARTE.y);
      corte.forEach(function (x, i) { ctx.lineTo(x, ARTE.y + i * 30); });
      ctx.lineTo(ARTE.x, ARTE.y + ARTE.h);
      ctx.closePath();
      ctx.fill();
      // el otro lado se corre hacia abajo, como dándole la espalda
      ctx.fillStyle = rgba("#F3E6D2", 0.2);
      ctx.beginPath();
      ctx.moveTo(ARTE.x + ARTE.w, ARTE.y + 30);
      corte.forEach(function (x, i) { ctx.lineTo(x + 26, ARTE.y + 30 + i * 30); });
      ctx.lineTo(ARTE.x + ARTE.w, ARTE.y + ARTE.h + 30);
      ctx.closePath();
      ctx.fill();
    },
    function (az, color) {
      // hexágonos de hielo
      for (let fila = 0; fila < 7; fila++) {
        for (let col = 0; col < 12; col++) {
          const x = ARTE.x + col * 64 + (fila % 2) * 32;
          const y = ARTE.y + fila * 50;
          ctx.fillStyle = rgba(az() > 0.45 ? color : "#F3E6D2", 0.08 + az() * 0.3);
          ctx.strokeStyle = rgba("#F3E6D2", 0.25);
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = i / 6 * Math.PI * 2 + 0.5236;
            const px = x + Math.cos(ang) * 34;
            const py = y + Math.sin(ang) * 34;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    },
    function (az, color) {
      // montañas lejanas, frías y distantes
      punto(ARTE.x + ARTE.w * 0.8, ARTE.y + 70, 36, rgba("#F3E6D2", 0.8));
      for (let capa = 0; capa < 4; capa++) {
        ctx.fillStyle = rgba(capa % 2 ? color : "#3A2230", 0.35 + capa * 0.18);
        ctx.beginPath();
        ctx.moveTo(ARTE.x, ARTE.y + ARTE.h);
        for (let x = 0; x <= ARTE.w; x += 50) {
          ctx.lineTo(ARTE.x + x, ARTE.y + ARTE.h - 70 - capa * 28 - az() * (80 - capa * 10));
        }
        ctx.lineTo(ARTE.x + ARTE.w, ARTE.y + ARTE.h);
        ctx.closePath();
        ctx.fill();
      }
    }
  ]
};

// los modos 0 y 1 están en "pintores", los modos 2 a 4 en "extras"
function llamarPintor(clave, az, color, modo) {
  if (modo < 2) pintores[clave](az, color, modo);
  else extras[clave][modo - 2](az, color);
}

function dibujarArte(clave, acento, oro) {
  const az = crearAzar(semillaArte);
  ctx.save();
  rectRedondeado(ARTE.x, ARTE.y, ARTE.w, ARTE.h, 36);
  ctx.clip();
  const degradado = ctx.createLinearGradient(0, ARTE.y, 0, ARTE.y + ARTE.h);
  degradado.addColorStop(0, rgba(acento, 0.45));
  degradado.addColorStop(1, rgba(acento, 0.08));
  ctx.fillStyle = degradado;
  ctx.fillRect(ARTE.x, ARTE.y, ARTE.w, ARTE.h);
  llamarPintor(clave, az, acento, modoArte);
  ctx.restore();

  rectRedondeado(ARTE.x, ARTE.y, ARTE.w, ARTE.h, 36);
  ctx.lineWidth = 3;
  ctx.strokeStyle = oro;
  ctx.stroke();
}

// una nueva semilla y un estilo distinto: reparto los cinco como una baraja,
// así no se repite ninguno hasta haber visto todos
const bolsaArte = {};

function nuevoArte(clave) {
  semillaArte = Math.floor(Math.random() * 1000000000);
  if (!bolsaArte[clave] || bolsaArte[clave].length === 0) {
    const modos = [0, 1, 2, 3, 4].filter(function (m) { return m !== ultimoModo[clave]; });
    for (let i = modos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const guardado = modos[i];
      modos[i] = modos[j];
      modos[j] = guardado;
    }
    bolsaArte[clave] = modos;
  }
  modoArte = bolsaArte[clave].pop();
  ultimoModo[clave] = modoArte;
}

document.getElementById("otra-imagen").addEventListener("click", function () {
  nuevoArte(claveActual);
  dibujarTarjeta(claveActual);
});

// ---- mezcla de dos dibujos (mezclador) ----
// los dibujos de arte usan la variable ctx, así que la cambio un momento para pintar en otro lienzo
function conLienzo(lienzo, accion) {
  const anterior = ctx;
  ctx = lienzo.getContext("2d");
  try {
    accion();
  } finally {
    ctx = anterior;
  }
}

function pintarArteEn(lienzo, clave, semilla, modo) {
  conLienzo(lienzo, function () {
    ctx.save();
    ctx.scale(2, 2);
    ctx.translate(-ARTE.x, -ARTE.y);
    rectRedondeado(ARTE.x, ARTE.y, ARTE.w, ARTE.h, 36);
    ctx.clip();
    ctx.fillStyle = leerColor("--fondo");
    ctx.fillRect(ARTE.x, ARTE.y, ARTE.w, ARTE.h);
    const color = leerColor("--c-" + clave);
    const degradado = ctx.createLinearGradient(0, ARTE.y, 0, ARTE.y + ARTE.h);
    degradado.addColorStop(0, rgba(color, 0.45));
    degradado.addColorStop(1, rgba(color, 0.08));
    ctx.fillStyle = degradado;
    ctx.fillRect(ARTE.x, ARTE.y, ARTE.w, ARTE.h);
    llamarPintor(clave, crearAzar(semilla), color, modo);
    ctx.restore();
  });
}

function pintarMezcla(a, b) {
  const lienzo = document.getElementById("mez-lienzo");
  const ancho = lienzo.width;
  const alto = lienzo.height;
  const lienzoA = document.createElement("canvas");
  const lienzoB = document.createElement("canvas");
  lienzoA.width = lienzoB.width = ancho;
  lienzoA.height = lienzoB.height = alto;

  pintarArteEn(lienzoA, a, Math.floor(Math.random() * 1000000000), Math.floor(Math.random() * 5));
  pintarArteEn(lienzoB, b, Math.floor(Math.random() * 1000000000), Math.floor(Math.random() * 5));

  // el segundo dibujo aparece poco a poco con un degradado inclinado, como si se derritiera en el primero
  const cb = lienzoB.getContext("2d");
  const mascara = cb.createLinearGradient(ancho * 0.25, alto * Math.random() * 0.4, ancho * 0.75, alto * (0.6 + Math.random() * 0.4));
  mascara.addColorStop(0, "rgba(0, 0, 0, 0)");
  mascara.addColorStop(1, "rgba(0, 0, 0, 1)");
  cb.globalCompositeOperation = "destination-in";
  cb.fillStyle = mascara;
  cb.fillRect(0, 0, ancho, alto);

  const cm = lienzo.getContext("2d");
  cm.clearRect(0, 0, ancho, alto);
  cm.drawImage(lienzoA, 0, 0);
  cm.drawImage(lienzoB, 0, 0);

  // destellos de los dos colores justo donde se juntan
  const colorA = leerColor("--c-" + a);
  const colorB = leerColor("--c-" + b);
  for (let i = 0; i < 30; i++) {
    const x = ancho * (0.3 + Math.random() * 0.4);
    const y = alto * Math.random();
    cm.fillStyle = rgba(i % 2 ? colorA : colorB, 0.1 + Math.random() * 0.12);
    cm.beginPath();
    cm.arc(x, y, 14 + Math.random() * 46, 0, Math.PI * 2);
    cm.fill();
  }

  // el marco dorado
  conLienzo(lienzo, function () {
    ctx.save();
    ctx.scale(2, 2);
    ctx.translate(-ARTE.x, -ARTE.y);
    rectRedondeado(ARTE.x, ARTE.y, ARTE.w, ARTE.h, 36);
    ctx.lineWidth = 3;
    ctx.strokeStyle = leerColor("--oro");
    ctx.stroke();
    ctx.restore();
  });
}

// ---- ciencia: esquemas donde se toca cada zona ----
const puntosMapa = {
  cerebro: [
    { nombre: "Corteza prefrontal", x: 12.2, y: 34.5, emociones: [],
      texto: "Interviene en planear, decidir y moderar nuestras reacciones. Es la que nos ayuda a pensarlo dos veces.",
      nota: "Participa en todas las emociones, porque ayuda a regularlas." },
    { nombre: "Amígdala", x: 44.2, y: 57.3, emociones: ["miedo", "ira", "sorpresa"],
      texto: "Detecta con rapidez lo que puede ser importante o amenazante, y participa en emociones intensas como el miedo." },
    { nombre: "Hipocampo", x: 60.2, y: 55.1, emociones: ["tristeza", "alegria"],
      texto: "Es clave para la memoria. Por eso una emoción puede quedar unida a un lugar, un momento o una persona." },
    { nombre: "Ínsula", x: 43.4, y: 42.7, emociones: ["asco"],
      texto: "Recibe señales del interior del cuerpo y se relaciona con sensaciones como el asco o el malestar en el estómago." },
    { nombre: "Sistema de recompensa", x: 30.3, y: 54.0, emociones: ["alegria", "sorpresa"],
      texto: "Conecta zonas que responden a lo agradable y a lo que anticipamos como bueno, como un postre que nos gusta." }
  ],
  cuerpo: [
    { nombre: "Rostro y piel", x: 50, y: 11, emociones: ["alegria", "ira", "sorpresa"],
      texto: "Aparecen expresiones, rubor o sudor. Muchas son automáticas y difíciles de controlar." },
    { nombre: "Hombros y músculos", x: 28, y: 25, emociones: ["ira", "miedo"],
      texto: "Se tensan con el enojo o la preocupación, y se sueltan cuando hay calma o alegría." },
    { nombre: "Corazón y respiración", x: 50, y: 33, emociones: ["miedo", "alegria", "sorpresa"],
      texto: "Pueden acelerarse con la emoción o con el susto, y volver a un ritmo más lento cuando nos calmamos." },
    { nombre: "Digestión", x: 50, y: 49, emociones: ["asco", "miedo"],
      texto: "El intestino y el cerebro se comunican, por eso a veces sentimos un nudo en el estómago ante los nervios." },
    { nombre: "Manos", x: 15, y: 56, emociones: ["miedo", "sorpresa"],
      texto: "El sudor, el temblor o el frío en las manos son reacciones muy comunes ante los nervios." }
  ]
};

function armarMapa(contenedor) {
  const puntos = puntosMapa[contenedor.dataset.mapa];
  const figura = contenedor.querySelector(".mapa-figura");
  const titulo = contenedor.querySelector(".mapa-titulo");
  const texto = contenedor.querySelector(".mapa-texto");
  const relacion = contenedor.querySelector(".mapa-relacion");

  puntos.forEach(function (p) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "punto";
    boton.style.left = p.x + "%";
    boton.style.top = p.y + "%";
    boton.setAttribute("aria-label", p.nombre);
    boton.addEventListener("click", function () {
      figura.querySelectorAll(".punto").forEach(function (otro) { otro.classList.remove("activo"); });
      boton.classList.add("activo");
      titulo.textContent = p.nombre;
      texto.textContent = p.texto;
      relacion.innerHTML = "";
      if (p.emociones.length === 0) {
        relacion.textContent = p.nota || "";
        return;
      }
      relacion.append("Suele relacionarse con: ");
      p.emociones.forEach(function (clave, i) {
        const enlace = document.createElement("a");
        enlace.href = "#/emocion/" + clave;
        enlace.textContent = emociones[clave].nombre + " (" + emociones[clave].postre + ")";
        relacion.append(enlace, i < p.emociones.length - 1 ? ", " : ".");
      });
    });
    figura.appendChild(boton);
  });
}
document.querySelectorAll(".mapa").forEach(armarMapa);

// ---- ciencia: filtro de los mensajeros químicos ----
const chipsQuimica = document.querySelectorAll("#p-quimica .chip");
chipsQuimica.forEach(function (chip) {
  chip.addEventListener("click", function () {
    const estabaActivo = chip.getAttribute("aria-pressed") === "true";
    chipsQuimica.forEach(function (otro) { otro.setAttribute("aria-pressed", "false"); });
    if (!estabaActivo) chip.setAttribute("aria-pressed", "true");
    const tema = estabaActivo ? null : chip.dataset.tema;

    document.querySelectorAll("#p-quimica .tarjeta").forEach(function (tarjeta) {
      const coincide = !tema || tarjeta.dataset.temas.split(" ").includes(tema);
      tarjeta.classList.toggle("atenuada", !coincide);
      tarjeta.classList.toggle("resaltada", Boolean(tema) && coincide);
    });
  });
});

// ---- ciencia: el rostro de Ekman ----
const rostros = {
  alegria: { ojo: 7, cejaI: "M56 74 Q72 66 88 74", cejaD: "M112 74 Q128 66 144 74",
    boca: '<path d="M60 124 Q100 172 140 124"/>', extra: '<path d="M44 88 L36 84 M44 96 L36 98 M156 88 L164 84 M156 96 L164 98"/>',
    texto: "Una sonrisa de verdad también activa la zona de los ojos." },
  tristeza: { ojo: 8, cejaI: "M56 82 Q74 78 90 66", cejaD: "M110 66 Q126 78 144 82",
    boca: '<path d="M70 148 Q100 124 130 148"/>', extra: "",
    texto: "La parte interna de las cejas sube y las comisuras de la boca bajan." },
  ira: { ojo: 5, cejaI: "M54 68 L90 86", cejaD: "M110 86 L146 68",
    boca: '<path d="M72 146 Q100 134 128 146"/>', extra: '<path d="M96 70 L96 80 M104 70 L104 80"/>',
    texto: "Cejas bajas y juntas, mirada fija y labios apretados." },
  miedo: { ojo: 13, cejaI: "M56 64 Q74 54 90 68", cejaD: "M110 68 Q126 54 144 64",
    boca: '<path d="M76 142 Q100 132 124 142 Q100 156 76 142 Z"/>', extra: "",
    texto: "Ojos muy abiertos y cejas levantadas y tensas." },
  asco: { ojo: 7, cejaI: "M56 72 L88 82", cejaD: "M112 82 L144 72",
    boca: '<path d="M74 142 Q100 126 126 142"/>', extra: '<path d="M88 108 Q100 100 112 108 M90 118 Q100 110 110 118"/>',
    texto: "La nariz se arruga y el labio superior se levanta." },
  sorpresa: { ojo: 14, cejaI: "M56 56 Q72 44 88 56", cejaD: "M112 56 Q128 44 144 56",
    boca: '<ellipse cx="100" cy="144" rx="13" ry="18"/>', extra: "",
    texto: "Cejas arriba, ojos abiertos y boca entreabierta, y dura muy poco." },
  desprecio: { ojo: 8, cejaI: "M56 76 Q72 72 88 76", cejaD: "M112 68 Q128 62 144 70",
    boca: '<path d="M70 142 Q96 144 118 140 L132 128"/>', extra: "",
    texto: "Se levanta solo un lado de la boca. Es la única expresión de la lista que es asimétrica." }
};

const rostro = document.getElementById("rostro");
const botonesEkman = document.getElementById("ekman-botones");

function mostrarRostro(clave) {
  const r = rostros[clave];
  rostro.style.setProperty("--acento", leerColor("--c-" + clave));
  rostro.innerHTML = '<circle class="cara-fondo" cx="100" cy="100" r="90"/><g class="cara-trazo">' +
    '<ellipse class="ojo" cx="72" cy="96" rx="9" ry="' + r.ojo + '"/><ellipse class="ojo" cx="128" cy="96" rx="9" ry="' + r.ojo + '"/>' +
    '<path d="' + r.cejaI + '"/><path d="' + r.cejaD + '"/>' + r.boca + r.extra + "</g>";
  document.getElementById("ekman-nombre").textContent = emociones[clave].nombre;
  document.getElementById("ekman-texto").textContent = r.texto;
  const enlace = document.getElementById("ekman-enlace");
  enlace.href = "#/emocion/" + clave;
  enlace.textContent = "Conocer " + emociones[clave].postre;
  botonesEkman.querySelectorAll(".chip").forEach(function (b) {
    b.setAttribute("aria-pressed", b.dataset.clave === clave ? "true" : "false");
  });
}

Object.keys(rostros).forEach(function (clave) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "chip";
  boton.dataset.clave = clave;
  boton.textContent = emociones[clave].nombre;
  boton.addEventListener("click", function () { mostrarRostro(clave); });
  botonesEkman.appendChild(boton);
});
mostrarRostro("alegria");

// ---- ciencia: ¿mito o realidad? ----
const afirmaciones = [
  { texto: "Existe una única «hormona de la felicidad».", esMito: true,
    explica: "Varias sustancias participan en lo que sentimos y ninguna lo explica por sí sola." },
  { texto: "Un postre puede curar una emoción.", esMito: true,
    explica: "Puede acompañar un momento y ayudar a ponerle nombre a lo que sentimos, pero no reemplaza hablar con alguien ni el apoyo profesional." },
  { texto: "Todas las emociones cumplen una función.", esMito: false,
    explica: "Incluso las incómodas nos avisan o nos preparan para algo. Lo que cambia es qué hacemos con ellas." },
  { texto: "Los colores significan lo mismo en todas las culturas.", esMito: true,
    explica: "Cambian entre culturas y entre personas. Los de este proyecto son una propuesta simbólica." },
  { texto: "Un aroma puede traernos un recuerdo de golpe.", esMito: false,
    explica: "El olfato está muy conectado con zonas relacionadas con la emoción y la memoria." },
  { texto: "Solo usamos el 10 % del cerebro.", esMito: true,
    explica: "Usamos todo el cerebro: distintas zonas se activan según lo que hacemos." },
  { texto: "El cuerpo también reacciona cuando sentimos una emoción.", esMito: false,
    explica: "El corazón, la respiración, los músculos y la digestión suelen cambiar." },
  { texto: "Sentir miedo siempre es algo malo.", esMito: true,
    explica: "El miedo es una alarma que nos ayuda a cuidarnos. Se vuelve un problema cuando es muy intenso o constante." }
];

let preguntaActual = 0;
let aciertos = 0;
const quizFrase = document.getElementById("quiz-frase");
const quizExplica = document.getElementById("quiz-explica");
const quizProgreso = document.getElementById("quiz-progreso");
const quizBotones = document.getElementById("quiz-botones");
const quizSiguiente = document.getElementById("quiz-siguiente");

function mostrarPregunta() {
  const a = afirmaciones[preguntaActual];
  quizProgreso.textContent = "Afirmación " + (preguntaActual + 1) + " de " + afirmaciones.length;
  quizFrase.textContent = a.texto;
  quizExplica.textContent = "";
  quizBotones.hidden = false;
  quizSiguiente.hidden = true;
}

function responderQuiz(dijoMito) {
  const a = afirmaciones[preguntaActual];
  const acerto = dijoMito === a.esMito;
  if (acerto) aciertos++;
  quizExplica.textContent = (acerto ? "¡Correcto! " : "No exactamente. ") + (a.esMito ? "Es un mito. " : "Es una realidad. ") + a.explica;
  quizBotones.hidden = true;
  quizSiguiente.hidden = false;
  quizSiguiente.textContent = preguntaActual === afirmaciones.length - 1 ? "Ver mi resultado" : "Siguiente";
}

document.getElementById("quiz-mito").addEventListener("click", function () { responderQuiz(true); });
document.getElementById("quiz-realidad").addEventListener("click", function () { responderQuiz(false); });
quizSiguiente.addEventListener("click", function () {
  if (quizSiguiente.textContent === "Jugar de nuevo") {
    preguntaActual = 0;
    aciertos = 0;
    mostrarPregunta();
    return;
  }
  preguntaActual++;
  if (preguntaActual < afirmaciones.length) {
    mostrarPregunta();
  } else {
    quizProgreso.textContent = "Resultado";
    quizFrase.textContent = "Acertaste " + aciertos + " de " + afirmaciones.length + ".";
    quizExplica.textContent = aciertos >= 6 ? "Muy bien, ya piensas como investigador." : "Sigue explorando las otras pestañas para aprender más.";
    quizSiguiente.textContent = "Jugar de nuevo";
  }
});
mostrarPregunta();

// con las flechas del teclado se pasa de una pestaña a otra
document.querySelector(".pestanas").addEventListener("keydown", function (ev) {
  if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
  const lista = Array.from(pestanas);
  const actual = lista.findIndex(function (p) { return p.classList.contains("activa"); });
  const siguiente = lista[(actual + (ev.key === "ArrowRight" ? 1 : lista.length - 1)) % lista.length];
  mostrarPestana(siguiente.dataset.panel);
  siguiente.focus();
});

window.addEventListener("hashchange", mostrarVista);
mostrarVista();
