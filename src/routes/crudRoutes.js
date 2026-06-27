import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";

export function crudRoutes(Model) {
  const router = Router();
  const controller = createCrudController(Model);

  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
