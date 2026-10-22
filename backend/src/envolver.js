// si una ruta async falla, pasamos el error al manejador general en vez de dejar el servidor colgado
function envolver(funcion) {
  return function (req, res, next) {
    Promise.resolve(funcion(req, res, next)).catch(next);
  };
}

module.exports = envolver;
