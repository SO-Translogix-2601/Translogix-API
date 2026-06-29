# Imagen base oficial de MongoDB. Incluye el entrypoint que ejecuta scripts de inicializacion.
FROM mongo:7.0

# Metadatos descriptivos de la imagen del proyecto.
LABEL maintainer="Translogix TMS"
LABEL description="Base de datos MongoDB para el sistema de logistica Translogix TMS"

# Credenciales y base por defecto que Mongo usa en su primera inicializacion.
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=translogix2026
ENV MONGO_INITDB_DATABASE=translogix_db

# Copia el seed a la carpeta especial del entrypoint oficial de Mongo.
# Todo script en /docker-entrypoint-initdb.d/ se ejecuta solo cuando /data/db esta vacio.
COPY translogix_seed.js /docker-entrypoint-initdb.d/01_translogix_seed.js

# Puerto interno de MongoDB dentro del contenedor.
EXPOSE 27017

# Directorio persistente donde MongoDB guarda los datos.
VOLUME ["/data/db"]
