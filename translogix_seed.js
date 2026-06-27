db = db.getSiblingDB("translogix_db");

function oid(n) {
  return ObjectId(n.toString(16).padStart(24, "0"));
}

const NOW = new Date();
const PASSWORD_HASH = "$2b$10$vbdyzlEV.FrrjMapLlY89.U9GagAx.WP6akAbeiEfWOr7H1Yw0uzS"; // Translogix2026!

const collections = [
  "roles",
  "usuarios",
  "suscripciones",
  "conductores",
  "vehiculos",
  "clientes",
  "zonas",
  "rutas",
  "pedidos",
  "despachos",
  "seguimiento_gps",
  "incidencias",
  "mantenimientos",
  "reportes",
  "notificaciones",
  "publicaciones_feed",
  "comentarios",
];

collections.forEach((name) => db[name].drop());

const roleIds = {
  admin: oid(1),
  operador: oid(2),
  conductor: oid(3),
};

const users = {
  carlos: oid(101),
  valeria: oid(102),
  ana: oid(103),
  jose: oid(104),
  paula: oid(105),
  luis: oid(106),
  maria: oid(107),
  diego: oid(108),
  rosa: oid(109),
};

const drivers = {
  luis: oid(201),
  maria: oid(202),
  diego: oid(203),
  rosa: oid(204),
  hector: oid(205),
  elena: oid(206),
};

const vehicles = {
  abc: oid(301),
  xyz: oid(302),
  sprinter: oid(303),
  jac: oid(304),
  isuzu: oid(305),
  foton: oid(306),
  urvan: oid(307),
  kia: oid(308),
};

const clients = {
  super: oid(401),
  farma: oid(402),
  retail: oid(403),
  tech: oid(404),
  fresh: oid(405),
  home: oid(406),
  med: oid(407),
  market: oid(408),
};

const zones = {
  norte: oid(501),
  centro: oid(502),
  sur: oid(503),
  este: oid(504),
  oeste: oid(505),
};

const routes = {
  norte1: oid(601),
  norte2: oid(602),
  centro1: oid(603),
  sur1: oid(604),
  este1: oid(605),
  oeste1: oid(606),
};

const pedidoIds = Array.from({ length: 16 }, (_, index) => oid(701 + index));
const despachoIds = Array.from({ length: 8 }, (_, index) => oid(801 + index));
const postIds = Array.from({ length: 5 }, (_, index) => oid(901 + index));

const lima = (calle, distrito, lat, lng) => ({
  calle,
  distrito,
  ciudad: "Lima",
  coordenadas: { lat, lng },
});

const stop = (orden, descripcion, lat, lng) => ({
  orden,
  descripcion,
  coordenadas: { lat, lng },
});

db.roles.insertMany([
  {
    _id: roleIds.admin,
    nombre: "Administrador",
    descripcion: "Gestion completa del TMS, IAM, reportes y configuracion",
    permisos: ["read", "write", "delete", "admin", "iam", "reports"],
    createdAt: NOW,
  },
  {
    _id: roleIds.operador,
    nombre: "Operador",
    descripcion: "Gestion operativa de clientes, rutas, pedidos, despachos e incidencias",
    permisos: ["read", "write", "dispatch", "tracking"],
    createdAt: NOW,
  },
  {
    _id: roleIds.conductor,
    nombre: "Conductor",
    descripcion: "Consulta de despachos asignados, GPS, incidencias y comunicacion interna",
    permisos: ["read", "tracking", "incident", "feed"],
    createdAt: NOW,
  },
]);

db.usuarios.insertMany([
  { _id: users.carlos, nombre: "Carlos Mendoza", email: "carlosmen@gmail.com", password_hash: PASSWORD_HASH, rol_id: roleIds.admin, activo: true, telefono: "999111222", createdAt: NOW },
  { _id: users.valeria, nombre: "Valeria Rivas", email: "vrivas@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.admin, activo: true, telefono: "999222333", createdAt: NOW },
  { _id: users.ana, nombre: "Ana Torres", email: "atorres@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.operador, activo: true, telefono: "999333444", createdAt: NOW },
  { _id: users.jose, nombre: "Jose Paredes", email: "jparedes@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.operador, activo: true, telefono: "999444555", createdAt: NOW },
  { _id: users.paula, nombre: "Paula Salazar", email: "psalazar@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.operador, activo: true, telefono: "999555111", createdAt: NOW },
  { _id: users.luis, nombre: "Luis Quispe", email: "lquispe@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.conductor, activo: true, telefono: "999555666", createdAt: NOW },
  { _id: users.maria, nombre: "Maria Huanca", email: "mhuanca@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.conductor, activo: true, telefono: "999777888", createdAt: NOW },
  { _id: users.diego, nombre: "Diego Ramos", email: "dramos@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.conductor, activo: true, telefono: "999888777", createdAt: NOW },
  { _id: users.rosa, nombre: "Rosa Medina", email: "rmedina@translogix.pe", password_hash: PASSWORD_HASH, rol_id: roleIds.conductor, activo: true, telefono: "999121212", createdAt: NOW },
]);

db.suscripciones.insertMany([
  { usuario_id: users.carlos, plan: "premium", estado: "activa", fecha_inicio: new Date("2026-06-01"), caracteristicas: ["Todos los modulos", "IAM", "Reportes avanzados", "Feed corporativo"], createdAt: NOW },
  { usuario_id: users.valeria, plan: "premium", estado: "activa", fecha_inicio: new Date("2026-06-01"), caracteristicas: ["Todos los modulos", "IAM", "Reportes avanzados", "Feed corporativo"], createdAt: NOW },
  { usuario_id: users.ana, plan: "plus", estado: "activa", fecha_inicio: new Date("2026-06-03"), caracteristicas: ["CRUD logistico", "Dashboard operativo", "Notificaciones internas"], createdAt: NOW },
  { usuario_id: users.jose, plan: "plus", estado: "activa", fecha_inicio: new Date("2026-06-03"), caracteristicas: ["CRUD logistico", "Dashboard operativo", "Notificaciones internas"], createdAt: NOW },
  { usuario_id: users.luis, plan: "plus", estado: "activa", fecha_inicio: new Date("2026-06-04"), caracteristicas: ["Despachos", "GPS", "Incidencias"], createdAt: NOW },
  { usuario_id: users.maria, plan: "premium", estado: "activa", fecha_inicio: new Date("2026-06-04"), caracteristicas: ["Despachos", "GPS", "Feed corporativo"], createdAt: NOW },
]);

db.conductores.insertMany([
  { _id: drivers.luis, usuario_id: users.luis, nombre_completo: "Luis Quispe Rojas", dni: "12345678", licencia_conducir: "Q12345678", categoria_licencia: "A-IIb", fecha_vencimiento_licencia: new Date("2026-08-15"), telefono: "999555666", estado: "en_ruta", createdAt: NOW },
  { _id: drivers.maria, usuario_id: users.maria, nombre_completo: "Maria Huanca Lopez", dni: "87654321", licencia_conducir: "Q87654321", categoria_licencia: "A-IIb", fecha_vencimiento_licencia: new Date("2027-03-10"), telefono: "999777888", estado: "disponible", createdAt: NOW },
  { _id: drivers.diego, usuario_id: users.diego, nombre_completo: "Diego Ramos Silva", dni: "45871236", licencia_conducir: "Q45871236", categoria_licencia: "A-IIIa", fecha_vencimiento_licencia: new Date("2027-11-22"), telefono: "999888777", estado: "en_ruta", createdAt: NOW },
  { _id: drivers.rosa, usuario_id: users.rosa, nombre_completo: "Rosa Medina Flores", dni: "74125896", licencia_conducir: "Q74125896", categoria_licencia: "A-IIb", fecha_vencimiento_licencia: new Date("2028-01-18"), telefono: "999121212", estado: "descanso", createdAt: NOW },
  { _id: drivers.hector, usuario_id: null, nombre_completo: "Hector Lozano Arias", dni: "65478912", licencia_conducir: "Q65478912", categoria_licencia: "A-IIIa", fecha_vencimiento_licencia: new Date("2026-12-09"), telefono: "999343434", estado: "disponible", createdAt: NOW },
  { _id: drivers.elena, usuario_id: null, nombre_completo: "Elena Castillo Vega", dni: "32165498", licencia_conducir: "Q32165498", categoria_licencia: "A-IIb", fecha_vencimiento_licencia: new Date("2027-05-30"), telefono: "999565656", estado: "disponible", createdAt: NOW },
]);

db.vehiculos.insertMany([
  { _id: vehicles.abc, placa: "ABC-123", marca: "Toyota", modelo: "Hiace", anio: 2021, tipo: "furgoneta", capacidad_kg: 1000, capacidad_m3: 6.5, estado: "operativo", kilometraje: 45280, ultimo_mantenimiento: new Date("2026-04-10"), createdAt: NOW },
  { _id: vehicles.xyz, placa: "XYZ-456", marca: "Hyundai", modelo: "H100", anio: 2020, tipo: "camion_ligero", capacidad_kg: 2000, capacidad_m3: 12.0, estado: "en_ruta", kilometraje: 72440, ultimo_mantenimiento: new Date("2026-01-15"), createdAt: NOW },
  { _id: vehicles.sprinter, placa: "TLX-101", marca: "Mercedes-Benz", modelo: "Sprinter", anio: 2023, tipo: "van", capacidad_kg: 1600, capacidad_m3: 10.5, estado: "operativo", kilometraje: 18500, ultimo_mantenimiento: new Date("2026-05-20"), createdAt: NOW },
  { _id: vehicles.jac, placa: "TLX-202", marca: "JAC", modelo: "Sunray", anio: 2022, tipo: "van", capacidad_kg: 1500, capacidad_m3: 9.8, estado: "operativo", kilometraje: 30620, ultimo_mantenimiento: new Date("2026-03-12"), createdAt: NOW },
  { _id: vehicles.isuzu, placa: "TLX-303", marca: "Isuzu", modelo: "NPR", anio: 2021, tipo: "camion", capacidad_kg: 3500, capacidad_m3: 18.0, estado: "mantenimiento", kilometraje: 88900, ultimo_mantenimiento: new Date("2026-06-14"), createdAt: NOW },
  { _id: vehicles.foton, placa: "TLX-404", marca: "Foton", modelo: "Aumark", anio: 2024, tipo: "camion_ligero", capacidad_kg: 2500, capacidad_m3: 14.0, estado: "operativo", kilometraje: 9800, ultimo_mantenimiento: new Date("2026-05-28"), createdAt: NOW },
  { _id: vehicles.urvan, placa: "TLX-505", marca: "Nissan", modelo: "Urvan", anio: 2022, tipo: "furgoneta", capacidad_kg: 1100, capacidad_m3: 7.2, estado: "en_ruta", kilometraje: 41200, ultimo_mantenimiento: new Date("2026-02-17"), createdAt: NOW },
  { _id: vehicles.kia, placa: "TLX-606", marca: "Kia", modelo: "K2700", anio: 2020, tipo: "camion_ligero", capacidad_kg: 1800, capacidad_m3: 11.0, estado: "operativo", kilometraje: 63850, ultimo_mantenimiento: new Date("2026-04-01"), createdAt: NOW },
]);

db.clientes.insertMany([
  { _id: clients.super, razon_social: "Supermercados Lima S.A.", ruc: "20123456789", contacto: "Jorge Paredes", telefono: "016001234", email: "logistica@superlimasac.pe", direccion: lima("Av. La Marina 2000", "San Miguel", -12.078, -77.083), activo: true, createdAt: NOW },
  { _id: clients.farma, razon_social: "Farmacias del Norte E.I.R.L.", ruc: "20987654321", contacto: "Rosa Sanchez", telefono: "014445566", email: "compras@farmanorte.pe", direccion: lima("Jr. Huallaga 350", "Cercado de Lima", -12.051, -77.028), activo: true, createdAt: NOW },
  { _id: clients.retail, razon_social: "Retail Andino S.A.C.", ruc: "20456789123", contacto: "Monica Aliaga", telefono: "016667788", email: "operaciones@retailandino.pe", direccion: lima("Av. Tomas Valle 1200", "Los Olivos", -12.002, -77.071), activo: true, createdAt: NOW },
  { _id: clients.tech, razon_social: "TecnoMarket Peru S.A.", ruc: "20555111222", contacto: "Gustavo Ruiz", telefono: "017778899", email: "warehouse@tecnomarket.pe", direccion: lima("Av. Javier Prado 4100", "Santiago de Surco", -12.091, -76.987), activo: true, createdAt: NOW },
  { _id: clients.fresh, razon_social: "FreshFoods Express S.A.C.", ruc: "20666111222", contacto: "Claudia Vera", telefono: "018889900", email: "distribucion@freshfoods.pe", direccion: lima("Av. Los Frutales 890", "Ate", -12.055, -76.931), activo: true, createdAt: NOW },
  { _id: clients.home, razon_social: "HomeStyle Peru S.R.L.", ruc: "20777111222", contacto: "Alonso Torres", telefono: "019990011", email: "logistica@homestyle.pe", direccion: lima("Av. Primavera 1400", "San Borja", -12.105, -76.997), activo: true, createdAt: NOW },
  { _id: clients.med, razon_social: "MedSupply Logistics S.A.C.", ruc: "20888111222", contacto: "Diana Mejia", telefono: "016543210", email: "supply@medsupply.pe", direccion: lima("Av. Guardia Civil 780", "San Isidro", -12.097, -77.024), activo: true, createdAt: NOW },
  { _id: clients.market, razon_social: "Mercado Rapido S.A.C.", ruc: "20999111222", contacto: "Pedro Rojas", telefono: "015551111", email: "ops@mercadorapido.pe", direccion: lima("Av. Argentina 3020", "Callao", -12.048, -77.102), activo: true, createdAt: NOW },
]);

db.zonas.insertMany([
  { _id: zones.norte, nombre: "Zona Norte", distritos: ["Los Olivos", "Independencia", "San Martin de Porres", "Comas"], activa: true, createdAt: NOW },
  { _id: zones.centro, nombre: "Zona Centro", distritos: ["Cercado de Lima", "Brena", "La Victoria", "Lince"], activa: true, createdAt: NOW },
  { _id: zones.sur, nombre: "Zona Sur", distritos: ["Miraflores", "San Isidro", "Barranco", "Chorrillos", "Surco"], activa: true, createdAt: NOW },
  { _id: zones.este, nombre: "Zona Este", distritos: ["San Juan de Lurigancho", "El Agustino", "Ate", "Santa Anita"], activa: true, createdAt: NOW },
  { _id: zones.oeste, nombre: "Zona Oeste", distritos: ["San Miguel", "Magdalena", "Pueblo Libre", "Callao"], activa: true, createdAt: NOW },
]);

db.rutas.insertMany([
  { _id: routes.norte1, nombre: "Norte-01 Los Olivos", zona_id: zones.norte, puntos_parada: [stop(1, "Almacen Central", -12.02, -77.05), stop(2, "Tomas Valle", -12.004, -77.064), stop(3, "Los Olivos", -11.99, -77.07)], distancia_km: 18.5, tiempo_estimado_min: 55, activa: true, createdAt: NOW },
  { _id: routes.norte2, nombre: "Norte-02 Comas", zona_id: zones.norte, puntos_parada: [stop(1, "Almacen Central", -12.02, -77.05), stop(2, "Independencia", -12.005, -77.04), stop(3, "Comas", -11.94, -77.06)], distancia_km: 28.4, tiempo_estimado_min: 82, activa: true, createdAt: NOW },
  { _id: routes.centro1, nombre: "Centro-01 Cercado", zona_id: zones.centro, puntos_parada: [stop(1, "Almacen Central", -12.02, -77.05), stop(2, "Jr. Huallaga", -12.051, -77.028), stop(3, "Av. Abancay", -12.056, -77.031)], distancia_km: 12.0, tiempo_estimado_min: 40, activa: true, createdAt: NOW },
  { _id: routes.sur1, nombre: "Sur-01 Miraflores Surco", zona_id: zones.sur, puntos_parada: [stop(1, "Almacen Central", -12.02, -77.05), stop(2, "San Isidro", -12.097, -77.024), stop(3, "Surco", -12.091, -76.987)], distancia_km: 24.7, tiempo_estimado_min: 75, activa: true, createdAt: NOW },
  { _id: routes.este1, nombre: "Este-01 Ate Santa Anita", zona_id: zones.este, puntos_parada: [stop(1, "Almacen Central", -12.02, -77.05), stop(2, "Santa Anita", -12.043, -76.971), stop(3, "Ate", -12.055, -76.931)], distancia_km: 22.2, tiempo_estimado_min: 68, activa: true, createdAt: NOW },
  { _id: routes.oeste1, nombre: "Oeste-01 San Miguel Callao", zona_id: zones.oeste, puntos_parada: [stop(1, "Almacen Central", -12.02, -77.05), stop(2, "San Miguel", -12.078, -77.083), stop(3, "Callao", -12.048, -77.102)], distancia_km: 19.8, tiempo_estimado_min: 62, activa: true, createdAt: NOW },
]);

const pedidoData = [
  ["PED-2026-0001", clients.super, "Alimentos secos para reposicion de tienda", 450, 2.8, lima("Av. La Marina 2000", "San Miguel", -12.078, -77.083), "entregado", "normal"],
  ["PED-2026-0002", clients.farma, "Medicamentos e insumos medicos", 80, 0.5, lima("Jr. Huallaga 350", "Cercado de Lima", -12.051, -77.028), "en_ruta", "alta"],
  ["PED-2026-0003", clients.retail, "Electrodomesticos menores", 620, 4.2, lima("Av. Tomas Valle 1200", "Los Olivos", -12.002, -77.071), "programado", "normal"],
  ["PED-2026-0004", clients.tech, "Laptops y accesorios", 160, 1.1, lima("Av. Javier Prado 4100", "Santiago de Surco", -12.091, -76.987), "programado", "alta"],
  ["PED-2026-0005", clients.fresh, "Productos refrigerados", 900, 6.0, lima("Av. Los Frutales 890", "Ate", -12.055, -76.931), "en_ruta", "alta"],
  ["PED-2026-0006", clients.home, "Muebles de sala", 780, 8.4, lima("Av. Primavera 1400", "San Borja", -12.105, -76.997), "pendiente", "normal"],
  ["PED-2026-0007", clients.med, "Equipos de diagnostico", 220, 2.0, lima("Av. Guardia Civil 780", "San Isidro", -12.097, -77.024), "programado", "urgente"],
  ["PED-2026-0008", clients.market, "Abarrotes para dark store", 1250, 9.5, lima("Av. Argentina 3020", "Callao", -12.048, -77.102), "pendiente", "normal"],
  ["PED-2026-0009", clients.super, "Reposicion bebidas", 1100, 7.0, lima("Av. Universitaria 1880", "San Miguel", -12.069, -77.089), "programado", "normal"],
  ["PED-2026-0010", clients.farma, "Material sanitario", 70, 0.4, lima("Av. Arequipa 3200", "San Isidro", -12.096, -77.033), "entregado", "alta"],
  ["PED-2026-0011", clients.tech, "Monitores y routers", 340, 2.7, lima("Av. Republica de Panama 5500", "Miraflores", -12.112, -77.027), "programado", "normal"],
  ["PED-2026-0012", clients.fresh, "Canastas de alimentos", 520, 4.0, lima("Av. Separadora Industrial 1500", "Ate", -12.058, -76.945), "pendiente", "normal"],
  ["PED-2026-0013", clients.home, "Decoracion hogar", 260, 3.8, lima("Av. Benavides 3900", "Surco", -12.126, -76.999), "pendiente", "baja"],
  ["PED-2026-0014", clients.retail, "Ropa de temporada", 430, 5.2, lima("Av. Alfredo Mendiola 7000", "Comas", -11.937, -77.059), "programado", "normal"],
  ["PED-2026-0015", clients.med, "Insumos clinicos", 120, 0.9, lima("Av. Pardo 600", "Miraflores", -12.119, -77.034), "programado", "urgente"],
  ["PED-2026-0016", clients.market, "Productos perecibles", 860, 6.8, lima("Av. Colonial 2500", "Callao", -12.056, -77.094), "pendiente", "alta"],
];

db.pedidos.insertMany(
  pedidoData.map((p, i) => ({
    _id: pedidoIds[i],
    codigo: p[0],
    cliente_id: p[1],
    descripcion: p[2],
    peso_kg: p[3],
    volumen_m3: p[4],
    direccion_entrega: p[5],
    fecha_solicitud: new Date(`2026-06-${String(10 + Math.floor(i / 2)).padStart(2, "0")}`),
    fecha_entrega_estimada: new Date(`2026-06-${String(12 + Math.floor(i / 2)).padStart(2, "0")}`),
    estado: p[6],
    prioridad: p[7],
    observaciones: i % 3 === 0 ? "Requiere confirmacion en recepcion" : "Entrega regular",
    createdAt: NOW,
  }))
);

function despacho(idIndex, codigo, ruta_id, vehiculo_id, conductor_id, pedidoIndexes, operador_id, salida, estimada, real, estado) {
  return {
    _id: despachoIds[idIndex],
    codigo,
    ruta_id,
    vehiculo_id,
    conductor_id,
    pedidos_ids: pedidoIndexes.map((i) => pedidoIds[i]),
    operador_id,
    fecha_salida: new Date(salida),
    fecha_llegada_estimada: new Date(estimada),
    fecha_llegada_real: real ? new Date(real) : null,
    estado,
    createdAt: NOW,
  };
}

db.despachos.insertMany([
  despacho(0, "DSP-2026-0001", routes.oeste1, vehicles.abc, drivers.luis, [0, 8], users.ana, "2026-06-12T07:00:00Z", "2026-06-12T10:00:00Z", "2026-06-12T09:45:00Z", "completado"),
  despacho(1, "DSP-2026-0002", routes.centro1, vehicles.xyz, drivers.maria, [1, 9], users.ana, "2026-06-12T08:00:00Z", "2026-06-12T10:30:00Z", null, "en_curso"),
  despacho(2, "DSP-2026-0003", routes.norte1, vehicles.sprinter, drivers.diego, [2], users.jose, "2026-06-13T07:30:00Z", "2026-06-13T11:20:00Z", null, "programado"),
  despacho(3, "DSP-2026-0004", routes.sur1, vehicles.jac, drivers.hector, [3, 6, 10], users.paula, "2026-06-13T09:00:00Z", "2026-06-13T13:30:00Z", null, "programado"),
  despacho(4, "DSP-2026-0005", routes.este1, vehicles.urvan, drivers.luis, [4, 11], users.jose, "2026-06-13T06:45:00Z", "2026-06-13T10:40:00Z", null, "en_curso"),
  despacho(5, "DSP-2026-0006", routes.sur1, vehicles.foton, drivers.elena, [5, 12], users.paula, "2026-06-15T08:20:00Z", "2026-06-15T12:10:00Z", null, "programado"),
  despacho(6, "DSP-2026-0007", routes.norte2, vehicles.kia, drivers.rosa, [13], users.ana, "2026-06-17T07:10:00Z", "2026-06-17T11:45:00Z", null, "programado"),
  despacho(7, "DSP-2026-0008", routes.oeste1, vehicles.isuzu, drivers.diego, [7, 15], users.jose, "2026-06-18T20:00:00Z", "2026-06-18T23:30:00Z", null, "pendiente"),
]);

db.seguimiento_gps.insertMany([
  [despachoIds[1], vehicles.xyz, -12.045, -77.035, 42, "2026-06-12T08:15:00Z"],
  [despachoIds[1], vehicles.xyz, -12.049, -77.030, 35, "2026-06-12T08:30:00Z"],
  [despachoIds[1], vehicles.xyz, -12.052, -77.028, 18, "2026-06-12T08:45:00Z"],
  [despachoIds[4], vehicles.urvan, -12.037, -76.988, 48, "2026-06-13T07:15:00Z"],
  [despachoIds[4], vehicles.urvan, -12.043, -76.971, 31, "2026-06-13T07:35:00Z"],
  [despachoIds[4], vehicles.urvan, -12.055, -76.931, 22, "2026-06-13T08:05:00Z"],
  [despachoIds[0], vehicles.abc, -12.063, -77.071, 38, "2026-06-12T08:00:00Z"],
  [despachoIds[0], vehicles.abc, -12.078, -77.083, 12, "2026-06-12T09:30:00Z"],
].map((g) => ({ despacho_id: g[0], vehiculo_id: g[1], coordenadas: { lat: g[2], lng: g[3] }, velocidad_kmh: g[4], timestamp: new Date(g[5]) })));

db.incidencias.insertMany([
  { despacho_id: despachoIds[0], tipo: "trafico", descripcion: "Trafico intenso en Av. Tomas Valle, retraso estimado de 20 minutos", coordenadas: { lat: -11.995, lng: -77.065 }, reportado_por: drivers.luis, estado: "resuelto", fecha_reporte: new Date("2026-06-12T08:40:00Z"), fecha_resolucion: new Date("2026-06-12T09:05:00Z"), createdAt: NOW },
  { despacho_id: despachoIds[1], tipo: "cliente_no_disponible", descripcion: "Cliente no se encontraba en recepcion, se reprograma ventana", coordenadas: { lat: -12.051, lng: -77.028 }, reportado_por: drivers.maria, estado: "abierto", fecha_reporte: new Date("2026-06-12T09:10:00Z"), fecha_resolucion: null, createdAt: NOW },
  { despacho_id: despachoIds[4], tipo: "temperatura", descripcion: "Alerta de temperatura en carga refrigerada, se estabilizo el compartimento", coordenadas: { lat: -12.043, lng: -76.971 }, reportado_por: drivers.luis, estado: "resuelto", fecha_reporte: new Date("2026-06-13T07:40:00Z"), fecha_resolucion: new Date("2026-06-13T07:50:00Z"), createdAt: NOW },
  { despacho_id: despachoIds[2], tipo: "documentacion", descripcion: "Guia pendiente de validacion por el cliente", coordenadas: { lat: -12.002, lng: -77.071 }, reportado_por: drivers.diego, estado: "abierto", fecha_reporte: new Date("2026-06-13T10:20:00Z"), fecha_resolucion: null, createdAt: NOW },
  { despacho_id: despachoIds[7], tipo: "vehiculo", descripcion: "Unidad asignada se encuentra en mantenimiento, requiere reasignacion", coordenadas: { lat: -12.02, lng: -77.05 }, reportado_por: users.jose, estado: "abierto", fecha_reporte: new Date("2026-06-16T18:00:00Z"), fecha_resolucion: null, createdAt: NOW },
]);

db.mantenimientos.insertMany([
  [vehicles.abc, "preventivo", "Cambio de aceite, filtros y revision de frenos", 350, "Taller Automotriz Rimac", "2026-04-10", "2026-04-10", 44800, 50000],
  [vehicles.xyz, "correctivo", "Reparacion de sistema de frenos traseros", 780, "Servicio Tecnico Hyundai Lima", "2026-01-14", "2026-01-15", 71500, 77000],
  [vehicles.sprinter, "preventivo", "Revision electrica y alineamiento", 420, "Sprinter Service Peru", "2026-05-20", "2026-05-20", 18000, 24000],
  [vehicles.isuzu, "correctivo", "Cambio de embrague y diagnostico de caja", 2200, "Isuzu Fleet Center", "2026-06-14", null, 88900, 93000],
  [vehicles.foton, "preventivo", "Revision de suspension", 510, "Aumark Service Lima", "2026-05-28", "2026-05-28", 9500, 15000],
  [vehicles.kia, "preventivo", "Cambio de neumaticos delanteros", 980, "Kia Camiones Peru", "2026-04-01", "2026-04-02", 63000, 70000],
].map((m) => ({ vehiculo_id: m[0], tipo: m[1], descripcion: m[2], costo_soles: m[3], taller: m[4], fecha_entrada: new Date(m[5]), fecha_salida: m[6] ? new Date(m[6]) : null, km_al_mantenimiento: m[7], proximo_mantenimiento_km: m[8], createdAt: NOW })));

db.reportes.insertMany([
  { tipo: "diario", fecha: new Date("2026-06-12"), generado_por: users.carlos, resumen: { total_despachos: 2, despachos_completados: 1, despachos_en_curso: 1, pedidos_entregados: 3, pedidos_fallidos: 0, km_recorridos_total: 38.3, incidencias_reportadas: 2 }, createdAt: NOW },
  { tipo: "semanal", fecha: new Date("2026-06-16"), generado_por: users.valeria, resumen: { total_despachos: 8, despachos_programados: 5, despachos_en_curso: 2, despachos_completados: 1, pedidos_totales: 16, cumplimiento_ontime_pct: 92.4, incidencias_abiertas: 3 }, createdAt: NOW },
  { tipo: "mantenimiento", fecha: new Date("2026-06-16"), generado_por: users.carlos, resumen: { vehiculos_operativos: 5, vehiculos_en_ruta: 2, vehiculos_mantenimiento: 1, costo_mantenimiento_mes: 5240, alertas_proximo_mantenimiento: 3 }, createdAt: NOW },
]);

db.notificaciones.insertMany([
  [users.ana, "incidencia", "Nueva incidencia de trafico reportada en Despacho DSP-2026-0001", despachoIds[0], "despacho", true],
  [users.carlos, "alerta_mantenimiento", "Vehiculo TLX-303 se encuentra en mantenimiento correctivo", vehicles.isuzu, "vehiculo", false],
  [users.jose, "despacho", "Despacho DSP-2026-0005 inicio recorrido Este-01", despachoIds[4], "despacho", false],
  [users.luis, "ruta", "Ruta Este-01 asignada con carga refrigerada", routes.este1, "ruta", true],
  [users.maria, "cliente", "Cliente Farmacias del Norte solicito reprogramacion", clients.farma, "cliente", false],
  [users.paula, "pedido", "Pedido PED-2026-0007 marcado como urgente", pedidoIds[6], "pedido", false],
  [users.diego, "documentacion", "Validar guia pendiente de Retail Andino", pedidoIds[2], "pedido", false],
  [users.valeria, "reporte", "Reporte semanal listo para revision", null, "reporte", false],
].map((n, i) => ({ usuario_id: n[0], tipo: n[1], mensaje: n[2], referencia_id: n[3], referencia_tipo: n[4], leida: n[5], createdAt: new Date(`2026-06-${String(12 + i).padStart(2, "0")}T08:30:00Z`) })));

db.publicaciones_feed.insertMany([
  { _id: postIds[0], autor_id: drivers.luis, referencia_despacho: despachoIds[0], tipo_publicacion: "incidencia_multimedia", contenido: "Trafico detenido en Tomas Valle. Estoy desviando por via alterna indicada por operaciones.", multimedia: [{ tipo: "imagen", url: "https://translogix.local/media/trafico_tomas_valle.jpg", size_mb: 2.4 }], reacciones: [{ emoji: "alerta", cantidad: 3 }, { emoji: "visto", cantidad: 5 }], estado: "publicado", createdAt: new Date("2026-06-12T08:42:00Z") },
  { _id: postIds[1], autor_id: drivers.maria, referencia_despacho: despachoIds[1], tipo_publicacion: "reprogramacion", contenido: "Cliente no disponible en recepcion. Operaciones ya coordina nueva ventana de entrega.", multimedia: [], reacciones: [{ emoji: "ok", cantidad: 4 }], estado: "publicado", createdAt: new Date("2026-06-12T09:15:00Z") },
  { _id: postIds[2], autor_id: users.ana, referencia_despacho: despachoIds[4], tipo_publicacion: "operacion", contenido: "Despacho refrigerado en ruta. Monitorear temperatura cada 20 minutos.", multimedia: [], reacciones: [{ emoji: "seguimiento", cantidad: 2 }], estado: "publicado", createdAt: new Date("2026-06-13T07:00:00Z") },
  { _id: postIds[3], autor_id: drivers.diego, referencia_despacho: despachoIds[2], tipo_publicacion: "documentacion", contenido: "Guia fisica pendiente de firma. Cliente solicita validacion por correo.", multimedia: [{ tipo: "imagen", url: "https://translogix.local/media/guia_pendiente.jpg", size_mb: 1.1 }], reacciones: [{ emoji: "revision", cantidad: 2 }], estado: "publicado", createdAt: new Date("2026-06-13T10:22:00Z") },
  { _id: postIds[4], autor_id: users.valeria, referencia_despacho: null, tipo_publicacion: "comunicado", contenido: "Recordatorio: todos los conductores deben confirmar inicio y cierre de ruta desde la app.", multimedia: [], reacciones: [{ emoji: "ok", cantidad: 8 }], estado: "publicado", createdAt: new Date("2026-06-16T08:00:00Z") },
]);

db.comentarios.insertMany([
  [postIds[0], users.ana, "Copiado Luis. Se aviso al cliente sobre el retraso."],
  [postIds[0], drivers.maria, "Gracias por el aviso, evitare esa via."],
  [postIds[1], users.jose, "Estoy coordinando nueva ventana con Farmacias del Norte."],
  [postIds[2], drivers.luis, "Temperatura estabilizada en 4 grados."],
  [postIds[2], users.carlos, "Registrar evidencia al cierre de despacho."],
  [postIds[3], users.paula, "Enviaremos validacion digital al cliente."],
  [postIds[4], drivers.diego, "Confirmado, se usara check-in y check-out."],
  [postIds[4], drivers.rosa, "Recibido."],
].map((c, i) => ({ publicacion_id: c[0], autor_id: c[1], texto: c[2], createdAt: new Date(`2026-06-16T08:${String(10 + i).padStart(2, "0")}:00Z`) })));

db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ rol_id: 1 });
db.suscripciones.createIndex({ usuario_id: 1 }, { unique: true });
db.suscripciones.createIndex({ plan: 1, estado: 1 });
db.conductores.createIndex({ dni: 1 }, { unique: true });
db.vehiculos.createIndex({ placa: 1 }, { unique: true });
db.clientes.createIndex({ ruc: 1 }, { unique: true });
db.pedidos.createIndex({ codigo: 1 }, { unique: true });
db.pedidos.createIndex({ estado: 1, prioridad: 1 });
db.despachos.createIndex({ codigo: 1 }, { unique: true });
db.despachos.createIndex({ estado: 1, fecha_salida: -1 });
db.seguimiento_gps.createIndex({ despacho_id: 1, timestamp: -1 });
db.incidencias.createIndex({ despacho_id: 1, estado: 1 });
db.mantenimientos.createIndex({ vehiculo_id: 1, fecha_entrada: -1 });
db.notificaciones.createIndex({ usuario_id: 1, leida: 1 });
db.publicaciones_feed.createIndex({ autor_id: 1, createdAt: -1 });
db.publicaciones_feed.createIndex({ referencia_despacho: 1 });
db.comentarios.createIndex({ publicacion_id: 1, createdAt: 1 });

print("Translogix TMS seed cargado: IAM, suscripciones, operacion logistica, monitoreo, reportes y feed.");
print("Usuarios con password de desarrollo: Translogix2026!");
print("Colecciones creadas: " + collections.length);
