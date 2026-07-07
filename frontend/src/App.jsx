import { useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Crown,
  Database,
  Edit3,
  Gauge,
  Layers3,
  Loader2,
  LogOut,
  MessageSquareText,
  PackageCheck,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Image,
  Send,
  SmilePlus,
  Truck,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { apiRequest, clearSession, getStoredUser, setSession } from "./api.js";
import { modules } from "./modules.js";

const roleDefinitions = {
  Administrador: {
    title: "Administrador",
    description: "Gestion completa del TMS, IAM, reportes y configuracion.",
    modules: modules.map((module) => module.key),
  },
  Operador: {
    title: "Operador",
    description: "Gestion operativa de clientes, rutas, pedidos, despachos e incidencias.",
    modules: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos", "seguimiento_gps", "incidencias", "notificaciones", "suscripciones"],
  },
  Conductor: {
    title: "Conductor",
    description: "Consulta de despachos asignados, GPS, incidencias y comunicacion interna.",
    modules: ["despachos", "seguimiento_gps", "incidencias", "notificaciones", "publicaciones_feed", "comentarios", "suscripciones"],
  },
};

const planDefinitions = {
  plus: {
    title: "Plus",
    subtitle: "Operacion logistica esencial",
    description: "Control de clientes, flota, rutas, pedidos y despachos de ultima milla.",
    modules: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos", "seguimiento_gps", "incidencias", "notificaciones", "suscripciones"],
    features: ["CRUD logistico operativo", "Monitoreo GPS", "Gestion de incidencias", "Notificaciones internas"],
  },
  premium: {
    title: "Premium",
    subtitle: "Arquitectura completa para crecimiento",
    description: "Incluye todo Plus mas IAM administrativo, mantenimiento, reportes y comunicacion interna.",
    modules: modules.map((module) => module.key),
    features: ["Todos los modulos", "Usuarios y roles", "Reportes avanzados", "Mantenimientos", "Feed y comentarios"],
  },
};

const moduleGroups = [
  { title: "IAM", icon: ShieldCheck, keys: ["roles", "usuarios"] },
  { title: "Operacion", icon: Truck, keys: ["clientes", "vehiculos", "conductores", "zonas", "rutas", "pedidos", "despachos"] },
  { title: "Monitoreo", icon: Gauge, keys: ["seguimiento_gps", "incidencias", "mantenimientos"] },
  { title: "Gestion", icon: PackageCheck, keys: ["reportes", "notificaciones", "suscripciones"] },
  { title: "Comunicacion", icon: MessageSquareText, keys: ["publicaciones_feed", "comentarios"] },
];

const reactionOptions = [
  { emoji: "\u{1F44D}", label: "Me gusta" },
  { emoji: "\u2764\uFE0F", label: "Importante" },
  { emoji: "\u{1F602}", label: "Ligero" },
  { emoji: "\u{1F62E}", label: "Atencion" },
  { emoji: "\u{1F69A}", label: "En ruta" },
  { emoji: "\u2705", label: "Resuelto" },
];
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

function fieldLabel(module, column) {
  return module.fields.find((field) => field.name === column)?.label || column.replaceAll("_", " ");
}

function addReaction(reactions = [], emoji, userId) {
  const currentUserId = String(userId || "");
  const current = Array.isArray(reactions) ? reactions : [];
  const alreadyReactedHere = current.some((reaction) => reaction.emoji === emoji && (reaction.usuarios || []).map(String).includes(currentUserId));
  if (alreadyReactedHere) return current;

  const withoutPreviousUserReaction = current
    .map((reaction) => {
      const usuarios = (reaction.usuarios || []).map(String);
      if (!usuarios.includes(currentUserId)) return reaction;
      return {
        ...reaction,
        usuarios: usuarios.filter((id) => id !== currentUserId),
        cantidad: Math.max(0, Number(reaction.cantidad || 0) - 1),
      };
    })
    .filter((reaction) => Number(reaction.cantidad || 0) > 0);

  const exists = withoutPreviousUserReaction.find((reaction) => reaction.emoji === emoji);
  if (exists) {
    return withoutPreviousUserReaction.map((reaction) => reaction.emoji === emoji ? { ...reaction, usuarios: [...(reaction.usuarios || []).map(String), currentUserId], cantidad: Number(reaction.cantidad || 0) + 1 } : reaction);
  }
  return [...withoutPreviousUserReaction, { emoji, cantidad: 1, usuarios: [currentUserId] }];
}

function userReaction(reactions = [], userId) {
  const currentUserId = String(userId || "");
  return (Array.isArray(reactions) ? reactions : []).find((reaction) => (reaction.usuarios || []).map(String).includes(currentUserId))?.emoji;
}
function renderReactionSummary(reactions = []) {
  const current = Array.isArray(reactions) ? reactions : [];
  if (!current.length) return "Sin reacciones";
  return current.map((reaction) => `${reaction.emoji} ${reaction.cantidad || 0}`).join("  ");
}

function formatDate(value) {
  if (!value) return "Ahora";
  return new Date(value).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}

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
  const [rol, setRol] = useState("Operador");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email, password } : { nombre, email, password, telefono, rol };
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
    <main className="authPage">
      <section className="authIntro">
        <div className="brand big"><div className="brandMark"><Truck size={24} /></div><div><strong>Translogix TMS</strong><span>Ultima milla con arquitectura de tres capas</span></div></div>
        <h1>Gestion logistica con IAM, suscripciones y trazabilidad operativa.</h1>
        <p>La aplicacion separa presentacion, aplicacion y datos para sostener crecimiento, integridad de informacion y monitoreo operativo.</p>
        <div className="architectureStrip"><span>Presentacion</span><span>Aplicacion</span><span>Datos</span></div>
      </section>

      <form className="loginBox" onSubmit={submit}>
        <div>
          <p className="eyebrow">IAM</p>
          <h2>{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h2>
        </div>
        <div className="authTabs"><button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>Iniciar sesion</button><button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>Crear cuenta</button></div>
        {mode === "register" && <><label className="field"><span>Nombre</span><input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label className="field"><span>Telefono</span><input value={telefono} onChange={(e) => setTelefono(e.target.value)} /></label><label className="field"><span>Rol</span><select value={rol} onChange={(e) => setRol(e.target.value)}>{Object.values(roleDefinitions).map((role) => <option key={role.title} value={role.title}>{role.title}</option>)}</select></label><div className="roleHint">{roleDefinitions[rol].description}</div></>}
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

function DashboardView({ user, availableModules, onOpenModule }) {
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

function FeedView({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [postDraft, setPostDraft] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);
  const userId = user.id || user._id;

  async function loadFeed() {
    setLoading(true);
    setMessage(null);
    try {
      const postsResponse = await apiRequest("/publicaciones_feed?limit=30&sort=-createdAt");
      const loadedPosts = postsResponse.data || [];
      setPosts(loadedPosts);
      const commentEntries = await Promise.all(
        loadedPosts.map(async (post) => {
          const response = await apiRequest(`/comentarios?publicacion_id=${encodeURIComponent(post._id)}&limit=100&sort=createdAt`);
          return [post._id, response.data || []];
        })
      );
      setCommentsByPost(Object.fromEntries(commentEntries));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function createPost(event) {
    event.preventDefault();
    const content = postDraft.trim();
    if (!content && !selectedImage) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiRequest("/publicaciones_feed", {
        method: "POST",
        body: JSON.stringify({
          autor_id: userId,
          tipo_publicacion: "comunicado",
          contenido: content,
          multimedia: selectedImage ? [selectedImage] : [],
          reacciones: [],
          estado: "publicado",
        }),
      });
      setPostDraft("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadFeed();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  function selectImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Solo puedes subir imagenes." });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        tipo: "imagen",
        nombre: file.name,
        url: reader.result,
        size_mb: Number((file.size / 1024 / 1024).toFixed(2)),
      });
    };
    reader.readAsDataURL(file);
  }

  function removeSelectedImage() {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function createComment(postId) {
    const content = (commentDrafts[postId] || "").trim();
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiRequest("/comentarios", {
        method: "POST",
        body: JSON.stringify({
          publicacion_id: postId,
          autor_id: userId,
          texto: content,
          reacciones: [],
        }),
      });
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      await loadFeed();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function reactToPost(post, emoji) {
    const reacciones = addReaction(post.reacciones, emoji, userId);
    setPosts((current) => current.map((item) => item._id === post._id ? { ...item, reacciones } : item));
    try {
      await apiRequest(`/publicaciones_feed/${post._id}`, { method: "PATCH", body: JSON.stringify({ reacciones }) });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      await loadFeed();
    }
  }

  async function reactToComment(postId, comment, emoji) {
    const reacciones = addReaction(comment.reacciones, emoji, userId);
    setCommentsByPost((current) => ({
      ...current,
      [postId]: (current[postId] || []).map((item) => item._id === comment._id ? { ...item, reacciones } : item),
    }));
    try {
      await apiRequest(`/comentarios/${comment._id}`, { method: "PATCH", body: JSON.stringify({ reacciones }) });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      await loadFeed();
    }
  }

  function authorLabel(authorId) {
    return String(authorId) === String(userId) ? user.nombre : "Equipo Translogix";
  }

  function isMine(authorId) {
    return String(authorId) === String(userId);
  }

  async function deleteComment(postId, comment) {
    if (!isMine(comment.autor_id)) return;
    if (!window.confirm("Eliminar tu comentario?")) return;
    setSaving(true);
    try {
      await apiRequest(`/comentarios/${comment._id}`, { method: "DELETE" });
      setCommentsByPost((current) => ({
        ...current,
        [postId]: (current[postId] || []).filter((item) => item._id !== comment._id),
      }));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="feedPage">
      <form className="composer" onSubmit={createPost}>
        <div className="avatar">{user.nombre?.slice(0, 1) || "T"}</div>
        <label className="composerBox">
          <span>Publicar en el feed operativo</span>
          <textarea value={postDraft} onChange={(event) => setPostDraft(event.target.value)} placeholder="Comparte una novedad, incidencia, evidencia o comunicado..." rows={3} />
        </label>
        {selectedImage && (
          <div className="imagePreview">
            <img alt={selectedImage.nombre || "Imagen seleccionada"} src={selectedImage.url} />
            <div>
              <strong>{selectedImage.nombre}</strong>
              <span>{selectedImage.size_mb} MB</span>
            </div>
            <button className="iconButton" onClick={removeSelectedImage} type="button" title="Quitar imagen"><X size={16} /></button>
          </div>
        )}
        <div className="composerActions">
          <input accept="image/*" className="fileInput" onChange={selectImage} ref={fileInputRef} type="file" />
          <button className="secondaryButton" onClick={() => fileInputRef.current?.click()} type="button"><Image size={18} />Imagen</button>
          <button className="primaryButton" disabled={saving || (!postDraft.trim() && !selectedImage)} type="submit">{saving ? <Loader2 className="spin" size={18} /> : <Send size={18} />}Publicar</button>
        </div>
      </form>

      {message && <div className={`notice ${message.type}`}>{message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}<span>{message.text}</span></div>}
      {loading && <div className="feedLoading"><Loader2 className="spin" size={18} />Cargando feed...</div>}

      <div className="feedList">
        {posts.map((post) => (
          <article className="postCard" key={post._id}>
            <header className="postHeader">
              <div className="avatar small">{authorLabel(post.autor_id).slice(0, 1)}</div>
              <div>
                <strong>{authorLabel(post.autor_id)}</strong>
                <span>{post.tipo_publicacion || "publicacion"} | {formatDate(post.createdAt)}</span>
              </div>
            </header>
            <p className="postContent">{post.contenido}</p>
            {Array.isArray(post.multimedia) && post.multimedia.length > 0 && (
              <div className="mediaGrid">{post.multimedia.map((media, index) => media.tipo === "imagen" ? <img alt={media.nombre || "Imagen del feed"} key={`${media.url}-${index}`} src={media.url} /> : <span key={`${media.url}-${index}`}><Image size={16} />{media.tipo}: {media.url}</span>)}</div>
            )}
            <div className="reactionSummary">{renderReactionSummary(post.reacciones)}</div>
            <div className="reactionBar" aria-label="Reacciones de publicacion">
              {reactionOptions.map((reaction) => <button className={userReaction(post.reacciones, userId) === reaction.emoji ? "active" : ""} key={reaction.emoji} onClick={() => reactToPost(post, reaction.emoji)} title={reaction.label} type="button">{reaction.emoji}</button>)}
            </div>

            <section className="commentsBlock">
              {(commentsByPost[post._id] || []).map((comment) => (
                <div className="commentItem" key={comment._id}>
                  <div className="avatar mini">{authorLabel(comment.autor_id).slice(0, 1)}</div>
                  <div className="commentBubble">
                    <div className="commentHeader"><strong>{authorLabel(comment.autor_id)}</strong>{isMine(comment.autor_id) && <button onClick={() => deleteComment(post._id, comment)} type="button">Eliminar</button>}</div>
                    <p>{comment.texto}</p>
                    <div className="commentMeta"><span>{formatDate(comment.createdAt)}</span><span>{renderReactionSummary(comment.reacciones)}</span></div>
                    <div className="miniReactionBar" aria-label="Reacciones de comentario">
                      {reactionOptions.slice(0, 4).map((reaction) => <button className={userReaction(comment.reacciones, userId) === reaction.emoji ? "active" : ""} key={reaction.emoji} onClick={() => reactToComment(post._id, comment, reaction.emoji)} title={reaction.label} type="button">{reaction.emoji}</button>)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="commentComposer">
                <div className="avatar mini">{user.nombre?.slice(0, 1) || "T"}</div>
                <input value={commentDrafts[post._id] || ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post._id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") createComment(post._id); }} placeholder="Escribe un comentario..." />
                <button className="iconButton" onClick={() => createComment(post._id)} disabled={saving || !(commentDrafts[post._id] || "").trim()} type="button" title="Comentar"><Send size={16} /></button>
              </div>
            </section>
          </article>
        ))}
        {!loading && posts.length === 0 && <div className="emptyFeed"><SmilePlus size={22} />Todavia no hay publicaciones.</div>}
      </div>
    </section>
  );
}

function ResourceView({ activeModule, filteredItems, query, setQuery, loading, loadItems, startCreate, startEdit, requestDelete, confirmDelete, cancelDelete, selected, deleteTarget, modalMode, closeModal, message, form, updateField, saveItem, saving }) {
  const isFormModal = modalMode === "create" || modalMode === "edit";
  const isDeleteModal = modalMode === "delete";
  const deleteLabel = deleteTarget?.codigo || deleteTarget?.placa || deleteTarget?.razon_social || deleteTarget?.nombre_completo || deleteTarget?.nombre || deleteTarget?.email || "este registro";

  return (
    <section className="workspace single">
      <div className="listPanel">
        <div className="panelHeader"><div><h2>Registros</h2><span>{filteredItems.length} visibles</span></div><div className="actions"><label className="searchBox"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar" /></label><button className="iconButton" onClick={loadItems} type="button" title="Actualizar">{loading ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}</button><button className="primaryButton" onClick={startCreate} type="button"><Plus size={18} />Nuevo</button></div></div>
        {message && <div className={`notice ${message.type}`}>{message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}<span>{message.text}</span></div>}
        <div className="tableWrap"><table><thead><tr>{activeModule.columns.map((column) => <th key={column}>{fieldLabel(activeModule, column)}</th>)}<th className="tableActions">Acciones</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item._id} className={selected?._id === item._id ? "selectedRow" : ""}>{activeModule.columns.map((column) => <td key={column}>{formatValue(item[column])}</td>)}<td className="tableActions"><button className="iconButton" onClick={() => startEdit(item)} type="button" title="Editar"><Edit3 size={17} /></button><button className="dangerButton" onClick={() => requestDelete(item)} type="button" title="Eliminar"><Trash2 size={17} /></button></td></tr>)}{!loading && filteredItems.length === 0 && <tr><td className="emptyState" colSpan={activeModule.columns.length + 1}>No hay registros para mostrar.</td></tr>}</tbody></table></div>
      </div>

      {isFormModal && (
        <div className="modalOverlay" role="dialog" aria-modal="true">
          <form className="modalPanel" onSubmit={saveItem}>
            <div className="modalHeader"><div><p className="eyebrow">{activeModule.title}</p><h2>{modalMode === "edit" ? "Editar registro" : "Crear registro"}</h2></div><button className="iconButton" onClick={closeModal} type="button" title="Cerrar"><X size={18} /></button></div>
            <div className="formGrid">{activeModule.fields.map((field) => <label className={field.type === "json" ? "field wide" : "field"} key={field.name}><span>{field.label}</span>{field.type === "json" ? <textarea value={form[field.name] || ""} onChange={(event) => updateField(field.name, event.target.value)} rows={7} /> : field.type === "checkbox" ? <input checked={Boolean(form[field.name])} onChange={(event) => updateField(field.name, event.target.checked)} type="checkbox" /> : <input required={field.required} type={field.type || "text"} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} />}</label>)}</div>
            <div className="formActions"><button className="secondaryButton" onClick={closeModal} type="button"><X size={18} />Cancelar</button><button className="primaryButton" disabled={saving} type="submit">{saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}Guardar</button></div>
          </form>
        </div>
      )}

      {isDeleteModal && (
        <div className="modalOverlay" role="dialog" aria-modal="true">
          <section className="modalPanel confirmPanel">
            <div className="modalHeader"><div><p className="eyebrow">Confirmacion</p><h2>Eliminar registro</h2></div><button className="iconButton" onClick={cancelDelete} type="button" title="Cerrar"><X size={18} /></button></div>
            <p>Esta accion eliminara <strong>{deleteLabel}</strong>. Confirma solo si estas seguro.</p>
            <div className="formActions"><button className="secondaryButton" onClick={cancelDelete} type="button">Cancelar</button><button className="dangerTextButton" disabled={loading} onClick={confirmDelete} type="button"><Trash2 size={18} />Eliminar</button></div>
          </section>
        </div>
      )}
    </section>
  );
}

export default function App() {
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
        setMessage({ type: "success", text: "Registro actualizado correctamente." });
      } else {
        await apiRequest(`/${activeModule.key}`, { method: "POST", body: JSON.stringify(payload) });
        setMessage({ type: "success", text: "Registro creado correctamente." });
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
      setMessage({ type: "success", text: "Registro eliminado." });
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
  const pageTitle = isDashboard ? "Dashboard" : isProfile ? "Perfil" : isFeed ? "Feed corporativo" : activeModule?.title;
  const pageDescription = isDashboard ? "Resumen del acceso activo, plan, rol y modulos disponibles." : isProfile ? "Datos de usuario IAM y administracion de suscripcion." : isFeed ? "Publicaciones, comentarios y reacciones internas del equipo logistico." : activeModule?.description;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandMark"><Truck size={22} /></div><div><strong>Translogix</strong><span>{user.rol} | {planDefinitions[user.suscripcion.plan]?.title}</span></div></div>
        <nav className="moduleNav" aria-label="Modulos">
          <button className={isDashboard ? "active" : ""} onClick={() => setActiveKey("dashboard")} type="button"><Gauge size={18} /><span>Dashboard</span></button>
          <button className={isProfile ? "active" : ""} onClick={() => setActiveKey("perfil")} type="button"><UserRound size={18} /><span>Perfil</span></button>
          {groupedModules.map((group) => {
            const Icon = group.icon;
            return <div className="navGroup" key={group.title}><div className="navGroupTitle"><Icon size={14} />{group.title}</div>{group.modules.map((module) => <button className={module.key === activeKey ? "active" : ""} key={module.key} onClick={() => setActiveKey(module.key)} type="button"><Boxes size={18} /><span>{module.title}</span></button>)}</div>;
          })}
        </nav>
      </aside>

      <main className="content">
        <section className="topbar"><div><p className="eyebrow">{user.nombre}</p><h1>{pageTitle}</h1><p>{pageDescription}</p></div><div className="topActions"><div className="statusPill"><Database size={18} /><span>API localhost:3000</span></div><button className="secondaryButton" onClick={logout} type="button"><LogOut size={18} />Salir</button></div></section>

        {isDashboard && <DashboardView user={user} availableModules={availableModules} onOpenModule={setActiveKey} />}
        {isProfile && <ProfileView user={user} onUserChange={setUser} />}
        {isFeed && <FeedView user={user} />}
        {!isDashboard && !isProfile && !isFeed && activeModule && <ResourceView activeModule={activeModule} filteredItems={filteredItems} query={query} setQuery={setQuery} loading={loading} loadItems={loadItems} startCreate={startCreate} startEdit={startEdit} requestDelete={requestDelete} confirmDelete={confirmDelete} cancelDelete={cancelDelete} selected={selected} deleteTarget={deleteTarget} modalMode={modalMode} closeModal={closeModal} message={message} form={form} updateField={updateField} saveItem={saveItem} saving={saving} />}
      </main>
    </div>
  );
}

