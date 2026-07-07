import { useTranslation } from "react-i18next";
import { Crown, Database, Layers3, ShieldCheck } from "lucide-react";
import { planDefinitions } from "../config/plans.js";
import { roleDefinitions } from "../config/roles.js";
import { moduleGroups } from "../config/moduleGroups.js";

export function DashboardView({ user, availableModules, onOpenModule }) {
  const { t } = useTranslation();
  const planKey = user.suscripcion?.plan;
  const plan = planDefinitions[planKey];
  const role = roleDefinitions[user.rol];
  const visibleGroups = moduleGroups
    .map((group) => ({ ...group, modules: availableModules.filter((module) => group.keys.includes(module.key)) }))
    .filter((group) => group.modules.length > 0);

  return (
    <section className="dashboardPage">
      <div className="metricGrid">
        <article className="metricCard"><ShieldCheck size={20} /><span>{t("dashboard.role")}</span><strong>{t(`roles.${user.rol}.title`, role?.title)}</strong></article>
        <article className="metricCard"><Crown size={20} /><span>{t("dashboard.plan")}</span><strong>{t(`plans.${planKey}.title`, plan?.title)}</strong></article>
        <article className="metricCard"><Layers3 size={20} /><span>{t("dashboard.activeModules")}</span><strong>{availableModules.length}</strong></article>
        <article className="metricCard"><Database size={20} /><span>{t("dashboard.api")}</span><strong>{t("dashboard.online")}</strong></article>
      </div>

      <div className="dashboardGrid">
        <section className="summaryPanel">
          <p className="eyebrow">{t("dashboard.currentFlow")}</p>
          <h2>{t(`roles.${user.rol}.description`, role?.description)}</h2>
          <p>{t("dashboard.flowBody")}</p>
        </section>
        <section className="summaryPanel">
          <p className="eyebrow">{t("dashboard.operation")}</p>
          <h2>{t(`plans.${planKey}.subtitle`, plan?.subtitle)}</h2>
          <p>{t(`plans.${planKey}.description`, plan?.description)}</p>
        </section>
      </div>

      <section className="moduleCatalog">
        {visibleGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div className="moduleGroup" key={group.title}>
              <div className="moduleGroupHeader"><Icon size={18} /><strong>{t(`moduleGroups.${group.key}`, group.title)}</strong></div>
              <div className="moduleCards">
                {group.modules.map((module) => (
                  <button className="moduleCard" key={module.key} onClick={() => onOpenModule(module.key)} type="button">
                    <span>{t(`modules.${module.key}.title`, module.title)}</span>
                    <small>{t(`modules.${module.key}.description`, module.description)}</small>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </section>
  );
}
