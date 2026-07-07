import { Crown, Database, Layers3, ShieldCheck } from "lucide-react";
import { planDefinitions } from "../config/plans.js";
import { roleDefinitions } from "../config/roles.js";
import { moduleGroups } from "../config/moduleGroups.js";

export function DashboardView({ user, availableModules, onOpenModule }) {
  const plan = planDefinitions[user.suscripcion?.plan];
  const role = roleDefinitions[user.rol];
  const visibleGroups = moduleGroups
    .map((group) => ({ ...group, modules: availableModules.filter((module) => group.keys.includes(module.key)) }))
    .filter((group) => group.modules.length > 0);

  return (
    <section className="dashboardPage">
      <div className="metricGrid">
        <article className="metricCard"><ShieldCheck size={20} /><span>Rol</span><strong>{role?.title}</strong></article>
        <article className="metricCard"><Crown size={20} /><span>Plan</span><strong>{plan?.title}</strong></article>
        <article className="metricCard"><Layers3 size={20} /><span>Modulos activos</span><strong>{availableModules.length}</strong></article>
        <article className="metricCard"><Database size={20} /><span>API</span><strong>Online</strong></article>
      </div>

      <div className="dashboardGrid">
        <section className="summaryPanel">
          <p className="eyebrow">Flujo actual</p>
          <h2>{role?.description}</h2>
          <p>El acceso visible se calcula con la interseccion entre el rol IAM y la suscripcion activa. Premium no reemplaza permisos de rol; solo amplia capacidades disponibles.</p>
        </section>
        <section className="summaryPanel">
          <p className="eyebrow">Operacion</p>
          <h2>{plan?.subtitle}</h2>
          <p>{plan?.description}</p>
        </section>
      </div>

      <section className="moduleCatalog">
        {visibleGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div className="moduleGroup" key={group.title}>
              <div className="moduleGroupHeader"><Icon size={18} /><strong>{group.title}</strong></div>
              <div className="moduleCards">
                {group.modules.map((module) => (
                  <button className="moduleCard" key={module.key} onClick={() => onOpenModule(module.key)} type="button">
                    <span>{module.title}</span>
                    <small>{module.description}</small>
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
