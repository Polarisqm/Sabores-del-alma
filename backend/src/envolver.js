// Adaptador para rutas asíncronas: envía cualquier rechazo al manejador general de Express.
function envolver(funcion) {
  return function (req, res, next) {
    // Promise.resolve cubre tanto resultados síncronos como promesas devueltas por la ruta.
    Promise.resolve(funcion(req, res, next)).catch(next);
  };
}

module.exports = envolver;
