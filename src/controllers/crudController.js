export function createCrudController(Model) {
  return {
    async list(req, res, next) {
      try {
        const { limit = 100, page = 1, sort = "-createdAt", ...filters } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = buildQuery(filters);

        const [items, total] = await Promise.all([
          Model.find(query).sort(sort).skip(skip).limit(Number(limit)),
          Model.countDocuments(query),
        ]);

        res.json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
      } catch (error) {
        next(error);
      }
    },

    async getById(req, res, next) {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Registro no encontrado" });
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}

function buildQuery(filters) {
  const query = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "") continue;
    if (key.endsWith("_id") || key === "_id") {
      query[key] = value;
    } else if (value === "true" || value === "false") {
      query[key] = value === "true";
    } else {
      query[key] = { $regex: value, $options: "i" };
    }
  }

  return query;
}
