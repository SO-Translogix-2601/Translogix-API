export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Ruta no encontrada: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID invalido", detail: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Valor duplicado", detail: err.keyValue });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Datos invalidos", detail: err.message });
  }

  res.status(statusCode).json({ message: err.message || "Error interno" });
}
