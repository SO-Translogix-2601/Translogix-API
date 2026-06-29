import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { resourceNames } from "./modules/translogix/domain/resourceCatalog.js";
import { createTranslogixRouter } from "./modules/translogix/interfaces/http/translogixRoutes.js";
import { errorHandler, notFound } from "./shared/middleware/errorMiddleware.js";

// Crea la instancia principal de Express. Este archivo configura la capa HTTP de la aplicacion.
export const app = express();

// Middlewares globales:
// - cors permite llamadas desde otros origenes.
// - express.json permite recibir cuerpos JSON.
// - morgan registra cada peticion HTTP en consola.
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Publica la documentacion interactiva de Swagger en /api-docs.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta raiz de bienvenida. Devuelve informacion basica y la lista de endpoints disponibles.
app.get("/", (req, res) => {
  res.json({
    name: "Translogix API",
    status: "ok",
    architecture: "DDD ligera por modulo",
    docs: "/api-docs",
    endpoints: resourceNames.map((route) => `/api/${route}`),
  });
});

// Endpoint simple para verificar que la API esta viva.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Monta todas las rutas CRUD generadas para los recursos de Translogix.
app.use("/api", createTranslogixRouter());

// Middlewares finales: primero captura rutas inexistentes y luego formatea errores.
app.use(notFound);
app.use(errorHandler);
