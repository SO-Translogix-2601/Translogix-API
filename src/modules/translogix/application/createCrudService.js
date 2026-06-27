export function createCrudService(repository) {
  return {
    async list(params) {
      const { limit = 100, page = 1, sort = "-createdAt", ...filters } = params;
      const normalizedLimit = Number(limit);
      const normalizedPage = Number(page);
      const skip = (normalizedPage - 1) * normalizedLimit;
      const query = buildQuery(filters);

      const [items, total] = await Promise.all([
        repository.findAll({ query, sort, skip, limit: normalizedLimit }),
        repository.count(query),
      ]);

      return {
        data: items,
        meta: { total, page: normalizedPage, limit: normalizedLimit },
      };
    },

    getById(id) {
      return repository.findById(id);
    },

    create(payload) {
      return repository.create(payload);
    },

    update(id, payload) {
      return repository.update(id, payload);
    },

    remove(id) {
      return repository.remove(id);
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
