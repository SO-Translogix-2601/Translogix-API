import { modules } from "../modules.js";

export const roleDefinitions = {
  Administrador: {
    title: "Administrador",
    description: "Gestion completa del TMS, IAM, reportes y configuracion.",
    modules: modules.map((module) => module.key),
  },
  Operador: {
    title: "Operador",
    description: "Gestion operativa de clientes, rutas, pedidos, despachos e incidencias.",
    modules: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos", "seguimiento_gps", "incidencias", "notificaciones", "suscripciones"],
  },
  Conductor: {
    title: "Conductor",
    description: "Consulta de despachos asignados, GPS, incidencias y comunicacion interna.",
    modules: ["despachos", "seguimiento_gps", "incidencias", "notificaciones", "publicaciones_feed", "comentarios", "suscripciones"],
  },
};
