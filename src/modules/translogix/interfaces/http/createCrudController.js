// Capa de interfaces HTTP: traduce peticiones Express a llamadas del servicio CRUD.
export function createCrudController(service) {
  return {
    // GET /api/recurso: lista registros usando los query params como filtros.
    async list(req, res, next) {
      try {
        const result = await service.list(req.query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    // GET /api/recurso/:id: obtiene un registro por ObjectId.
    async getById(req, res, next) {
      try {
        const item = await service.getById(req.params.id);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    // POST /api/recurso: crea un registro nuevo con el body JSON.
    async create(req, res, next) {
      try {
        const item = await service.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    },

    // PUT/PATCH /api/recurso/:id: actualiza un registro existente.
    async update(req, res, next) {
      try {
        const item = await service.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    // DELETE /api/recurso/:id: elimina el registro y responde 204 si existia.
    async remove(req, res, next) {
      try {
        const item = await service.remove(req.params.id);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}
