import { useEffect, useMemo, useState } from "react";
import { Boxes, CheckCircle2, Crown, Database, Edit3, Loader2, LogOut, Plus, RefreshCcw, Save, Search, ShieldCheck, Trash2, Truck, UserPlus, UserRound, X } from "lucide-react";
import { apiRequest, clearSession, getStoredUser, setSession } from "./api.js";
import { modules } from "./modules.js";

const planDefinitions = {
  plus: {
    title: "Plus",
    subtitle: "Operacion logistica esencial",
    description: "Para equipos que necesitan controlar clientes, flota, rutas, pedidos y despachos de ultima milla.",
    modules: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos", "seguimiento_gps", "incidencias", "notificaciones", "suscripciones"],
    features: ["CRUD logistico operativo", "Monitoreo GPS", "Gestion de incidencias", "Notificaciones internas"],
  },
  premium: {
    title: "Premium",
    subtitle: "Arquitectura completa para crecimiento",
    description: "Incluye toda la operacion Plus mas IAM administrativo, mantenimiento, reportes y red social corporativa.",
    modules: modules.map((module) => module.key),
    features: ["Todos los modulos", "Usuarios y roles", "Reportes avanzados", "Mantenimientos", "Feed y comentarios"],
  },
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

function normalizePayload(module, form) {
  const payload = {};
  for (const field of module.fields) {
    const value = form[field.name];
    if (field.type === "json") payload[field.name] = typeof value === "string" && value.trim() ? JSON.parse(value) : value;
    else if (field.type === "number") payload[field.name] = value === "" ? undefined : Number(value);
    else if (field.type === "checkbox") payload[field.name] = Boolean(value);
    else if (field.type === "datetime-local") payload[field.name] = value ? new Date(value).toISOString() : null;
    else payload[field.name] = value;
  }
  Object.keys(payload).forEach((key) => (payload[key] === undefined || payload[key] === "") && delete payload[key]);
  return payload;
}

function toForm(module, item) {
  const source = item || module.empty;
  const form = {};
  for (const field of module.fields) {
    const value = source[field.name];
    if (field.type === "json") form[field.name] = JSON.stringify(value ?? field.fallback ?? {}, null, 2);
    else if (field.type === "datetime-local") form[field.name] = value ? new Date(value).toISOString().slice(0, 16) : "";
    else form[field.name] = value ?? "";
  }
  return form;
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email, password } : { nombre, email, password, telefono };
      const result = await apiRequest(path, { method: "POST", body: JSON.stringify(body) });
      setSession(result.token, result.user);
      onAuth(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="loginPage">
      <form className="loginBox" onSubmit={submit}>
        <div className="brand big"><div className="brandMark"><Truck size={24} /></div><div><strong>Translogix TMS</strong><span>IAM de acceso seguro</span></div></div>
        <div className="authTabs"><button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>Iniciar sesion</button><button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>Crear cuenta</button></div>
        {mode === "register" && <><label className="field"><span>Nombre</span><input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label className="field"><span>Telefono</span><input value={telefono} onChange={(e) => setTelefono(e.target.value)} /></label></>}
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required /></label>
        <label className="field"><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 6 caracteres" required minLength={6} /></label>
        {error && <div className="notice error"><X size={18} /><span>{error}</span></div>}
        <button className="primaryButton full" disabled={loading} type="submit">{loading ? <Loader2 className="spin" size={18} /> : mode === "login" ? <ShieldCheck size={18} /> : <UserPlus size={18} />}{mode === "login" ? "Ingresar" : "Crear cuenta"}</button>
      </form>
    </main>
  );
}

function PlanGate({ user, onUserChange, onLogout }) {
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
        <div className="brand big"><div className="brandMark"><Truck size={24} /></div><div><strong>Translogix TMS</strong><span>Arquitectura de tres capas para ultima milla</span></div></div>
        <h1>Elige tu suscripcion</h1>
        <p>{user.nombre}, tu cuenta IAM ya fue verificada. Para entrar al sistema debes elegir un plan.</p>
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

function ProfileView({ user, onUserChange }) {
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
          <div><dt>Telefono</dt><dd>{user.telefono || "No registrado"}</dd></div>
          <div><dt>Plan actual</dt><dd>{planDefinitions[user.suscripcion?.plan]?.title || "Sin plan"}</dd></div>
          <div><dt>Estado</dt><dd>{user.suscripcion?.estado || "Pendiente"}</dd></div>
        </dl>
      </div>

      <div className="profileCard">
        <div>
          <p className="eyebrow">Suscripcion</p>
          <h2>Cambiar plan</h2>
          <p>La suscripcion solo se administra desde el perfil del usuario.</p>
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

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const availableModules = useMemo(() => {
    const plan = user?.suscripcion?.plan;
    const allowed = planDefinitions[plan]?.modules || [];
    return modules.filter((module) => allowed.includes(module.key));
  }, [user]);
  const [activeKey, setActiveKey] = useState("clientes");
  const isProfile = activeKey === "perfil";
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const activeModule = useMemo(() => isProfile ? null : availableModules.find((module) => module.key === activeKey) || availableModules[0], [activeKey, availableModules, isProfile]);
  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [items, query]);

  function logout() {
    clearSession();
    setUser(null);
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
    if (!isProfile && availableModules.length && !availableModules.some((module) => module.key === activeKey)) {
      setActiveKey(availableModules[0].key);
    }
  }, [availableModules, activeKey]);

  if (!user) return <AuthScreen onAuth={setUser} />;
  if (!user.suscripcion) return <PlanGate user={user} onUserChange={setUser} onLogout={logout} />;

  function startCreate() { setSelected(null); setForm(toForm(activeModule)); setMessage(null); }
  function startEdit(item) { setSelected(item); setForm(toForm(activeModule, item)); setMessage(null); }
  function updateField(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = normalizePayload(activeModule, form);
      if (selected?._id) {
        await apiRequest(`/${activeModule.key}/${selected._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        setMessage({ type: "success", text: "Registro actualizado correctamente." });
      } else {
        await apiRequest(`/${activeModule.key}`, { method: "POST", body: JSON.stringify(payload) });
        setMessage({ type: "success", text: "Registro creado correctamente." });
      }
      startCreate();
      await loadItems();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    const label = item.codigo || item.placa || item.razon_social || item.nombre_completo || item._id;
    if (!window.confirm(`Eliminar ${label}?`)) return;
    setLoading(true);
    try {
      await apiRequest(`/${activeModule.key}/${item._id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Registro eliminado." });
      if (selected?._id === item._id) startCreate();
      await loadItems();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandMark"><Truck size={22} /></div><div><strong>Translogix</strong><span>{user.rol} | {planDefinitions[user.suscripcion.plan]?.title}</span></div></div>
        <nav className="moduleNav" aria-label="Modulos"><button className={isProfile ? "active" : ""} onClick={() => setActiveKey("perfil")} type="button"><UserRound size={18} /><span>Perfil</span></button>{availableModules.map((module) => <button className={module.key === activeKey ? "active" : ""} key={module.key} onClick={() => setActiveKey(module.key)} type="button"><Boxes size={18} /><span>{module.title}</span></button>)}</nav>
      </aside>

      <main className="content">
        <section className="topbar"><div><p className="eyebrow">{user.nombre}</p><h1>{isProfile ? "Perfil" : activeModule.title}</h1><p>{isProfile ? "Datos de usuario IAM y administracion de suscripcion." : activeModule.description}</p></div><div className="topActions"><div className="statusPill"><Database size={18} /><span>API localhost:3000</span></div><button className="secondaryButton" onClick={logout} type="button"><LogOut size={18} />Salir</button></div></section>

        {isProfile ? <ProfileView user={user} onUserChange={setUser} /> : <section className="workspace">
          <div className="listPanel">
            <div className="panelHeader"><div><h2>Registros</h2><span>{filteredItems.length} visibles</span></div><div className="actions"><label className="searchBox"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar" /></label><button className="iconButton" onClick={loadItems} type="button" title="Actualizar">{loading ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}</button><button className="primaryButton" onClick={startCreate} type="button"><Plus size={18} />Nuevo</button></div></div>
            {message && <div className={`notice ${message.type}`}>{message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}<span>{message.text}</span></div>}
            <div className="tableWrap"><table><thead><tr>{activeModule.columns.map((column) => <th key={column}>{column}</th>)}<th className="tableActions">Acciones</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item._id} className={selected?._id === item._id ? "selectedRow" : ""}>{activeModule.columns.map((column) => <td key={column}>{formatValue(item[column])}</td>)}<td className="tableActions"><button className="iconButton" onClick={() => startEdit(item)} type="button" title="Editar"><Edit3 size={17} /></button><button className="dangerButton" onClick={() => deleteItem(item)} type="button" title="Eliminar"><Trash2 size={17} /></button></td></tr>)}{!loading && filteredItems.length === 0 && <tr><td className="emptyState" colSpan={activeModule.columns.length + 1}>No hay registros para mostrar.</td></tr>}</tbody></table></div>
          </div>

          <form className="formPanel" onSubmit={saveItem}>
            <div className="panelHeader compact"><div><h2>{selected ? "Editar registro" : "Crear registro"}</h2><span>{selected?._id || "Nuevo documento"}</span></div></div>
            <div className="formGrid">{activeModule.fields.map((field) => <label className={field.type === "json" ? "field wide" : "field"} key={field.name}><span>{field.label}</span>{field.type === "json" ? <textarea value={form[field.name] || ""} onChange={(event) => updateField(field.name, event.target.value)} rows={7} /> : field.type === "checkbox" ? <input checked={Boolean(form[field.name])} onChange={(event) => updateField(field.name, event.target.checked)} type="checkbox" /> : <input required={field.required} type={field.type || "text"} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} />}</label>)}</div>
            <div className="formActions"><button className="secondaryButton" onClick={startCreate} type="button"><X size={18} />Limpiar</button><button className="primaryButton" disabled={saving} type="submit">{saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}Guardar</button></div>
          </form>
        </section>}
      </main>
    </div>
  );
}