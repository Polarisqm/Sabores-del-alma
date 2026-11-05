// Gestiona autenticación del cliente, catálogo de tienda, compras e historial de pedidos.
// Se carga después de main.js para reutilizar sus datos y funciones compartidas.
//
// OJO con la seguridad: todo lo que viene del servidor (nombres, mensajes...) se escribe con
// textContent y nunca con innerHTML, para que nadie pueda colar código en la página.

const CLAVE_TOKEN = "sda_token";
const CLAVE_USUARIO = "sda_usuario";
const formatoPesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const nombresEstado = { pendiente: "Pendiente", confirmado: "Confirmado", preparando: "En preparación", entregado: "Entregado", cancelado: "Cancelado" };

// Estado de interfaz guardado en memoria mientras se usa esta página.
let usuarioActual = null;    // quién tiene la sesión abierta (null si nadie)
let postresApi = null;       // los postres con su precio, tal como los manda el servidor
let postreEnCompra = null;   // el postre que se está comprando en la ventana


// ---------- ayudas pequeñas ----------
// Crea un nodo DOM y asigna texto como texto plano para evitar insertar HTML no confiable.
function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function primerNombre(nombre) {
  // Saludo breve en el menú, sin cambiar el nombre completo almacenado.
  return String(nombre || "").trim().split(" ")[0];
}

function rutaActual() {
  // Convierte el hash actual en el nombre de vista y un parámetro opcional.
  const partes = location.hash.replace("#/", "").split("/");
  return { vista: partes[0] || "inicio", clave: partes[1] };
}

let temporizadorAviso;
function mostrarAviso(texto, tipo) {
  // Muestra un aviso global durante seis segundos y reinicia el temporizador si se repite.
  const caja = document.getElementById("aviso-global");
  caja.textContent = texto;
  caja.className = "aviso-global " + (tipo || "info");
  caja.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () { caja.hidden = true; }, 6000);
}


// ---------- hablar con el servidor ----------
async function api(ruta, opciones) {
  // Centraliza fetch, JSON y JWT; transforma errores de red y HTTP en errores legibles.
  opciones = opciones || {};
  const cabeceras = { "Content-Type": "application/json" };
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) cabeceras.Authorization = "Bearer " + token;

  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: opciones.metodo || "GET",
      headers: cabeceras,
      body: opciones.cuerpo ? JSON.stringify(opciones.cuerpo) : undefined
    });
  } catch (error) {
    throw new Error("No pudimos conectar con el servidor. Intenta de nuevo en un momento.");
  }

  let datos = {};
  try { datos = await respuesta.json(); } catch (error) { /* la respuesta no traía cuerpo */ }

  if (!respuesta.ok) {
    const fallo = new Error(datos.error || "Algo salió mal, intenta de nuevo.");
    fallo.estado = respuesta.status;
    throw fallo;
  }
  return datos;
}


// ---------- la sesión ----------
// Lee los datos persistidos; si el JSON está corrupto o falta token, considera la sesión cerrada.
function leerSesion() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    return guardado && localStorage.getItem(CLAVE_TOKEN) ? JSON.parse(guardado) : null;
  } catch (error) {
    return null;
  }
}

function guardarSesion(token, usuario) {
  // Persiste credenciales de cliente y actualiza la navegación con el usuario recién autenticado.
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  usuarioActual = usuario;
  actualizarCabecera();
}

function borrarSesion() {
  // Elimina credenciales locales y cambia la interfaz a estado sin sesión.
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
  usuarioActual = null;
  actualizarCabecera();
}

// muestra "Ingresar / Crear cuenta" o "Hola, Nombre" según haya o no sesión
function actualizarCabecera() {
  // Alterna enlaces de acceso, saludo y panel administrativo según el rol.
  const dentro = Boolean(usuarioActual);
  document.querySelectorAll(".sesion-fuera").forEach(function (li) { li.hidden = dentro; });
  document.querySelector(".sesion-dentro").hidden = !dentro;
  if (dentro) {
    document.getElementById("usuario-nombre").textContent = "Hola, " + primerNombre(usuarioActual.nombre);
    document.getElementById("enlace-admin").hidden = usuarioActual.rol !== "admin";
  }
}

// guarda a dónde iba la persona para volver ahí después de entrar
function pedirIngreso(mensaje, hashDestino, claveCompra) {
  // Guarda la acción pendiente para retomarla después de que la persona inicie sesión.
  if (hashDestino) sessionStorage.setItem("sda_volver", hashDestino);
  if (claveCompra) sessionStorage.setItem("sda_compra", claveCompra);
  if (mensaje) mostrarAviso(mensaje, "info");
  location.hash = "#/ingresar";
}

function despuesDeEntrar(usuario) {
  // Da bienvenida, restaura la ruta previa y retoma una compra que quedó en espera.
  mostrarAviso("¡Hola, " + primerNombre(usuario.nombre) + "! Ya iniciaste sesión.", "ok");
  const volver = sessionStorage.getItem("sda_volver");
  const compra = sessionStorage.getItem("sda_compra");
  sessionStorage.removeItem("sda_volver");
  sessionStorage.removeItem("sda_compra");
  location.hash = volver || "#/";
  // si entró para comprar algo, le abrimos la compra de una vez
  if (compra) setTimeout(function () { abrirCompra(compra); }, 400);
}


// ---------- formularios ----------
// una sola función para los formularios de este archivo: bloquea el botón mientras se envía
// y muestra el mensaje que devuelva la acción (o el error si algo falla)
function manejarFormulario(formulario, respuestaEl, accion) {
  // Controla el ciclo común de envío: bloquear, ejecutar, informar resultado y liberar el botón.
  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const boton = formulario.querySelector('button[type="submit"]');
    respuestaEl.textContent = "";
    respuestaEl.className = "respuesta-formulario";
    boton.disabled = true;
    try {
      const mensaje = await accion();
      if (mensaje) {
        respuestaEl.textContent = mensaje;
        respuestaEl.classList.add("exito");
      }
    } catch (error) {
      respuestaEl.textContent = error.message;
      respuestaEl.classList.add("error");
    } finally {
      boton.disabled = false;
    }
  });
}

const formIngresar = document.getElementById("form-ingresar");
// Envía credenciales al backend y guarda la sesión cuando el login responde correctamente.
manejarFormulario(formIngresar, document.getElementById("i-respuesta"), async function () {
  const resultado = await api("/auth/login", {
    metodo: "POST",
    cuerpo: { correo: formIngresar.correo.value, clave: formIngresar.clave.value }
  });
  guardarSesion(resultado.token, resultado.usuario);
  formIngresar.reset();
  despuesDeEntrar(resultado.usuario);
});

const formRegistro = document.getElementById("form-registro");
// Valida coincidencia local de claves y luego solicita la creación de la cuenta.
manejarFormulario(formRegistro, document.getElementById("r-respuesta"), async function () {
  if (formRegistro.clave.value !== formRegistro.clave2.value) {
    throw new Error("Las dos contraseñas no coinciden.");
  }
  const resultado = await api("/auth/registro", {
    metodo: "POST",
    cuerpo: {
      nombre: formRegistro.nombre.value,
      correo: formRegistro.correo.value,
      telefono: formRegistro.telefono.value,
      clave: formRegistro.clave.value,
      aceptoDatos: formRegistro.aceptoDatos.checked
    }
  });
  guardarSesion(resultado.token, resultado.usuario);
  formRegistro.reset();
  despuesDeEntrar(resultado.usuario);
});

const formContacto = document.getElementById("form-contacto");
// Envía el formulario público de contacto y confirma al visitante que llegó.
manejarFormulario(formContacto, document.getElementById("c-respuesta"), async function () {
  await api("/contacto", {
    metodo: "POST",
    cuerpo: {
      nombre: formContacto.nombre.value,
      correo: formContacto.correo.value,
      asunto: formContacto.asunto.value,
      mensaje: formContacto.mensaje.value
    }
  });
  formContacto.reset();
  return "¡Gracias! Recibimos tu mensaje y te responderemos pronto.";
});

document.getElementById("cerrar-sesion").addEventListener("click", function () {
  // Cierra sesión y evita dejar al cliente en una vista que requiere cuenta.
  borrarSesion();
  mostrarAviso("Cerraste sesión. ¡Vuelve pronto!", "info");
  if (rutaActual().vista === "pedidos") location.hash = "#/";
});


// ---------- la tienda ----------
async function cargarPostres() {
  // Descarga el catálogo activo; guarda null y devuelve false si la API no está disponible.
  try {
    postresApi = await api("/postres");
    return true;
  } catch (error) {
    postresApi = null;
    return false;
  }
}

function precioTexto(postre) {
  // Presenta el precio en pesos colombianos o indica que todavía no está definido.
  return postre && postre.precio > 0 ? formatoPesos.format(postre.precio) : "Precio por definir";
}

function textoAlergenos(postre) {
  // Distingue entre ficha provisional y ficha confirmada para no prometer seguridad alimentaria.
  if (!postre.fichaConfirmada) {
    return "Alérgenos por confirmar" + (postre.alergenos.length ? " (lleva " + postre.alergenos.join(", ").toLowerCase() + ")" : "");
  }
  return postre.alergenos.length ? "Contiene: " + postre.alergenos.join(", ") : "Sin alérgenos registrados";
}

async function pintarTienda() {
  // Construye las tarjetas de tienda con precios del servidor y desactiva compras no disponibles.
  const lista = document.getElementById("tienda-lista");
  const aviso = document.getElementById("tienda-aviso");
  const conectado = await cargarPostres();

  aviso.hidden = conectado;
  aviso.textContent = "No pudimos conectar con la tienda en este momento. Puedes mirar los postres, pero todavía no es posible comprar.";
  lista.innerHTML = "";

  Object.keys(emociones).forEach(function (clave) {
    const info = conectado ? postresApi.find(function (p) { return p.clave === clave; }) : null;
    if (conectado && !info) return;   // un postre desactivado no aparece

    const tarjeta = crear("article", "postre-tienda");
    tarjeta.dataset.emocion = clave;

    const foto = crear("img");
    foto.src = "img/postre-" + clave + ".jpg";
    foto.alt = emociones[clave].postre;
    tarjeta.appendChild(foto);

    const cuerpo = crear("div", "postre-tienda-cuerpo");
    cuerpo.appendChild(crear("h3", "", emociones[clave].postre));
    cuerpo.appendChild(crear("span", "pildora", emociones[clave].nombre));
    cuerpo.appendChild(crear("p", "", emociones[clave].sabor));
    cuerpo.appendChild(crear("p", "precio", info ? precioTexto(info) : "—"));
    cuerpo.appendChild(crear("p", "aviso", info ? textoAlergenos(info) : ""));

    const boton = crear("button", "boton boton-principal", "Comprar");
    boton.type = "button";
    boton.disabled = !(info && info.precio > 0);
    boton.addEventListener("click", function () { abrirCompra(clave); });
    cuerpo.appendChild(boton);

    const enlace = crear("a", "ver-postre", "Ver el postre");
    enlace.href = "#/emocion/" + clave;
    cuerpo.appendChild(enlace);

    tarjeta.appendChild(cuerpo);
    lista.appendChild(tarjeta);
  });
}

// el precio y el botón de compra de la página de cada postre
async function actualizarCompra(clave) {
  // Sincroniza precio y disponibilidad del botón en la página de detalle del postre.
  const precio = document.getElementById("e-precio");
  const boton = document.getElementById("e-comprar");
  boton.dataset.clave = clave;

  if (!postresApi) {
    precio.textContent = "Consultando el precio…";
    boton.disabled = true;
    await cargarPostres();
  }
  // si mientras tanto la persona se fue a otra página, no hay nada que actualizar
  const ruta = rutaActual();
  if (ruta.vista !== "emocion" || ruta.clave !== clave) return;

  const info = postresApi ? postresApi.find(function (p) { return p.clave === clave; }) : null;
  precio.textContent = postresApi ? (info ? precioTexto(info) : "No disponible por ahora") : "La tienda no está disponible por ahora";
  boton.disabled = !(info && info.precio > 0);
}

document.getElementById("e-comprar").addEventListener("click", function () {
  abrirCompra(document.getElementById("e-comprar").dataset.clave);
});


// ---------- la ventana de compra ----------
const dialogo = document.getElementById("dialogo-compra");
const campoCantidad = document.getElementById("compra-cantidad");

function leerCantidad() {
  // Limita la cantidad ingresada al rango de 1 a 20, incluso si se altera el campo HTML.
  const n = parseInt(campoCantidad.value, 10);
  return Math.min(20, Math.max(1, isNaN(n) ? 1 : n));
}

function recalcularTotal() {
  // Normaliza la cantidad y calcula el total visible con el precio actual de la API.
  campoCantidad.value = leerCantidad();
  document.getElementById("compra-total").textContent = formatoPesos.format(postreEnCompra.precio * leerCantidad());
}

async function abrirCompra(clave) {
  // Exige sesión, comprueba disponibilidad y carga el diálogo con datos reales antes de abrirlo.
  // para comprar hay que tener cuenta: si no hay sesión, primero se inicia y luego se vuelve aquí
  if (!usuarioActual) {
    pedirIngreso("Para comprar necesitas iniciar sesión o crear una cuenta.", location.hash, clave);
    return;
  }
  if (!postresApi) await cargarPostres();
  const info = postresApi ? postresApi.find(function (p) { return p.clave === clave; }) : null;
  if (!info || !(info.precio > 0)) {
    mostrarAviso("Este postre no está disponible para comprar por ahora.", "error");
    return;
  }

  postreEnCompra = info;
  document.getElementById("compra-titulo").textContent = "Comprar " + info.nombre;
  const foto = document.getElementById("compra-img");
  foto.src = "img/postre-" + clave + ".jpg";
  foto.alt = info.nombre;
  document.getElementById("compra-precio").textContent = precioTexto(info) + " c/u";
  document.getElementById("compra-alergenos").textContent = textoAlergenos(info) +
    (info.fichaConfirmada ? "" : ". Si tienes alguna alergia, cuéntanoslo en las indicaciones.");
  document.getElementById("compra-cliente").textContent = "Pedido a nombre de " + usuarioActual.nombre + ", teléfono " + usuarioActual.telefono + ".";
  document.getElementById("compra-notas").value = "";
  document.getElementById("compra-error").textContent = "";
  campoCantidad.value = 1;
  recalcularTotal();
  document.getElementById("compra-formulario").hidden = false;
  document.getElementById("compra-exito").hidden = true;
  document.getElementById("compra-confirmar").disabled = false;
  dialogo.showModal();
}

document.getElementById("cantidad-menos").addEventListener("click", function () {
  // Los botones de cantidad aplican el mismo límite que la entrada manual.
  campoCantidad.value = Math.max(1, leerCantidad() - 1);
  recalcularTotal();
});
document.getElementById("cantidad-mas").addEventListener("click", function () {
  // Aumenta una unidad sin superar el máximo permitido.
  campoCantidad.value = Math.min(20, leerCantidad() + 1);
  recalcularTotal();
});
campoCantidad.addEventListener("input", recalcularTotal);

function cerrarCompra() {
  // Cierra el elemento dialog nativo del navegador.
  dialogo.close();
}
document.getElementById("compra-x").addEventListener("click", cerrarCompra);
document.getElementById("compra-cancelar").addEventListener("click", cerrarCompra);
document.getElementById("compra-cerrar").addEventListener("click", cerrarCompra);
document.getElementById("compra-ver-pedidos").addEventListener("click", cerrarCompra);
// un clic en el fondo oscuro también cierra la ventana
dialogo.addEventListener("click", function (ev) {
  // Solo cierra al pulsar el fondo exterior, no al interactuar con el contenido.
  if (ev.target === dialogo) cerrarCompra();
});

document.getElementById("compra-confirmar").addEventListener("click", async function () {
  // Envía el pedido; el backend vuelve a calcular precios y valida disponibilidad.
  const boton = document.getElementById("compra-confirmar");
  const error = document.getElementById("compra-error");
  error.textContent = "";
  boton.disabled = true;
  try {
    const cantidad = leerCantidad();
    const resultado = await api("/pedidos", {
      metodo: "POST",
      cuerpo: { items: [{ clave: postreEnCompra.clave, cantidad }], notas: document.getElementById("compra-notas").value }
    });
    const pedido = resultado.pedido;
    document.getElementById("compra-numero").textContent = pedido.numero;
    document.getElementById("compra-resumen").textContent = cantidad + " × " + postreEnCompra.nombre + " — total " + formatoPesos.format(pedido.total) + ".";
    document.getElementById("compra-formulario").hidden = true;
    document.getElementById("compra-exito").hidden = false;
  } catch (fallo) {
    if (fallo.estado === 401) {
      // la sesión venció mientras la persona estaba en la ventana
      borrarSesion();
      dialogo.close();
      pedirIngreso("Tu sesión venció. Inicia sesión de nuevo para terminar la compra.", location.hash, postreEnCompra.clave);
      return;
    }
    error.textContent = fallo.message;
    error.classList.add("error");
    boton.disabled = false;
  }
});


// ---------- mis pedidos ----------
function fechaBonita(texto) {
  // Convierte la fecha ISO recibida del backend al formato local de Colombia.
  return new Date(texto).toLocaleString("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

async function pintarPedidos() {
  // Solicita los pedidos de la sesión actual y crea una tarjeta por cada resultado.
  const intro = document.getElementById("pedidos-intro");
  const lista = document.getElementById("pedidos-lista");
  lista.innerHTML = "";
  intro.textContent = "Cargando tus pedidos…";

  let pedidos;
  try {
    pedidos = await api("/pedidos/mios");
  } catch (error) {
    if (error.estado === 401) {
      borrarSesion();
      pedirIngreso("Tu sesión venció. Inicia sesión de nuevo.", "#/pedidos");
      return;
    }
    intro.textContent = error.message;
    return;
  }

  if (pedidos.length === 0) {
    intro.textContent = "Todavía no has hecho ningún pedido. Cuando lo hagas aparecerá aquí.";
    return;
  }
  intro.textContent = "Estos son tus pedidos, del más reciente al más antiguo.";

  pedidos.forEach(function (pedido) {
    const tarjeta = crear("article", "pedido");
    const cabecera = crear("div", "pedido-cabecera");
    cabecera.appendChild(crear("b", "", pedido.numero));
    cabecera.appendChild(crear("span", "estado estado-" + pedido.estado, nombresEstado[pedido.estado] || pedido.estado));
    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(crear("p", "aviso", fechaBonita(pedido.creadoEn)));

    const items = crear("ul", "pedido-items");
    pedido.items.forEach(function (item) {
      items.appendChild(crear("li", "", item.cantidad + " × " + item.nombre + " — " + formatoPesos.format(item.precioUnitario * item.cantidad)));
    });
    tarjeta.appendChild(items);
    if (pedido.notas) tarjeta.appendChild(crear("p", "aviso", "Indicaciones: " + pedido.notas));
    tarjeta.appendChild(crear("p", "precio", "Total: " + formatoPesos.format(pedido.total)));
    lista.appendChild(tarjeta);
  });
}


// ---------- qué hacer en cada página ----------
function revisarRuta() {
  // Refresca tienda o pedidos cuando el hash cambia a una vista que necesita datos.
  const ruta = rutaActual();

  if (ruta.vista === "pedidos") {
    if (!usuarioActual) {
      pedirIngreso("Inicia sesión para ver tus pedidos.", "#/pedidos");
      return;
    }
    pintarPedidos();
  }

  if (ruta.vista === "tienda") pintarTienda();
  if (ruta.vista === "emocion" && emociones[ruta.clave]) actualizarCompra(ruta.clave);

  // quien ya tiene sesión no necesita ver el inicio de sesión ni el registro
  if ((ruta.vista === "ingresar" || ruta.vista === "registro") && usuarioActual) {
    location.hash = "#/tienda";
    return;
  }

  if (ruta.vista === "ingresar") {
    const pendiente = sessionStorage.getItem("sda_compra");
    document.getElementById("ingresar-intro").textContent = pendiente && emociones[pendiente]
      ? "Inicia sesión para continuar con tu compra de " + emociones[pendiente].postre + "."
      : "Entra con tu correo y tu contraseña.";
  }

  // si ya hay sesión, el formulario de contacto sale con tu nombre y tu correo
  if (ruta.vista === "contacto" && usuarioActual) {
    if (!formContacto.nombre.value) formContacto.nombre.value = usuarioActual.nombre;
    if (!formContacto.correo.value) formContacto.correo.value = usuarioActual.correo;
  }
}

window.addEventListener("hashchange", revisarRuta);

// al abrir la página: recupero la sesión guardada y compruebo con el servidor que todavía sirva
usuarioActual = leerSesion();
actualizarCabecera();
if (usuarioActual) {
  api("/auth/yo").then(function (r) {
    usuarioActual = r.usuario;
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(r.usuario));
    actualizarCabecera();
  }).catch(function (error) {
    if (error.estado === 401) borrarSesion();   // si el servidor está apagado no la borramos
  });
}
revisarRuta();
