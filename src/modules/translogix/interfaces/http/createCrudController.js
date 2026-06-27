export function createCrudController(service) {
  return {
    async list(req, res, next) {
      try {
        const result = await service.list(req.query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    async getById(req, res, next) {
      try {
        const item = await service.getById(req.params.id);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        const item = await service.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        const item = await service.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

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
