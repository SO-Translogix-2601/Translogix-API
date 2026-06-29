import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

// Puerto de la API. Usa PORT del .env si existe; si no, usa 3000.
const PORT = process.env.PORT || 3000;

// URI de conexion a MongoDB. El valor por defecto coincide con el docker-compose del proyecto.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:translogix2026@localhost:27017/translogix_db?authSource=admin";

// Antes de aceptar peticiones, la aplicacion espera a que MongoDB conecte correctamente.
await connectDB(MONGODB_URI);

// Inicia el servidor HTTP de Express.
app.listen(PORT, () => {
  console.log(`API Translogix escuchando en http://localhost:${PORT}`);
});
