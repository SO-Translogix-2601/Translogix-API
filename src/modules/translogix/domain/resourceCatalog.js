// Catalogo central de recursos publicados por la API.
// Cada elemento se convierte en una ruta CRUD bajo /api/{name}.
export const resourceCatalog = [
  { name: "roles", label: "Roles" },
  { name: "usuarios", label: "Usuarios" },
  { name: "conductores", label: "Conductores" },
  { name: "vehiculos", label: "Vehiculos" },
  { name: "clientes", label: "Clientes" },
  { name: "zonas", label: "Zonas" },
  { name: "rutas", label: "Rutas" },
  { name: "pedidos", label: "Pedidos" },
  { name: "despachos", label: "Despachos" },
  { name: "seguimiento_gps", label: "Seguimiento GPS" },
  { name: "incidencias", label: "Incidencias" },
  { name: "mantenimientos", label: "Mantenimientos" },
  { name: "reportes", label: "Reportes" },
  { name: "notificaciones", label: "Notificaciones" },
  { name: "publicaciones_feed", label: "Publicaciones feed" },
  { name: "comentarios", label: "Comentarios" },
];

// Lista simple de nombres usada por Swagger y por la ruta raiz.
export const resourceNames = resourceCatalog.map((resource) => resource.name);
