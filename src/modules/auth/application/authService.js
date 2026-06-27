import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, Usuario } from "../../translogix/infrastructure/mongoose/models.js";
import { buildUserSession, chooseSubscription } from "../../translogix/application/bootstrapDemoData.js";

export function createAuthService() {
  return {
    async login({ email, password }) {
      const user = await Usuario.findOne({ email });
      if (!user || !user.activo) return null;

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return null;

      return createSession(user);
    },

    async register({ nombre, email, password, telefono, rol }) {
      if (!nombre || !email || !password || !rol) {
        const error = new Error("Nombre, email, password y rol son obligatorios");
        error.statusCode = 400;
        throw error;
      }

      const exists = await Usuario.findOne({ email });
      if (exists) {
        const error = new Error("El email ya esta registrado");
        error.statusCode = 409;
        throw error;
      }

      const selectedRole = await Role.findOne({ nombre: rol });
      if (!selectedRole || !["Administrador", "Operador", "Conductor"].includes(selectedRole.nombre)) {
        const error = new Error("Rol no valido");
        error.statusCode = 400;
        throw error;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await Usuario.create({
        nombre,
        email,
        password_hash: passwordHash,
        rol_id: selectedRole._id,
        activo: true,
        telefono,
      });

      return createSession(user);
    },

    async me(userId) {
      const user = await Usuario.findById(userId);
      return user ? buildUserSession(user) : null;
    },

    chooseSubscription(userId, plan) {
      return chooseSubscription(userId, plan);
    },
  };
}

async function createSession(user) {
  const session = await buildUserSession(user);
  const token = jwt.sign(
    { sub: String(user._id), email: user.email, rol: session.rol },
    process.env.JWT_SECRET || "translogix_demo_secret_2026",
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

  return { token, user: session };
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "translogix_demo_secret_2026");
}