// Capa de infraestructura: adapta un modelo Mongoose a operaciones CRUD genericas.
export function createMongoCrudRepository(Model) {
  return {
    // Busca registros aplicando filtro, orden, paginacion y limite.
    findAll({ query, sort, skip, limit }) {
      return Model.find(query).sort(sort).skip(skip).limit(limit);
    },

    // Cuenta documentos para construir la metadata de paginacion.
    count(query) {
      return Model.countDocuments(query);
    },

    // Obtiene un documento por ObjectId.
    findById(id) {
      return Model.findById(id);
    },

    // Inserta un documento nuevo.
    create(payload) {
      return Model.create(payload);
    },

    // Actualiza y devuelve el documento resultante; runValidators aplica reglas del schema.
    update(id, payload) {
      return Model.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
    },

    // Elimina un documento por ObjectId.
    remove(id) {
      return Model.findByIdAndDelete(id);
    },
  };
}
