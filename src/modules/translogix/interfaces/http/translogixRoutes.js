import { Router } from "express";
import { resourceCatalog } from "../../domain/resourceCatalog.js";
import { modelsByRoute } from "../../infrastructure/mongoose/models.js";
import { createMongoCrudRepository } from "../../infrastructure/repositories/createMongoCrudRepository.js";
import { createCrudService } from "../../application/createCrudService.js";
import { createCrudController } from "./createCrudController.js";
import { createCrudRouter } from "./createCrudRouter.js";

// Ensambla todo el modulo Translogix: modelo -> repositorio -> servicio -> controlador -> ruta.
export function createTranslogixRouter() {
  const router = Router();

  // Recorre el catalogo y crea automaticamente un CRUD para cada recurso.
  for (const resource of resourceCatalog) {
    const Model = modelsByRoute[resource.name];
    const repository = createMongoCrudRepository(Model);
    const service = createCrudService(repository);
    const controller = createCrudController(service);

    // Ejemplo: resource.name = "clientes" produce /api/clientes.
    router.use(`/${resource.name}`, createCrudRouter(controller));
  }

  return router;
}
