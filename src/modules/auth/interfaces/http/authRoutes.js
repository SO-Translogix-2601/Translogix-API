import { Router } from "express";
import { createAuthService, verifyToken } from "../../application/authService.js";

const authService = createAuthService();

export function authRoutes() {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      if (!result) return res.status(401).json({ message: "Credenciales invalidas" });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/register", async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/me", requireAuth, async (req, res, next) => {
    try {
      const user = await authService.me(req.user.sub);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  router.post("/suscripcion", requireAuth, async (req, res, next) => {
    try {
      const user = await authService.chooseSubscription(req.user.sub, req.body.plan);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalido o expirado" });
  }
}