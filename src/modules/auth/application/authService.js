import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../../translogix/infrastructure/mongoose/models.js";
import { buildUserSession, chooseSubscription } from "../../translogix/application/bootstrapDemoData.js";

export function createAuthService() {
  return {
    async login({ email, password }) {
      const user = await Usuario.findOne({ email });
      if (!user || !user.activo) return null;

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return null;

      const session = await buildUserSession(user);
      const token = jwt.sign(
        { sub: String(user._id), email: user.email, rol: session.rol },
        process.env.JWT_SECRET || "translogix_demo_secret_2026",
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
      );

      return { token, user: session };
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

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "translogix_demo_secret_2026");
}
