// Capa de aplicacion: define los casos de uso CRUD sin depender directamente de Mongoose.
export function createCrudService(repository) {
  return {
    // Lista registros con paginacion, ordenamiento y filtros simples por query string.
    async list(params) {
      const { limit = 100, page = 1, sort = "-createdAt", ...filters } = params;
      const normalizedLimit = Number(limit);
      const normalizedPage = Number(page);
      const skip = (normalizedPage - 1) * normalizedLimit;
      const query = buildQuery(filters);

      // Ejecuta busqueda y conteo al mismo tiempo para responder con datos y metadata.
      const [items, total] = await Promise.all([
        repository.findAll({ query, sort, skip, limit: normalizedLimit }),
        repository.count(query),
      ]);

      return {
        data: items,
        meta: { total, page: normalizedPage, limit: normalizedLimit },
      };
    },

    // Obtiene un registro por su ObjectId.
    getById(id) {
      return repository.findById(id);
    },

    // Crea un registro usando el payload recibido por HTTP.
    create(payload) {
      return repository.create(payload);
    },

    // Actualiza un registro existente por ObjectId.
    update(id, payload) {
      return repository.update(id, payload);
    },

    // Elimina un registro por ObjectId.
    remove(id) {
      return repository.remove(id);
    },
  };
}

// Convierte parametros de consulta HTTP en filtros MongoDB sencillos.
function buildQuery(filters) {
  const query = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "") continue;
    if (key.endsWith("_id") || key === "_id") {
      // Los campos tipo id se comparan directamente.
      query[key] = value;
    } else if (value === "true" || value === "false") {
      // Convierte strings booleanos de la URL a Boolean.
      query[key] = value === "true";
    } else {
      // Para texto se usa busqueda parcial sin distinguir mayusculas/minusculas.
      query[key] = { $regex: value, $options: "i" };
    }
  }

  return query;
}
