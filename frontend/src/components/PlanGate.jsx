import { useState } from "react";
import { Crown, LogOut, Truck, X } from "lucide-react";
import { apiRequest } from "../api.js";
import { planDefinitions } from "../config/plans.js";

export function PlanGate({ user, onUserChange, onLogout }) {
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
    <main className="planPage">
      <section className="planHero">
        <div className="brand big"><div className="brandMark"><Truck size={24} /></div><div><strong>Translogix TMS</strong><span>Suscripcion requerida</span></div></div>
        <h1>Elige el alcance inicial de tu cuenta</h1>
        <p>{user.nombre}, tu rol es {user.rol}. El dashboard se desbloquea cruzando rol y plan.</p>
        <button className="secondaryButton" onClick={onLogout} type="button"><LogOut size={18} />Salir</button>
      </section>
      {error && <div className="notice error"><X size={18} /><span>{error}</span></div>}
      <section className="planGrid">
        {Object.entries(planDefinitions).map(([key, plan]) => (
          <article className="planChoice" key={key}>
            <Crown size={24} />
            <h2>{plan.title}</h2>
            <strong>{plan.subtitle}</strong>
            <p>{plan.description}</p>
            <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <button className="primaryButton full" disabled={saving} onClick={() => choose(key)} type="button">Elegir {plan.title}</button>
          </article>
        ))}
      </section>
    </main>
  );
}
