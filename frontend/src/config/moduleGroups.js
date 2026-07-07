import { Gauge, MessageSquareText, PackageCheck, ShieldCheck, Truck } from "lucide-react";

export const moduleGroups = [
  { key: "iam", title: "IAM", icon: ShieldCheck, keys: ["roles", "usuarios"] },
  { key: "operacion", title: "Operacion", icon: Truck, keys: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos"] },
  { key: "monitoreo", title: "Monitoreo", icon: Gauge, keys: ["seguimiento_gps", "incidencias", "mantenimientos"] },
  { key: "gestion", title: "Gestion", icon: PackageCheck, keys: ["reportes", "notificaciones", "suscripciones"] },
  { key: "comunicacion", title: "Comunicacion", icon: MessageSquareText, keys: ["publicaciones_feed", "comentarios"] },
];
