import { modules } from "../modules.js";

export const planDefinitions = {
  plus: {
    title: "Plus",
    subtitle: "Operacion logistica esencial",
    description: "Control de clientes, flota, rutas, pedidos y despachos de ultima milla.",
    modules: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos", "seguimiento_gps", "incidencias", "notificaciones", "suscripciones"],
    features: ["CRUD logistico operativo", "Monitoreo GPS", "Gestion de incidencias", "Notificaciones internas"],
  },
  premium: {
    title: "Premium",
    subtitle: "Arquitectura completa para crecimiento",
    description: "Incluye todo Plus mas IAM administrativo, mantenimiento, reportes y comunicacion interna.",
    modules: modules.map((module) => module.key),
    features: ["Todos los modulos", "Usuarios y roles", "Reportes avanzados", "Mantenimientos", "Feed y comentarios"],
  },
};
