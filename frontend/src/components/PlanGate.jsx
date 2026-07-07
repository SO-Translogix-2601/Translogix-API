import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Crown, LogOut, Truck, X } from "lucide-react";
import { apiRequest } from "../api.js";
import { planDefinitions } from "../config/plans.js";

export function PlanGate({ user, onUserChange, onLogout }) {
  const { t } = useTranslation();
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
        <div className="brand big"><div className="brandMark"><Truck size={24} /></div><div><strong>{t("auth.brand")}</strong><span>{t("planGate.subtitleBrand")}</span></div></div>
        <h1>{t("planGate.title")}</h1>
        <p>{t("planGate.body", { name: user.nombre, role: t(`roles.${user.rol}.title`, user.rol) })}</p>
        <button className="secondaryButton" onClick={onLogout} type="button"><LogOut size={18} />{t("common.logout")}</button>
      </section>
      {error && <div className="notice error"><X size={18} /><span>{error}</span></div>}
      <section className="planGrid">
        {Object.entries(planDefinitions).map(([key, plan]) => (
          <article className="planChoice" key={key}>
            <Crown size={24} />
            <h2>{t(`plans.${key}.title`, plan.title)}</h2>
            <strong>{t(`plans.${key}.subtitle`, plan.subtitle)}</strong>
            <p>{t(`plans.${key}.description`, plan.description)}</p>
            <ul>{t(`plans.${key}.features`, { returnObjects: true, defaultValue: plan.features }).map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <button className="primaryButton full" disabled={saving} onClick={() => choose(key)} type="button">{t("planGate.choosePlan", { plan: t(`plans.${key}.title`, plan.title) })}</button>
          </article>
        ))}
      </section>
    </main>
  );
}
