import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:translogix2026@localhost:27017/translogix_db?authSource=admin";

await connectDB(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`API Translogix escuchando en http://localhost:${PORT}`);
});
