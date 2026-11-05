// Sabores del Alma - panel de administrador
// Todo lo que viene del servidor se escribe con textContent (nunca innerHTML) para que nadie pueda colar código.

const CLAVE_ADMIN = "sda_admin_token";
const formatoPesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const estados = ["pendiente", "confirmado", "preparando", "entregado", "cancelado"];
const nombresEstado = { pendiente: "Pendiente", confirmado: "Confirmado", preparando: "En preparación", entregado: "Entregado", cancelado: "Cancelado" };

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function fechaBonita(texto) {
  return new Date(texto).toLocaleString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// el token del administrador vive solo mientras la pestaña esté abierta
function leerToken() {
  try { return sessionStorage.getItem(CLAVE_ADMIN); } catch (error) { return null; }
}

async function api(ruta, opciones) {
  opciones = opciones || {};
  const cabeceras = { "Content-Type": "application/json" };
  const token = leerToken();
  if (token) cabeceras.Authorization = "Bearer " + token;

  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: opciones.metodo || "GET",
      headers: cabeceras,
      body: opciones.cuerpo ? JSON.stringify(opciones.cuerpo) : undefined
    });
  } catch (error) {
    throw new Error("No pudimos conectar con el servidor.");
  }
  let datos = {};
  try { datos = await respuesta.json(); } catch (error) { /* sin cuerpo */ }
  if (!respuesta.ok) {
    const fallo = new Error(datos.error || "Algo salió mal.");
    fallo.estado = respuesta.status;
    throw fallo;
  }
  return datos;
}

let temporizador;
function avisar(texto, esError) {
  const caja = document.getElementById("admin-aviso");
  caja.textContent = texto;
  caja.className = "aviso-tienda" + (esError ? " error" : "");
  caja.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(function () { caja.hidden = true; }, 5000);
}

// si el servidor dice que la sesión ya no sirve, se vuelve a la pantalla de entrada
function manejarFallo(error) {
  if (error.estado === 401 || error.estado === 403) {
    salir();
    return;
  }
  avisar(error.message, true);
}

// ---------- entrar y salir ----------
function mostrarPanel(dentro) {
  document.getElementById("admin-login").hidden = dentro;
  document.getElementById("admin-panel").hidden = !dentro;
  document.getElementById("admin-salir").hidden = !dentro;
}

function salir() {
  try { sessionStorage.removeItem(CLAVE_ADMIN); } catch (error) { /* nada que borrar */ }
  mostrarPanel(false);
}

document.getElementById("admin-form").addEventListener("submit", async function (evento) {
  evento.preventDefault();
  const respuesta = document.getElementById("admin-respuesta");
  const boton = evento.target.querySelector("button");
  respuesta.textContent = "";
  respuesta.className = "respuesta-formulario";
  boton.disabled = true;
  try {
    const r = await api("/auth/login", {
      metodo: "POST",
      cuerpo: { correo: document.getElementById("admin-correo").value, clave: document.getElementById("admin-clave").value }
    });
    if (r.usuario.rol !== "admin") {
      throw new Error("Esta cuenta no es de administrador.");
    }
    sessionStorage.setItem(CLAVE_ADMIN, r.token);
    document.getElementById("admin-saludo").textContent = "Hola, " + r.usuario.nombre + ". Esta sesión se cierra sola en 2 horas.";
    evento.target.reset();
    mostrarPanel(true);
    cargarTodo();
  } catch (error) {
    respuesta.textContent = error.message;
    respuesta.classList.add("error");
  } finally {
    boton.disabled = false;
  }
});

document.getElementById("admin-salir").addEventListener("click", salir);

// ---------- pestañas ----------
const pestanas = document.querySelectorAll(".pestana");
pestanas.forEach(function (p) {
  p.addEventListener("click", function () {
    pestanas.forEach(function (otra) { otra.classList.toggle("activa", otra === p); });
    document.querySelectorAll(".panel-ciencia").forEach(function (panel) {
      panel.hidden = panel.id !== "a-" + p.dataset.panel;
    });
  });
});

// ---------- tablas ----------
function tabla(columnas) {
  const t = crear("table");
  const cabecera = crear("tr");
  columnas.forEach(function (c) { cabecera.appendChild(crear("th", "", c)); });
  t.appendChild(cabecera);
  return t;
}

function celda(fila, contenido) {
  const td = crear("td");
  if (typeof contenido === "string") td.textContent = contenido;
  else td.appendChild(contenido);
  fila.appendChild(td);
}

// ---------- pedidos ----------
async function cargarPedidos() {
  const pedidos = await api("/admin/pedidos");
  const pendientes = pedidos.filter(function (p) { return p.estado === "pendiente"; }).length;
  document.getElementById("a-pedidos-resumen").textContent = pedidos.length + " pedidos en total, " + pendientes + " pendientes.";

  const t = tabla(["Número", "Fecha", "Cliente", "Pedido", "Total", "Estado"]);
  pedidos.forEach(function (pedido) {
    const fila = crear("tr");
    celda(fila, pedido.numero);
    celda(fila, fechaBonita(pedido.creadoEn));

    const cliente = crear("div");
    cliente.appendChild(crear("b", "", pedido.cliente.nombre));
    cliente.appendChild(crear("div", "", pedido.cliente.telefono));
    cliente.appendChild(crear("div", "", pedido.cliente.correo));
    celda(fila, cliente);

    const items = crear("div");
    pedido.items.forEach(function (item) { items.appendChild(crear("div", "", item.cantidad + " × " + item.nombre)); });
    if (pedido.notas) items.appendChild(crear("div", "aviso", "Indicaciones: " + pedido.notas));
    celda(fila, items);

    celda(fila, formatoPesos.format(pedido.total));

    const selector = crear("select");
    selector.setAttribute("aria-label", "Estado del pedido " + pedido.numero);
    estados.forEach(function (estado) {
      const opcion = crear("option", "", nombresEstado[estado]);
      opcion.value = estado;
      opcion.selected = estado === pedido.estado;
      selector.appendChild(opcion);
    });
    selector.addEventListener("change", async function () {
      try {
        await api("/admin/pedidos/" + pedido._id + "/estado", { metodo: "PATCH", cuerpo: { estado: selector.value } });
        avisar("Pedido " + pedido.numero + " ahora está " + nombresEstado[selector.value].toLowerCase() + ".");
      } catch (error) {
        manejarFallo(error);
        selector.value = pedido.estado;
      }
    });
    celda(fila, selector);
    t.appendChild(fila);
  });

  const contenedor = document.getElementById("a-pedidos-tabla");
  contenedor.innerHTML = "";
  contenedor.appendChild(pedidos.length ? t : crear("p", "", "Todavía no hay pedidos."));
}

// ---------- mensajes ----------
async function cargarMensajes() {
  const mensajes = await api("/admin/mensajes");
  const sinLeer = mensajes.filter(function (m) { return !m.leido; }).length;
  document.getElementById("a-mensajes-resumen").textContent = mensajes.length + " mensajes, " + sinLeer + " sin leer.";

  const lista = document.getElementById("a-mensajes-lista");
  lista.innerHTML = "";
  mensajes.forEach(function (m) {
    const tarjeta = crear("article", "tarjeta mensaje-admin" + (m.leido ? "" : " sin-leer"));
    tarjeta.appendChild(crear("h3", "", m.nombre + " · " + m.asunto));
    tarjeta.appendChild(crear("p", "aviso", m.correo + " · " + fechaBonita(m.creadoEn)));
    tarjeta.appendChild(crear("p", "", m.mensaje));

    const acciones = crear("div", "acciones");
    if (!m.leido) {
      const leer = crear("button", "boton boton-chico", "Marcar como leído");
      leer.type = "button";
      leer.addEventListener("click", async function () {
        try { await api("/admin/mensajes/" + m._id + "/leido", { metodo: "PATCH" }); cargarMensajes(); } catch (error) { manejarFallo(error); }
      });
      acciones.appendChild(leer);
    }
    const borrar = crear("button", "boton boton-chico", "Borrar");
    borrar.type = "button";
    borrar.addEventListener("click", async function () {
      if (!confirm("¿Borrar este mensaje?")) return;
      try { await api("/admin/mensajes/" + m._id, { metodo: "DELETE" }); cargarMensajes(); } catch (error) { manejarFallo(error); }
    });
    acciones.appendChild(borrar);
    tarjeta.appendChild(acciones);
    lista.appendChild(tarjeta);
  });
  if (!mensajes.length) lista.appendChild(crear("p", "", "Todavía no hay mensajes."));
}

// ---------- postres y precios ----------
async function cargarPostres() {
  const postres = await api("/admin/postres");
  const t = tabla(["Postre", "Emoción", "Precio (pesos)", "Se vende", "Alérgenos confirmados", ""]);

  postres.forEach(function (postre) {
    const fila = crear("tr");
    celda(fila, postre.nombre);
    celda(fila, postre.sabor || "");

    const precio = crear("input");
    precio.type = "number";
    precio.min = "0";
    precio.max = "1000000";
    precio.step = "500";
    precio.value = postre.precio === null ? "" : postre.precio;
    precio.setAttribute("aria-label", "Precio de " + postre.nombre);
    celda(fila, precio);

    const activo = crear("input");
    activo.type = "checkbox";
    activo.checked = postre.activo;
    activo.setAttribute("aria-label", "Se vende " + postre.nombre);
    celda(fila, activo);

    const ficha = crear("input");
    ficha.type = "checkbox";
    ficha.checked = postre.fichaConfirmada;
    ficha.setAttribute("aria-label", "Alérgenos confirmados de " + postre.nombre);
    celda(fila, ficha);

    const guardar = crear("button", "boton boton-chico", "Guardar");
    guardar.type = "button";
    guardar.addEventListener("click", async function () {
      try {
        await api("/admin/postres/" + postre._id, {
          metodo: "PUT",
          cuerpo: { precio: Number(precio.value), activo: activo.checked, fichaConfirmada: ficha.checked }
        });
        avisar(postre.nombre + " guardado.");
      } catch (error) {
        manejarFallo(error);
      }
    });
    celda(fila, guardar);
    t.appendChild(fila);
  });

  const contenedor = document.getElementById("a-postres-tabla");
  contenedor.innerHTML = "";
  contenedor.appendChild(t);
}

// ---------- usuarios ----------
async function cargarUsuarios() {
  const usuarios = await api("/admin/usuarios");
  document.getElementById("a-usuarios-resumen").textContent = usuarios.length + " cuentas registradas.";
  const t = tabla(["Nombre", "Correo", "Teléfono", "Rol", "Registro"]);
  usuarios.forEach(function (u) {
    const fila = crear("tr");
    celda(fila, u.nombre);
    celda(fila, u.correo);
    celda(fila, u.telefono);
    celda(fila, u.rol);
    celda(fila, fechaBonita(u.creadoEn));
    t.appendChild(fila);
  });
  const contenedor = document.getElementById("a-usuarios-tabla");
  contenedor.innerHTML = "";
  contenedor.appendChild(t);
}

function cargarTodo() {
  Promise.all([cargarPedidos(), cargarMensajes(), cargarPostres(), cargarUsuarios()]).catch(manejarFallo);
}

// si la pestaña ya tenía una sesión abierta, entramos directo (si el token venció, el servidor responde 401 y se sale)
if (leerToken()) {
  mostrarPanel(true);
  document.getElementById("admin-saludo").textContent = "Sesión de administrador abierta.";
  cargarTodo();
}
