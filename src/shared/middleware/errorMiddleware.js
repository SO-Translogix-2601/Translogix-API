// Middleware para rutas inexistentes. Genera un error 404 uniforme.
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Ruta no encontrada: ${req.originalUrl}`));
}

// Middleware central de errores. Convierte errores de Mongoose/Express en respuestas JSON.
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // ObjectId invalido u otros errores de conversion de Mongoose.
  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID invalido", detail: err.message });
  }

  // Indices unicos duplicados, por ejemplo email, dni, placa, ruc o codigo.
  if (err.code === 11000) {
    return res.status(409).json({ message: "Valor duplicado", detail: err.keyValue });
  }

  // Reglas required, unique o validaciones del schema.
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Datos invalidos", detail: err.message });
  }

  // Error generico para cualquier caso no contemplado.
  res.status(statusCode).json({ message: err.message || "Error interno" });
}
