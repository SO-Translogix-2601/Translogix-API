import { useState } from "react";
import { Crown, X } from "lucide-react";
import { apiRequest } from "../api.js";
import { roleDefinitions } from "../config/roles.js";
import { planDefinitions } from "../config/plans.js";

export function ProfileView({ user, onUserChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function choose(plan) {
    setSaving(true);
    setError("");
    try {
      const updated = await apiRequest("/auth/suscripcion", { method: "POST", body: JSON.stringify({ plan }) });
      localStorage.setItem("translogix_user", JSON.stringify(updated));
      onUserChange(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="profilePage">
      <div className="profileCard">
        <div>
          <p className="eyebrow">Perfil IAM</p>
          <h2>{user.nombre}</h2>
          <p>{user.email}</p>
        </div>
        <dl className="profileFacts">
          <div><dt>Rol</dt><dd>{user.rol}</dd></div>
          <div><dt>Alcance</dt><dd>{roleDefinitions[user.rol]?.description || "Sin alcance definido"}</dd></div>
          <div><dt>Telefono</dt><dd>{user.telefono || "No registrado"}</dd></div>
          <div><dt>Plan actual</dt><dd>{planDefinitions[user.suscripcion?.plan]?.title || "Sin plan"}</dd></div>
          <div><dt>Estado</dt><dd>{user.suscripcion?.estado || "Pendiente"}</dd></div>
        </dl>
      </div>

      <div className="profileCard">
        <div>
          <p className="eyebrow">Suscripcion</p>
          <h2>Cambiar plan</h2>
          <p>La suscripcion se administra desde el perfil. El rol IAM sigue limitando los modulos aunque se elija Premium.</p>
        </div>
        {error && <div className="notice error"><X size={18} /><span>{error}</span></div>}
        <div className="subscriptionBar inProfile">
          {Object.entries(planDefinitions).map(([plan, info]) => (
            <button className={user?.suscripcion?.plan === plan ? "plan active" : "plan"} key={plan} onClick={() => choose(plan)} disabled={saving} type="button">
              <Crown size={18} />
              <strong>{info.title}</strong>
              <span>{info.subtitle}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
