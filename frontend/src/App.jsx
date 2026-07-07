import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Boxes, Database, Gauge, LogOut, Truck, UserRound } from "lucide-react";
import { apiRequest, clearSession, getStoredUser } from "./api.js";
import { modules } from "./modules.js";
import { roleDefinitions } from "./config/roles.js";
import { planDefinitions } from "./config/plans.js";
import { moduleGroups } from "./config/moduleGroups.js";
import { normalizePayload, toForm } from "./utils/forms.js";
import { AuthScreen } from "./components/AuthScreen.jsx";
import { PlanGate } from "./components/PlanGate.jsx";
import { DashboardView } from "./components/DashboardView.jsx";
import { ProfileView } from "./components/ProfileView.jsx";
import { FeedView } from "./components/FeedView.jsx";
import { ResourceView } from "./components/ResourceView.jsx";
import { LanguageSwitcher } from "./components/LanguageSwitcher.jsx";

export default function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState(getStoredUser());
  const availableModules = useMemo(() => {
    const plan = user?.suscripcion?.plan;
    const planModules = planDefinitions[plan]?.modules || [];
    const roleModules = roleDefinitions[user?.rol]?.modules || [];
    const allowed = planModules.filter((moduleKey) => roleModules.includes(moduleKey));
    return modules.filter((module) => allowed.includes(module.key));
  }, [user]);
  const [activeKey, setActiveKey] = useState("dashboard");
  const isProfile = activeKey === "perfil";
  const isDashboard = activeKey === "dashboard";
  const isFeed = activeKey === "publicaciones_feed";
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeModule = useMemo(() => isProfile || isDashboard || isFeed ? null : availableModules.find((module) => module.key === activeKey) || availableModules[0], [activeKey, availableModules, isProfile, isDashboard, isFeed]);
  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [items, query]);

  function logout() {
    clearSession();
    setUser(null);
    setActiveKey("dashboard");
  }

  async function loadItems() {
    if (!activeModule) return;
    setLoading(true);
    setMessage(null);
    try {
      const response = await apiRequest(`/${activeModule.key}?limit=50`);
      setItems(response.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.suscripcion || !activeModule) return;
    setSelected(null);
    setForm(toForm(activeModule));
    setQuery("");
    loadItems();
  }, [activeModule?.key, user?.suscripcion?.plan]);

  useEffect(() => {
    const fixedViews = ["dashboard", "perfil"];
    if (!fixedViews.includes(activeKey) && availableModules.length && !availableModules.some((module) => module.key === activeKey)) {
      setActiveKey("dashboard");
    }
  }, [availableModules, activeKey]);

  if (!user) return <AuthScreen onAuth={setUser} />;
  if (!user.suscripcion) return <PlanGate user={user} onUserChange={setUser} onLogout={logout} />;

  function closeModal() {
    setModalMode(null);
    setDeleteTarget(null);
  }

  function startCreate() {
    setSelected(null);
    setForm(toForm(activeModule));
    setMessage(null);
    setModalMode("create");
  }

  function startEdit(item) {
    setSelected(item);
    setForm(toForm(activeModule, item));
    setMessage(null);
    setModalMode("edit");
  }

  function updateField(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = normalizePayload(activeModule, form);
      if (selected?._id) {
        await apiRequest(`/${activeModule.key}/${selected._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        setMessage({ type: "success", text: t("common.recordUpdated") });
      } else {
        await apiRequest(`/${activeModule.key}`, { method: "POST", body: JSON.stringify(payload) });
        setMessage({ type: "success", text: t("common.recordCreated") });
      }
      closeModal();
      setSelected(null);
      setForm(toForm(activeModule));
      await loadItems();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  function requestDelete(item) {
    setDeleteTarget(item);
    setMessage(null);
    setModalMode("delete");
  }

  function cancelDelete() {
    setDeleteTarget(null);
    setModalMode(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await apiRequest(`/${activeModule.key}/${deleteTarget._id}`, { method: "DELETE" });
      setMessage({ type: "success", text: t("common.recordDeleted") });
      if (selected?._id === deleteTarget._id) {
        setSelected(null);
        setForm(toForm(activeModule));
      }
      cancelDelete();
      await loadItems();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  const groupedModules = moduleGroups
    .map((group) => ({ ...group, modules: availableModules.filter((module) => group.keys.includes(module.key)) }))
    .filter((group) => group.modules.length > 0);
  const pageTitle = isDashboard ? t("nav.dashboard") : isProfile ? t("nav.profile") : isFeed ? t("feed.title") : t(`modules.${activeModule?.key}.title`, activeModule?.title);
  const pageDescription = isDashboard ? t("dashboard.pageDescription") : isProfile ? t("profile.pageDescription") : isFeed ? t("feed.pageDescription") : t(`modules.${activeModule?.key}.description`, activeModule?.description);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandMark"><Truck size={22} /></div><div><strong>{t("auth.brand")}</strong><span>{t(`roles.${user.rol}.title`, user.rol)} | {t(`plans.${user.suscripcion.plan}.title`, planDefinitions[user.suscripcion.plan]?.title)}</span></div></div>
        <nav className="moduleNav" aria-label={t("nav.modulesAriaLabel")}>
          <button className={isDashboard ? "active" : ""} onClick={() => setActiveKey("dashboard")} type="button"><Gauge size={18} /><span>{t("nav.dashboard")}</span></button>
          <button className={isProfile ? "active" : ""} onClick={() => setActiveKey("perfil")} type="button"><UserRound size={18} /><span>{t("nav.profile")}</span></button>
          {groupedModules.map((group) => {
            const Icon = group.icon;
            return <div className="navGroup" key={group.title}><div className="navGroupTitle"><Icon size={14} />{t(`moduleGroups.${group.key}`, group.title)}</div>{group.modules.map((module) => <button className={module.key === activeKey ? "active" : ""} key={module.key} onClick={() => setActiveKey(module.key)} type="button"><Boxes size={18} /><span>{t(`modules.${module.key}.title`, module.title)}</span></button>)}</div>;
          })}
        </nav>
      </aside>

      <main className="content">
        <section className="topbar"><div><p className="eyebrow">{user.nombre}</p><h1>{pageTitle}</h1><p>{pageDescription}</p></div><div className="topActions"><LanguageSwitcher /><div className="statusPill"><Database size={18} /><span>{t("common.apiOnline")}</span></div><button className="secondaryButton" onClick={logout} type="button"><LogOut size={18} />{t("common.logout")}</button></div></section>

        {isDashboard && <DashboardView user={user} availableModules={availableModules} onOpenModule={setActiveKey} />}
        {isProfile && <ProfileView user={user} onUserChange={setUser} />}
        {isFeed && <FeedView user={user} />}
        {!isDashboard && !isProfile && !isFeed && activeModule && <ResourceView activeModule={activeModule} filteredItems={filteredItems} query={query} setQuery={setQuery} loading={loading} loadItems={loadItems} startCreate={startCreate} startEdit={startEdit} requestDelete={requestDelete} confirmDelete={confirmDelete} cancelDelete={cancelDelete} selected={selected} deleteTarget={deleteTarget} modalMode={modalMode} closeModal={closeModal} message={message} form={form} updateField={updateField} saveItem={saveItem} saving={saving} />}
      </main>
    </div>
  );
}
