import mongoose from "mongoose";

// Centraliza la conexion a MongoDB usando Mongoose.
// Si la conexion falla, se detiene el proceso para evitar levantar una API sin base de datos.
export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB conectado: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}
