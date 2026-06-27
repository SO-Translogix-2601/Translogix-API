import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { resourceNames } from "./modules/translogix/domain/resourceCatalog.js";
import { createTranslogixRouter } from "./modules/translogix/interfaces/http/translogixRoutes.js";
import { authRoutes } from "./modules/auth/interfaces/http/authRoutes.js";
import { errorHandler, notFound } from "./shared/middleware/errorMiddleware.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    name: "Translogix API",
    status: "ok",
    architecture: "DDD ligera por modulo",
    docs: "/api-docs",
    endpoints: resourceNames.map((route) => `/api/${route}`),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes());
app.use("/api", createTranslogixRouter());

app.use(notFound);
app.use(errorHandler);
