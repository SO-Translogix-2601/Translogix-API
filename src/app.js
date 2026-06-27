import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { modelsByRoute } from "./models/index.js";
import { crudRoutes } from "./routes/crudRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { swaggerSpec } from "./config/swagger.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    name: "Translogix API",
    status: "ok",
    docs: "/api-docs",
    endpoints: Object.keys(modelsByRoute).map((route) => `/api/${route}`),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

for (const [route, Model] of Object.entries(modelsByRoute)) {
  app.use(`/api/${route}`, crudRoutes(Model));
}

app.use(notFound);
app.use(errorHandler);
