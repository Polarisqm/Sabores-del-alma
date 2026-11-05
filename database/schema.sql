-- Esquema relacional alternativo del proyecto: crea la base y sus tablas desde cero.
-- ATENCIÓN: DROP TABLE elimina los datos existentes, incluidos usuarios; ejecutar solo al reiniciar.

-- Crea la base con UTF-8 completo para guardar correctamente tildes y otros caracteres.
CREATE DATABASE IF NOT EXISTS sabores_del_alma
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Selecciona la base donde se ejecutarán las instrucciones siguientes.
USE sabores_del_alma;

-- Borra primero tablas dependientes para respetar las claves foráneas entre ellas.
DROP TABLE IF EXISTS postre_alergenos;
DROP TABLE IF EXISTS ingredientes;
DROP TABLE IF EXISTS frases;
DROP TABLE IF EXISTS postres;
DROP TABLE IF EXISTS alergenos;
DROP TABLE IF EXISTS emociones;
DROP TABLE IF EXISTS mensajes_contacto;
DROP TABLE IF EXISTS usuarios;

-- Catálogo de emociones: clave estable para enlazar datos y nombre/color visibles en la web.
CREATE TABLE emociones (
  -- Identificador numérico autogenerado para referencias internas.
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- Código corto único utilizado por la aplicación para localizar la emoción.
  clave VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(40) NOT NULL,
  color_hex CHAR(7) NOT NULL,
  color_nombre VARCHAR(40),
  significado TEXT,
  regulacion TEXT
);

-- un postre por emoción (la tabla permite más si algún día hacen falta)
-- Cada postre pertenece a una emoción; la aplicación puede ampliar el catálogo cuando sea necesario.
CREATE TABLE postres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emocion_id INT NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  sabor VARCHAR(120),
  historia TEXT,
  imagen VARCHAR(120),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  -- mientras sea FALSE la página debe mostrar "por definir" y no una lista vacía,
  -- porque una lista vacía de alérgenos se podría leer como "no tiene ninguno"
  ficha_confirmada BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (emocion_id) REFERENCES emociones(id)
);

-- Los ingredientes se guardan por sección y orden para presentar la receta organizada.
CREATE TABLE ingredientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postre_id INT NOT NULL,
  seccion VARCHAR(60) NOT NULL,   -- por ejemplo "Capa cremosa" o "Cobertura"
  texto VARCHAR(200) NOT NULL,    -- por ejemplo "200 g de queso crema"
  orden INT NOT NULL DEFAULT 0,
  FOREIGN KEY (postre_id) REFERENCES postres(id) ON DELETE CASCADE
);

-- Catálogo único de alérgenos reutilizable por varios postres.
CREATE TABLE alergenos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE
);

-- Tabla puente muchos-a-muchos: permite varios alérgenos por postre y varios postres por alérgeno.
CREATE TABLE postre_alergenos (
  postre_id INT NOT NULL,
  alergeno_id INT NOT NULL,
  PRIMARY KEY (postre_id, alergeno_id),
  FOREIGN KEY (postre_id) REFERENCES postres(id) ON DELETE CASCADE,
  FOREIGN KEY (alergeno_id) REFERENCES alergenos(id) ON DELETE CASCADE
);

-- Frases que la página puede mostrar aleatoriamente para acompañar una emoción.
CREATE TABLE frases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emocion_id INT NOT NULL,
  texto VARCHAR(200) NOT NULL,
  FOREIGN KEY (emocion_id) REFERENCES emociones(id) ON DELETE CASCADE
);

-- Mensajes recibidos desde el formulario de contacto y su estado de lectura.
CREATE TABLE mensajes_contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  asunto ENUM('consulta', 'sugerencia', 'colaboracion', 'otro') NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cuentas de clientes y administradores. Se almacena únicamente el hash de la contraseña.
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
