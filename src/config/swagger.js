import swaggerJSDoc from "swagger-jsdoc";

import { resourceNames } from "../modules/translogix/domain/resourceCatalog.js";

// Swagger se genera a partir del catalogo de recursos para evitar repetir documentacion.
const resources = resourceNames;

// Construye dinamicamente las rutas OpenAPI CRUD para cada recurso del sistema.
const paths = resources.reduce((acc, resource) => {
  acc[`/api/${resource}`] = {
    get: {
      tags: [resource],
      summary: `Listar ${resource}`,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", example: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", example: 100 } },
        { name: "sort", in: "query", schema: { type: "string", example: "-createdAt" } },
      ],
      responses: {
        200: { description: "Listado paginado" },
      },
    },
    post: {
      tags: [resource],
      summary: `Crear ${resource}`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object", additionalProperties: true },
          },
        },
      },
      responses: {
        201: { description: "Registro creado" },
        400: { description: "Datos invalidos" },
        409: { description: "Valor duplicado" },
      },
    },
  };

  acc[`/api/${resource}/{id}`] = {
    get: {
      tags: [resource],
      summary: `Obtener ${resource} por ID`,
      parameters: [{ $ref: "#/components/parameters/ObjectId" }],
      responses: {
        200: { description: "Registro encontrado" },
        404: { description: "Registro no encontrado" },
      },
    },
    put: {
      tags: [resource],
      summary: `Actualizar ${resource}`,
      parameters: [{ $ref: "#/components/parameters/ObjectId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object", additionalProperties: true },
          },
        },
      },
      responses: {
        200: { description: "Registro actualizado" },
        404: { description: "Registro no encontrado" },
      },
    },
    patch: {
      tags: [resource],
      summary: `Actualizar parcialmente ${resource}`,
      parameters: [{ $ref: "#/components/parameters/ObjectId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object", additionalProperties: true },
          },
        },
      },
      responses: {
        200: { description: "Registro actualizado" },
        404: { description: "Registro no encontrado" },
      },
    },
    delete: {
      tags: [resource],
      summary: `Eliminar ${resource}`,
      parameters: [{ $ref: "#/components/parameters/ObjectId" }],
      responses: {
        204: { description: "Registro eliminado" },
        404: { description: "Registro no encontrado" },
      },
    },
  };

  return acc;
}, {});

// Especificacion OpenAPI que Swagger UI muestra en /api-docs.
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Translogix API",
      version: "1.0.0",
      description: "Documentacion Swagger del CRUD con Express.js y Mongoose para translogix_db.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    tags: resources.map((name) => ({ name })),
    components: {
      parameters: {
        // Parametro reutilizable para endpoints que reciben un ObjectId de MongoDB.
        ObjectId: {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "555555555555555555555555",
          },
        },
      },
    },
    paths: {
      // Endpoint manual de estado de la API; el resto se agrega con ...paths.
      "/api/health": {
        get: {
          tags: ["health"],
          summary: "Verificar estado de la API",
          responses: {
            200: { description: "API funcionando" },
          },
        },
      },
      ...paths,
    },
  },
  apis: [],
});

