import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { bootstrapDemoData, DEMO_PASSWORD } from "./modules/translogix/application/bootstrapDemoData.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:translogix2026@localhost:27017/translogix_db?authSource=admin";

await connectDB(MONGODB_URI);
await bootstrapDemoData();
console.log(`Usuarios demo actualizados. Password: ${DEMO_PASSWORD}`);

app.listen(PORT, () => {
  console.log(`API Translogix escuchando en http://localhost:${PORT}`);
});
