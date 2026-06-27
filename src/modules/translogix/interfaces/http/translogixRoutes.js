import { Router } from "express";
import { resourceCatalog } from "../../domain/resourceCatalog.js";
import { modelsByRoute } from "../../infrastructure/mongoose/models.js";
import { createMongoCrudRepository } from "../../infrastructure/repositories/createMongoCrudRepository.js";
import { createCrudService } from "../../application/createCrudService.js";
import { createCrudController } from "./createCrudController.js";
import { createCrudRouter } from "./createCrudRouter.js";

export function createTranslogixRouter() {
  const router = Router();

  for (const resource of resourceCatalog) {
    const Model = modelsByRoute[resource.name];
    const repository = createMongoCrudRepository(Model);
    const service = createCrudService(repository);
    const controller = createCrudController(service);

    router.use(`/${resource.name}`, createCrudRouter(controller));
  }

  return router;
}
