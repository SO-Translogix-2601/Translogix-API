import bcrypt from "bcryptjs";
import { Role, Suscripcion, Usuario } from "../infrastructure/mongoose/models.js";

export const DEVELOPMENT_PASSWORD = "Translogix2026!";

const plans = {
  plus: ["CRUD logistico", "Dashboard operativo", "Notificaciones internas"],
  premium: ["CRUD logistico", "Dashboard operativo", "Notificaciones internas", "Reportes avanzados", "Feed corporativo"],
};

export async function bootstrapDemoData() {
  const passwordHash = await bcrypt.hash(DEVELOPMENT_PASSWORD, 10);
  const users = await Usuario.find();

  for (const user of users) {
    const currentHash = String(user.password_hash || "");
    const isSeedPlaceholder = currentHash.includes("hash1") || currentHash.includes("hash2") || currentHash.includes("hash3");
    const acceptsDevelopmentPassword = currentHash.startsWith("$2") && await bcrypt.compare(DEVELOPMENT_PASSWORD, currentHash).catch(() => false);

    if (isSeedPlaceholder || !acceptsDevelopmentPassword) {
      user.password_hash = passwordHash;
      await user.save();
    }
  }

  const legacyAdmin = await Usuario.findOne({ email: "cmendoza@translogix.pe" });
  const primaryAdmin = await Usuario.findOne({ email: "carlosmen@gmail.com" });
  if (legacyAdmin && !primaryAdmin) {
    legacyAdmin.email = "carlosmen@gmail.com";
    await legacyAdmin.save();
  }

  const admin = await Usuario.findOne({ email: "cmendoza@translogix.pe" }) || await Usuario.findOne({ email: "carlosmen@gmail.com" }) || users[0];
  const operator = await Usuario.findOne({ email: "atorres@translogix.pe" });

  if (admin) await upsertSubscription(admin._id, "premium");
  if (operator) await upsertSubscription(operator._id, "plus");
}

async function upsertSubscription(usuarioId, plan) {
  await Suscripcion.findOneAndUpdate(
    { usuario_id: usuarioId },
    {
      usuario_id: usuarioId,
      plan,
      estado: "activa",
      fecha_inicio: new Date(),
      caracteristicas: plans[plan],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function buildUserSession(user) {
  const role = user.rol_id ? await Role.findById(user.rol_id) : null;
  const subscription = await Suscripcion.findOne({ usuario_id: user._id, estado: "activa" });

  return {
    id: user._id,
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    activo: user.activo,
    rol: role?.nombre || "Sin rol",
    permisos: role?.permisos || [],
    suscripcion: subscription
      ? {
          id: subscription._id,
          plan: subscription.plan,
          estado: subscription.estado,
          caracteristicas: subscription.caracteristicas,
        }
      : null,
  };
}

export async function chooseSubscription(usuarioId, plan) {
  if (!plans[plan]) {
    const error = new Error("Plan no valido. Usa plus o premium.");
    error.statusCode = 400;
    throw error;
  }

  await upsertSubscription(usuarioId, plan);
  const user = await Usuario.findById(usuarioId);
  return buildUserSession(user);
}
