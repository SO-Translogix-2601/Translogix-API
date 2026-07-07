import { Gauge, MessageSquareText, PackageCheck, ShieldCheck, Truck } from "lucide-react";

export const moduleGroups = [
  { title: "IAM", icon: ShieldCheck, keys: ["roles", "usuarios"] },
  { title: "Operacion", icon: Truck, keys: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos"] },
  { title: "Monitoreo", icon: Gauge, keys: ["seguimiento_gps", "incidencias", "mantenimientos"] },
  { title: "Gestion", icon: PackageCheck, keys: ["reportes", "notificaciones", "suscripciones"] },
  { title: "Comunicacion", icon: MessageSquareText, keys: ["publicaciones_feed", "comentarios"] },
];
