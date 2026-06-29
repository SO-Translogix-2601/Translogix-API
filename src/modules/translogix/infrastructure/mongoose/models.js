import mongoose from "mongoose";

// Se extraen helpers de Mongoose para definir schemas y modelos.
const { Schema, model } = mongoose;
// Helper reutilizable para referencias entre colecciones.
const objectId = { type: Schema.Types.ObjectId };
// Configuracion comun para guardar createdAt/updatedAt y ocultar __v.
const timestamps = { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, versionKey: false };

// Subdocumento reutilizable para guardar ubicaciones geograficas.
const coordenadasSchema = new Schema(
  { lat: Number, lng: Number },
  { _id: false, versionKey: false }
);

// Subdocumento reutilizable para direcciones de clientes y pedidos.
const direccionSchema = new Schema(
  {
    calle: String,
    distrito: String,
    ciudad: String,
    coordenadas: coordenadasSchema,
  },
  { _id: false, versionKey: false }
);

// Subdocumento para archivos asociados a publicaciones del feed.
const multimediaSchema = new Schema(
  { tipo: String, url: String, size_mb: Number },
  { _id: false, versionKey: false }
);

// Subdocumento para contar reacciones dentro de una publicacion.
const reaccionSchema = new Schema(
  { emoji: String, cantidad: Number },
  { _id: false, versionKey: false }
);

// Coleccion roles: define permisos y perfiles de usuario.
export const Role = model(
  "Role",
  new Schema(
    {
      nombre: { type: String, required: true },
      descripcion: String,
      permisos: [String],
    },
    timestamps
  ),
  "roles"
);

// Coleccion usuarios: almacena cuentas del sistema y su rol asociado.
export const Usuario = model(
  "Usuario",
  new Schema(
    {
      nombre: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password_hash: { type: String, required: true },
      rol_id: { ...objectId, ref: "Role" },
      activo: { type: Boolean, default: true },
      telefono: String,
    },
    timestamps
  ),
  "usuarios"
);

// Coleccion conductores: datos operativos de choferes y licencias.
export const Conductor = model(
  "Conductor",
  new Schema(
    {
      usuario_id: { ...objectId, ref: "Usuario", default: null },
      nombre_completo: { type: String, required: true },
      dni: { type: String, required: true, unique: true },
      licencia_conducir: String,
      categoria_licencia: String,
      fecha_vencimiento_licencia: Date,
      telefono: String,
      estado: { type: String, default: "disponible" },
    },
    timestamps
  ),
  "conductores"
);

// Coleccion vehiculos: registra flota, capacidad, estado y mantenimiento.
export const Vehiculo = model(
  "Vehiculo",
  new Schema(
    {
      placa: { type: String, required: true, unique: true },
      marca: String,
      modelo: String,
      anio: Number,
      tipo: String,
      capacidad_kg: Number,
      capacidad_m3: Number,
      estado: { type: String, default: "operativo" },
      kilometraje: Number,
      ultimo_mantenimiento: Date,
    },
    timestamps
  ),
  "vehiculos"
);

// Coleccion clientes: empresas o personas que solicitan entregas.
export const Cliente = model(
  "Cliente",
  new Schema(
    {
      razon_social: { type: String, required: true },
      ruc: { type: String, required: true, unique: true },
      contacto: String,
      telefono: String,
      email: String,
      direccion: direccionSchema,
      activo: { type: Boolean, default: true },
    },
    timestamps
  ),
  "clientes"
);

// Coleccion zonas: agrupa distritos de reparto.
export const Zona = model(
  "Zona",
  new Schema(
    {
      nombre: { type: String, required: true },
      distritos: [String],
      activa: { type: Boolean, default: true },
    },
    timestamps
  ),
  "zonas"
);

// Coleccion rutas: define recorridos, zona asociada y puntos de parada.
export const Ruta = model(
  "Ruta",
  new Schema(
    {
      nombre: { type: String, required: true },
      zona_id: { ...objectId, ref: "Zona" },
      puntos_parada: [
        new Schema(
          { orden: Number, descripcion: String, coordenadas: coordenadasSchema },
          { _id: false, versionKey: false }
        ),
      ],
      distancia_km: Number,
      tiempo_estimado_min: Number,
      activa: { type: Boolean, default: true },
    },
    timestamps
  ),
  "rutas"
);

// Coleccion pedidos: solicitudes de entrega de clientes.
export const Pedido = model(
  "Pedido",
  new Schema(
    {
      codigo: { type: String, required: true, unique: true },
      cliente_id: { ...objectId, ref: "Cliente" },
      descripcion: String,
      peso_kg: Number,
      volumen_m3: Number,
      direccion_entrega: direccionSchema,
      fecha_solicitud: Date,
      fecha_entrega_estimada: Date,
      estado: String,
      prioridad: String,
      observaciones: String,
    },
    timestamps
  ),
  "pedidos"
);

// Coleccion despachos: asigna ruta, vehiculo, conductor y pedidos.
export const Despacho = model(
  "Despacho",
  new Schema(
    {
      codigo: { type: String, required: true, unique: true },
      ruta_id: { ...objectId, ref: "Ruta" },
      vehiculo_id: { ...objectId, ref: "Vehiculo" },
      conductor_id: { ...objectId, ref: "Conductor" },
      pedidos_ids: [{ ...objectId, ref: "Pedido" }],
      operador_id: { ...objectId, ref: "Usuario" },
      fecha_salida: Date,
      fecha_llegada_estimada: Date,
      fecha_llegada_real: Date,
      estado: String,
    },
    timestamps
  ),
  "despachos"
);

// Coleccion seguimiento_gps: guarda posiciones de vehiculos/despachos.
export const SeguimientoGps = model(
  "SeguimientoGps",
  new Schema(
    {
      despacho_id: { ...objectId, ref: "Despacho" },
      vehiculo_id: { ...objectId, ref: "Vehiculo" },
      coordenadas: coordenadasSchema,
      velocidad_kmh: Number,
      timestamp: Date,
    },
    { versionKey: false }
  ),
  "seguimiento_gps"
);

// Coleccion incidencias: registra problemas ocurridos durante un despacho.
export const Incidencia = model(
  "Incidencia",
  new Schema(
    {
      despacho_id: { ...objectId, ref: "Despacho" },
      tipo: String,
      descripcion: String,
      coordenadas: coordenadasSchema,
      reportado_por: objectId,
      estado: String,
      fecha_reporte: Date,
      fecha_resolucion: Date,
    },
    timestamps
  ),
  "incidencias"
);

// Coleccion mantenimientos: historial de servicios de vehiculos.
export const Mantenimiento = model(
  "Mantenimiento",
  new Schema(
    {
      vehiculo_id: { ...objectId, ref: "Vehiculo" },
      tipo: String,
      descripcion: String,
      costo_soles: Number,
      taller: String,
      fecha_entrada: Date,
      fecha_salida: Date,
      km_al_mantenimiento: Number,
      proximo_mantenimiento_km: Number,
    },
    timestamps
  ),
  "mantenimientos"
);

// Coleccion reportes: almacena resumenes generados por usuarios.
export const Reporte = model(
  "Reporte",
  new Schema(
    {
      tipo: String,
      fecha: Date,
      generado_por: { ...objectId, ref: "Usuario" },
      resumen: Schema.Types.Mixed,
    },
    timestamps
  ),
  "reportes"
);

// Coleccion notificaciones: mensajes pendientes o leidos para usuarios.
export const Notificacion = model(
  "Notificacion",
  new Schema(
    {
      usuario_id: { ...objectId, ref: "Usuario" },
      tipo: String,
      mensaje: String,
      referencia_id: objectId,
      referencia_tipo: String,
      leida: { type: Boolean, default: false },
    },
    timestamps
  ),
  "notificaciones"
);

// Coleccion publicaciones_feed: contenido social/operativo del sistema.
export const PublicacionFeed = model(
  "PublicacionFeed",
  new Schema(
    {
      autor_id: objectId,
      referencia_despacho: { ...objectId, ref: "Despacho" },
      tipo_publicacion: String,
      contenido: String,
      multimedia: [multimediaSchema],
      reacciones: [reaccionSchema],
      estado: String,
    },
    timestamps
  ),
  "publicaciones_feed"
);

// Coleccion comentarios: respuestas asociadas a publicaciones del feed.
export const Comentario = model(
  "Comentario",
  new Schema(
    {
      publicacion_id: { ...objectId, ref: "PublicacionFeed" },
      autor_id: objectId,
      texto: String,
    },
    timestamps
  ),
  "comentarios"
);

// Mapa que conecta el nombre de la ruta con su modelo Mongoose.
export const modelsByRoute = {
  roles: Role,
  usuarios: Usuario,
  conductores: Conductor,
  vehiculos: Vehiculo,
  clientes: Cliente,
  zonas: Zona,
  rutas: Ruta,
  pedidos: Pedido,
  despachos: Despacho,
  seguimiento_gps: SeguimientoGps,
  incidencias: Incidencia,
  mantenimientos: Mantenimiento,
  reportes: Reporte,
  notificaciones: Notificacion,
  publicaciones_feed: PublicacionFeed,
  comentarios: Comentario,
};


