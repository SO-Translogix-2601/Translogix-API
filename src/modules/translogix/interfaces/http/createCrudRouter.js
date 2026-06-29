import { Router } from "express";

// Define las rutas REST comunes para cualquier recurso CRUD.
export function createCrudRouter(controller) {
  const router = Router();

  // Listar todos los registros del recurso.
  router.get("/", controller.list);
  // Obtener un registro puntual por ObjectId.
  router.get("/:id", controller.getById);
  // Crear un registro nuevo.
  router.post("/", controller.create);
  // Reemplazar/actualizar un registro existente.
  router.put("/:id", controller.update);
  // Actualizar parcialmente un registro existente.
  router.patch("/:id", controller.update);
  // Eliminar un registro existente.
  router.delete("/:id", controller.remove);

  return router;
}
