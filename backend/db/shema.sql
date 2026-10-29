CREATE TABLE productos (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  categoria   VARCHAR(20)  NOT NULL,
  metal       VARCHAR(20)  NOT NULL,
  piedra      VARCHAR(20),
  quilates    NUMERIC(4, 2),
  peso_g      NUMERIC(5, 2) NOT NULL,
  tallas      VARCHAR(30)  NOT NULL,
  precio      INTEGER      NOT NULL,
  destacado   BOOLEAN      NOT NULL DEFAULT false,
  nuevo       BOOLEAN      NOT NULL DEFAULT false,
  descripcion TEXT
);