import mongoose from "mongoose";

const { Schema, model } = mongoose;
const objectId = { type: Schema.Types.ObjectId };
const timestamps = { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, versionKey: false };

const coordenadasSchema = new Schema(
  { lat: Number, lng: Number },
  { _id: false, versionKey: false }
);

const direccionSchema = new Schema(
  {
    calle: String,
    distrito: String,
    ciudad: String,
    coordenadas: coordenadasSchema,
  },
  { _id: false, versionKey: false }
);

const multimediaSchema = new Schema(
  { tipo: String, url: String, size_mb: Number },
  { _id: false, versionKey: false }
);

const reaccionSchema = new Schema(
  { emoji: String, cantidad: Number },
  { _id: false, versionKey: false }
);

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


export const Suscripcion = model(
  "Suscripcion",
  new Schema(
    {
      usuario_id: { ...objectId, ref: "Usuario", required: true },
      plan: { type: String, enum: ["plus", "premium"], required: true },
      estado: { type: String, enum: ["activa", "cancelada"], default: "activa" },
      fecha_inicio: { type: Date, default: Date.now },
      fecha_fin: Date,
      caracteristicas: [String],
    },
    timestamps
  ),
  "suscripciones"
);
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
  suscripciones: Suscripcion,
};
