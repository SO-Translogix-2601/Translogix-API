db = db.getSiblingDB("translogix_db");
const ID = {
  // Roles
  ROL_ADMIN: "aaaaaaaaaaaaaaaaaaaaaaaa",
  ROL_OPERADOR: "bbbbbbbbbbbbbbbbbbbbbbbb",
  ROL_CONDUCTOR: "cccccccccccccccccccccccc",
  // Usuarios
  USR_CARLOS: "dddddddddddddddddddddddd",
  USR_ANA: "eeeeeeeeeeeeeeeeeeeeeeee",
  USR_LUIS: "ffffffffffffffffffffffff",
  // Conductores
  CON_LUIS: "111111111111111111111111",
  CON_MARIA: "222222222222222222222222",
  // Vehículos
  VEH_ABC: "333333333333333333333333",
  VEH_XYZ: "444444444444444444444444",
  // Clientes
  CLI_SUPER: "555555555555555555555555",
  CLI_FARMA: "666666666666666666666666",
  // Zonas
  ZONA_NORTE: "777777777777777777777777",
  ZONA_CENTRO: "888888888888888888888888",
  ZONA_SUR: "999999999999999999999999",
  ZONA_ESTE: "aaaaaaaaaaaaaaaaaaaaaaab",
  // Rutas
  RUTA_NORTE: "aaaaaaaaaaaaaaaaaaaaaaac",
  RUTA_CENTRO: "aaaaaaaaaaaaaaaaaaaaaaad",
  // Pedidos
  PED_001: "aaaaaaaaaaaaaaaaaaaaaaae",
  PED_002: "aaaaaaaaaaaaaaaaaaaaaaaf",
  // Despachos
  DSP_001: "aaaaaaaaaaaaaaaaaaaaaab1",
  DSP_002: "aaaaaaaaaaaaaaaaaaaaaab2",
};

function oid(hex) {
  return ObjectId(hex);
}
db.roles.drop();
db.roles.insertMany([
  {
    _id: oid(ID.ROL_ADMIN),
    nombre: "Administrador",
    descripcion: "Acceso total al sistema",
    permisos: ["read", "write", "delete", "admin"],
    createdAt: new Date(),
  },
  {
    _id: oid(ID.ROL_OPERADOR),
    nombre: "Operador",
    descripcion: "Gestión de rutas y despachos",
    permisos: ["read", "write"],
    createdAt: new Date(),
  },
  {
    _id: oid(ID.ROL_CONDUCTOR),
    nombre: "Conductor",
    descripcion: "Visualización de rutas asignadas",
    permisos: ["read"],
    createdAt: new Date(),
  },
]);
db.usuarios.drop();
db.usuarios.insertMany([
  {
    _id: oid(ID.USR_CARLOS),
    nombre: "Carlos Mendoza",
    email: "cmendoza@translogix.pe",
    password_hash: "$2b$10$hash1",
    rol_id: oid(ID.ROL_ADMIN),
    activo: true,
    telefono: "999111222",
    createdAt: new Date(),
  },
  {
    _id: oid(ID.USR_ANA),
    nombre: "Ana Torres",
    email: "atorres@translogix.pe",
    password_hash: "$2b$10$hash2",
    rol_id: oid(ID.ROL_OPERADOR),
    activo: true,
    telefono: "999333444",
    createdAt: new Date(),
  },
  {
    _id: oid(ID.USR_LUIS),
    nombre: "Luis Quispe",
    email: "lquispe@translogix.pe",
    password_hash: "$2b$10$hash3",
    rol_id: oid(ID.ROL_CONDUCTOR),
    activo: true,
    telefono: "999555666",
    createdAt: new Date(),
  },
]);
db.conductores.drop();
db.conductores.insertMany([
  {
    _id: oid(ID.CON_LUIS),
    usuario_id: oid(ID.USR_LUIS),
    nombre_completo: "Luis Quispe Rojas",
    dni: "12345678",
    licencia_conducir: "Q12345678",
    categoria_licencia: "A-IIb",
    fecha_vencimiento_licencia: new Date("2026-08-15"),
    telefono: "999555666",
    estado: "disponible",
    createdAt: new Date(),
  },
  {
    _id: oid(ID.CON_MARIA),
    usuario_id: null,
    nombre_completo: "María Huanca López",
    dni: "87654321",
    licencia_conducir: "Q87654321",
    categoria_licencia: "A-IIb",
    fecha_vencimiento_licencia: new Date("2027-03-10"),
    telefono: "999777888",
    estado: "disponible",
    createdAt: new Date(),
  },
]);
db.vehiculos.drop();
db.vehiculos.insertMany([
  {
    _id: oid(ID.VEH_ABC),
    placa: "ABC-123",
    marca: "Toyota",
    modelo: "Hiace",
    anio: 2021,
    tipo: "furgoneta",
    capacidad_kg: 1000,
    capacidad_m3: 6.5,
    estado: "operativo",
    kilometraje: 45000,
    ultimo_mantenimiento: new Date("2025-12-01"),
    createdAt: new Date(),
  },
  {
    _id: oid(ID.VEH_XYZ),
    placa: "XYZ-456",
    marca: "Hyundai",
    modelo: "H100",
    anio: 2020,
    tipo: "camion_ligero",
    capacidad_kg: 2000,
    capacidad_m3: 12.0,
    estado: "operativo",
    kilometraje: 72000,
    ultimo_mantenimiento: new Date("2026-01-15"),
    createdAt: new Date(),
  },
]);
db.clientes.drop();
db.clientes.insertMany([
  {
    _id: oid(ID.CLI_SUPER),
    razon_social: "Supermercados Lima S.A.",
    ruc: "20123456789",
    contacto: "Jorge Paredes",
    telefono: "016001234",
    email: "logistica@superlimasac.pe",
    direccion: {
      calle: "Av. La Marina 2000",
      distrito: "San Miguel",
      ciudad: "Lima",
      coordenadas: { lat: -12.078, lng: -77.083 },
    },
    activo: true,
    createdAt: new Date(),
  },
  {
    _id: oid(ID.CLI_FARMA),
    razon_social: "Farmacias del Norte E.I.R.L.",
    ruc: "20987654321",
    contacto: "Rosa Sánchez",
    telefono: "014445566",
    email: "compras@farmanorte.pe",
    direccion: {
      calle: "Jr. Huallaga 350",
      distrito: "Cercado de Lima",
      ciudad: "Lima",
      coordenadas: { lat: -12.051, lng: -77.028 },
    },
    activo: true,
    createdAt: new Date(),
  },
]);
db.zonas.drop();
db.zonas.insertMany([
  {
    _id: oid(ID.ZONA_NORTE),
    nombre: "Zona Norte",
    distritos: ["Los Olivos", "Independencia", "San Martín de Porres"],
    activa: true,
  },
  {
    _id: oid(ID.ZONA_CENTRO),
    nombre: "Zona Centro",
    distritos: ["Cercado de Lima", "Breña", "La Victoria"],
    activa: true,
  },
  {
    _id: oid(ID.ZONA_SUR),
    nombre: "Zona Sur",
    distritos: ["Miraflores", "San Isidro", "Barranco", "Chorrillos"],
    activa: true,
  },
  {
    _id: oid(ID.ZONA_ESTE),
    nombre: "Zona Este",
    distritos: ["San Juan de Lurigancho", "El Agustino", "Ate"],
    activa: true,
  },
]);
db.rutas.drop();
db.rutas.insertMany([
  {
    _id: oid(ID.RUTA_NORTE),
    nombre: "Ruta Norte-01",
    zona_id: oid(ID.ZONA_NORTE),
    puntos_parada: [
      {
        orden: 1,
        descripcion: "Almacén Central",
        coordenadas: { lat: -12.02, lng: -77.05 },
      },
      {
        orden: 2,
        descripcion: "Los Olivos - Punto A",
        coordenadas: { lat: -11.99, lng: -77.07 },
      },
      {
        orden: 3,
        descripcion: "Independencia - Punto B",
        coordenadas: { lat: -12.005, lng: -77.04 },
      },
    ],
    distancia_km: 18.5,
    tiempo_estimado_min: 55,
    activa: true,
    createdAt: new Date(),
  },
  {
    _id: oid(ID.RUTA_CENTRO),
    nombre: "Ruta Centro-01",
    zona_id: oid(ID.ZONA_CENTRO),
    puntos_parada: [
      {
        orden: 1,
        descripcion: "Almacén Central",
        coordenadas: { lat: -12.02, lng: -77.05 },
      },
      {
        orden: 2,
        descripcion: "Jr. Huallaga",
        coordenadas: { lat: -12.051, lng: -77.028 },
      },
      {
        orden: 3,
        descripcion: "Av. Abancay",
        coordenadas: { lat: -12.056, lng: -77.031 },
      },
    ],
    distancia_km: 12.0,
    tiempo_estimado_min: 40,
    activa: true,
    createdAt: new Date(),
  },
]);

db.pedidos.drop();
db.pedidos.insertMany([
  {
    _id: oid(ID.PED_001),
    codigo: "PED-2026-0001",
    cliente_id: oid(ID.CLI_SUPER),
    descripcion: "Carga de productos alimenticios",
    peso_kg: 450,
    volumen_m3: 2.8,
    direccion_entrega: {
      calle: "Av. La Marina 2000",
      distrito: "San Miguel",
      coordenadas: { lat: -12.078, lng: -77.083 },
    },
    fecha_solicitud: new Date("2026-06-10"),
    fecha_entrega_estimada: new Date("2026-06-12"),
    estado: "entregado",
    prioridad: "normal",
    observaciones: "Entregar en horario de 8am-12pm",
    createdAt: new Date(),
  },
  {
    _id: oid(ID.PED_002),
    codigo: "PED-2026-0002",
    cliente_id: oid(ID.CLI_FARMA),
    descripcion: "Medicamentos e insumos médicos",
    peso_kg: 80,
    volumen_m3: 0.5,
    direccion_entrega: {
      calle: "Jr. Huallaga 350",
      distrito: "Cercado de Lima",
      coordenadas: { lat: -12.051, lng: -77.028 },
    },
    fecha_solicitud: new Date("2026-06-11"),
    fecha_entrega_estimada: new Date("2026-06-12"),
    estado: "en_ruta",
    prioridad: "alta",
    observaciones: "Frágil, requiere cuidado",
    createdAt: new Date(),
  },
]);
db.despachos.drop();
db.despachos.insertMany([
  {
    _id: oid(ID.DSP_001),
    codigo: "DSP-2026-0001",
    ruta_id: oid(ID.RUTA_NORTE),
    vehiculo_id: oid(ID.VEH_ABC),
    conductor_id: oid(ID.CON_LUIS),
    pedidos_ids: [oid(ID.PED_001)],
    operador_id: oid(ID.USR_ANA),
    fecha_salida: new Date("2026-06-12T07:00:00Z"),
    fecha_llegada_estimada: new Date("2026-06-12T10:00:00Z"),
    fecha_llegada_real: new Date("2026-06-12T09:45:00Z"),
    estado: "completado",
    createdAt: new Date(),
  },
  {
    _id: oid(ID.DSP_002),
    codigo: "DSP-2026-0002",
    ruta_id: oid(ID.RUTA_CENTRO),
    vehiculo_id: oid(ID.VEH_XYZ),
    conductor_id: oid(ID.CON_MARIA),
    pedidos_ids: [oid(ID.PED_002)],
    operador_id: oid(ID.USR_ANA),
    fecha_salida: new Date("2026-06-12T08:00:00Z"),
    fecha_llegada_estimada: new Date("2026-06-12T10:30:00Z"),
    fecha_llegada_real: null,
    estado: "en_curso",
    createdAt: new Date(),
  },
]);
db.seguimiento_gps.drop();
db.seguimiento_gps.insertMany([
  {
    despacho_id: oid(ID.DSP_002),
    vehiculo_id: oid(ID.VEH_XYZ),
    coordenadas: { lat: -12.045, lng: -77.035 },
    velocidad_kmh: 42,
    timestamp: new Date("2026-06-12T08:15:00Z"),
  },
  {
    despacho_id: oid(ID.DSP_002),
    vehiculo_id: oid(ID.VEH_XYZ),
    coordenadas: { lat: -12.049, lng: -77.03 },
    velocidad_kmh: 35,
    timestamp: new Date("2026-06-12T08:30:00Z"),
  },
]);
db.incidencias.drop();
db.incidencias.insertMany([
  {
    despacho_id: oid(ID.DSP_001),
    tipo: "trafico",
    descripcion: "Tráfico intenso en Av. Tomás Valle, retraso de 20 minutos",
    coordenadas: { lat: -11.995, lng: -77.065 },
    reportado_por: oid(ID.CON_LUIS),
    estado: "resuelto",
    fecha_reporte: new Date("2026-06-12T08:40:00Z"),
    fecha_resolucion: new Date("2026-06-12T09:05:00Z"),
    createdAt: new Date(),
  },
]);
db.mantenimientos.drop();
db.mantenimientos.insertMany([
  {
    vehiculo_id: oid(ID.VEH_ABC),
    tipo: "preventivo",
    descripcion: "Cambio de aceite, filtros y revisión de frenos",
    costo_soles: 350.0,
    taller: "Taller Automotriz Rímac",
    fecha_entrada: new Date("2025-12-01"),
    fecha_salida: new Date("2025-12-01"),
    km_al_mantenimiento: 44800,
    proximo_mantenimiento_km: 50000,
    createdAt: new Date(),
  },
  {
    vehiculo_id: oid(ID.VEH_XYZ),
    tipo: "correctivo",
    descripcion: "Reparación de sistema de frenos traseros",
    costo_soles: 780.0,
    taller: "Servicio Técnico Hyundai Lima",
    fecha_entrada: new Date("2026-01-14"),
    fecha_salida: new Date("2026-01-15"),
    km_al_mantenimiento: 71500,
    proximo_mantenimiento_km: 77000,
    createdAt: new Date(),
  },
]);
db.reportes.drop();
db.reportes.insertMany([
  {
    tipo: "diario",
    fecha: new Date("2026-06-12"),
    generado_por: oid(ID.USR_CARLOS),
    resumen: {
      total_despachos: 2,
      despachos_completados: 1,
      despachos_en_curso: 1,
      pedidos_entregados: 1,
      pedidos_fallidos: 0,
      km_recorridos_total: 18.5,
      incidencias_reportadas: 1,
    },
    createdAt: new Date(),
  },
]);
db.notificaciones.drop();
db.notificaciones.insertMany([
  {
    usuario_id: oid(ID.USR_ANA),
    tipo: "incidencia",
    mensaje: "Nueva incidencia de tráfico reportada en Despacho DSP-2026-0001",
    referencia_id: oid(ID.DSP_001),
    referencia_tipo: "despacho",
    leida: true,
    createdAt: new Date("2026-06-12T08:41:00Z"),
  },
  {
    usuario_id: oid(ID.USR_CARLOS),
    tipo: "alerta_mantenimiento",
    mensaje:
      "Vehículo XYZ-456 se acerca al límite de mantenimiento (77,000 km)",
    referencia_id: oid(ID.VEH_XYZ),
    referencia_tipo: "vehiculo",
    leida: false,
    createdAt: new Date("2026-06-12T06:00:00Z"),
  },
]);
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.conductores.createIndex({ dni: 1 }, { unique: true });
db.vehiculos.createIndex({ placa: 1 }, { unique: true });
db.pedidos.createIndex({ codigo: 1 }, { unique: true });
db.pedidos.createIndex({ estado: 1 });
db.despachos.createIndex({ codigo: 1 }, { unique: true });
db.despachos.createIndex({ estado: 1 });
db.despachos.createIndex({ fecha_salida: -1 });
db.seguimiento_gps.createIndex({ despacho_id: 1, timestamp: -1 });
db.incidencias.createIndex({ despacho_id: 1 });
db.notificaciones.createIndex({ usuario_id: 1, leida: 1 });

print("Translogix TMS — 14 colecciones creadas con datos de ejemplo.");


// =========================================================================
// MÓDULO DE RED SOCIAL CORPORATIVA (FEED, MULTIMEDIA Y COMENTARIOS)
// =========================================================================

db.publicaciones_feed.drop();
db.publicaciones_feed.insertMany([
  {
    _id: oid("feeeed000000000000000001"), 
    autor_id: oid(ID.CON_LUIS), // Luis Quispe (Conductor)
    referencia_despacho: oid(ID.DSP_001),
    tipo_publicacion: "incidencia_multimedia",
    contenido: "Acabo de pasar por la Av. Tomás Valle. El tráfico está completamente detenido por un choque. Adjunto video de la situación.",
    multimedia: [
      { tipo: "video", url: "https://translogix.blob.core.windows.net/media/video_trafico_001.mp4", size_mb: 14.5 }
    ],
    reacciones: [
      { emoji: "⚠️", cantidad: 3 },
      { emoji: "👀", cantidad: 1 },
      { emoji: "🤬", cantidad: 2 }
    ],
    estado: "publicado",
    createdAt: new Date("2026-06-12T08:42:00Z")
  },
  {
     _id: oid("feeeed000000000000000002"),
    autor_id: oid(ID.CON_MARIA), // María Huanca (Conductora)
    referencia_despacho: oid(ID.DSP_002),
    tipo_publicacion: "conformidad_entrega",
    contenido: "Carga entregada exitosamente en Farmacias del Norte. El cliente verificó el lote. Todo conforme.",
    multimedia: [
      { tipo: "imagen", url: "https://translogix.blob.core.windows.net/media/foto_guia_002.jpg", size_mb: 2.1 },
      { tipo: "audio", url: "https://translogix.blob.core.windows.net/media/nota_voz_cliente.ogg", size_mb: 1.2 }
    ],
    reacciones: [
      { emoji: "👍", cantidad: 4 },
      { emoji: "🎉", cantidad: 2 },
      { emoji: "💪", cantidad: 1 }
    ],
    estado: "publicado",
    createdAt: new Date("2026-06-12T10:35:00Z")
  }
]);

db.comentarios.drop();
db.comentarios.insertMany([
  {
    _id: oid("c00000000000000000000001"), // Corregido: c000 es hexadecimal válido
    publicacion_id: oid("feeeed000000000000000001"),
    autor_id: oid(ID.USR_ANA), // Ana Torres (Operadora responde al conductor)
    texto: "Copiado Luis. Estamos notificando al cliente sobre el retraso y alertando a los demás conductores para que eviten la zona.",
    createdAt: new Date("2026-06-12T08:45:00Z")
  },
  {
    _id: oid("c00000000000000000000002"),
    publicacion_id: oid("feeeed000000000000000001"),
    autor_id: oid(ID.CON_MARIA), // Otra conductora comenta
    texto: "Gracias por el aviso Luis, justo iba a tomar esa ruta. Me desvío por la Panamericana.",
    createdAt: new Date("2026-06-12T08:47:00Z")
  }
]);

// Índices para optimizar las consultas del Feed estilo Red Social
db.publicaciones_feed.createIndex({ autor_id: 1, createdAt: -1 });
db.publicaciones_feed.createIndex({ referencia_despacho: 1 });
db.comentarios.createIndex({ publicacion_id: 1, createdAt: 1 });

print("Módulo de Red Social Interna: Feed, comentarios y multimedia inicializados.");