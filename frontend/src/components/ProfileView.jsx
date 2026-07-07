import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Crown, X } from "lucide-react";
import { apiRequest } from "../api.js";
import { roleDefinitions } from "../config/roles.js";
import { planDefinitions } from "../config/plans.js";

export function ProfileView({ user, onUserChange }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const currentPlanKey = user.suscripcion?.plan;

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
          <p className="eyebrow">{t("profile.iamProfile")}</p>
          <h2>{user.nombre}</h2>
          <p>{user.email}</p>
        </div>
        <dl className="profileFacts">
          <div><dt>{t("profile.role")}</dt><dd>{t(`roles.${user.rol}.title`, user.rol)}</dd></div>
          <div><dt>{t("profile.scope")}</dt><dd>{t(`roles.${user.rol}.description`, roleDefinitions[user.rol]?.description || t("profile.noScope"))}</dd></div>
          <div><dt>{t("profile.phone")}</dt><dd>{user.telefono || t("profile.notRegistered")}</dd></div>
          <div><dt>{t("profile.currentPlan")}</dt><dd>{currentPlanKey ? t(`plans.${currentPlanKey}.title`, planDefinitions[currentPlanKey]?.title) : t("profile.noPlan")}</dd></div>
          <div><dt>{t("profile.status")}</dt><dd>{user.suscripcion?.estado || t("profile.pending")}</dd></div>
        </dl>
      </div>

      <div className="profileCard">
        <div>
          <p className="eyebrow">{t("profile.subscription")}</p>
          <h2>{t("profile.changePlan")}</h2>
          <p>{t("profile.changePlanBody")}</p>
        </div>
        {error && <div className="notice error"><X size={18} /><span>{error}</span></div>}
        <div className="subscriptionBar inProfile">
          {Object.entries(planDefinitions).map(([plan, info]) => (
            <button className={currentPlanKey === plan ? "plan active" : "plan"} key={plan} onClick={() => choose(plan)} disabled={saving} type="button">
              <Crown size={18} />
              <strong>{t(`plans.${plan}.title`, info.title)}</strong>
              <span>{t(`plans.${plan}.subtitle`, info.subtitle)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
