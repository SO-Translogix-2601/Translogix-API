export function createMongoCrudRepository(Model) {
  return {
    findAll({ query, sort, skip, limit }) {
      return Model.find(query).sort(sort).skip(skip).limit(limit);
    },

    count(query) {
      return Model.countDocuments(query);
    },

    findById(id) {
      return Model.findById(id);
    },

    create(payload) {
      return Model.create(payload);
    },

    update(id, payload) {
      return Model.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
    },

    remove(id) {
      return Model.findByIdAndDelete(id);
    },
  };
}
