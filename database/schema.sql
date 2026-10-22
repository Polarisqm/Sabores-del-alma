-- Sabores del Alma - estructura de la base de datos
-- OJO: este archivo borra las tablas y las crea de nuevo, así que solo se usa
-- al empezar o cuando se quiera reiniciar todo (también se borran los usuarios).

CREATE DATABASE IF NOT EXISTS sabores_del_alma
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sabores_del_alma;

DROP TABLE IF EXISTS postre_alergenos;
DROP TABLE IF EXISTS ingredientes;
DROP TABLE IF EXISTS frases;
DROP TABLE IF EXISTS postres;
DROP TABLE IF EXISTS alergenos;
DROP TABLE IF EXISTS emociones;
DROP TABLE IF EXISTS mensajes_contacto;
DROP TABLE IF EXISTS usuarios;

-- las siete emociones
CREATE TABLE emociones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(40) NOT NULL,
  color_hex CHAR(7) NOT NULL,
  color_nombre VARCHAR(40),
  significado TEXT,
  regulacion TEXT
);

-- un postre por emoción (la tabla permite más si algún día hacen falta)
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

CREATE TABLE ingredientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postre_id INT NOT NULL,
  seccion VARCHAR(60) NOT NULL,   -- por ejemplo "Capa cremosa" o "Cobertura"
  texto VARCHAR(200) NOT NULL,    -- por ejemplo "200 g de queso crema"
  orden INT NOT NULL DEFAULT 0,
  FOREIGN KEY (postre_id) REFERENCES postres(id) ON DELETE CASCADE
);

CREATE TABLE alergenos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE
);

-- relación muchos a muchos: un postre tiene varios alérgenos y un alérgeno está en varios postres
CREATE TABLE postre_alergenos (
  postre_id INT NOT NULL,
  alergeno_id INT NOT NULL,
  PRIMARY KEY (postre_id, alergeno_id),
  FOREIGN KEY (postre_id) REFERENCES postres(id) ON DELETE CASCADE,
  FOREIGN KEY (alergeno_id) REFERENCES alergenos(id) ON DELETE CASCADE
);

CREATE TABLE frases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emocion_id INT NOT NULL,
  texto VARCHAR(200) NOT NULL,
  FOREIGN KEY (emocion_id) REFERENCES emociones(id) ON DELETE CASCADE
);

-- lo que llega por el formulario de contacto
CREATE TABLE mensajes_contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  asunto ENUM('consulta', 'sugerencia', 'colaboracion', 'otro') NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- administradores (y más adelante clientes, si se quisiera). La contraseña
-- NUNCA se guarda tal cual, solo su hash.
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
