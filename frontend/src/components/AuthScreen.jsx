import { useState } from "react";
import { Loader2, ShieldCheck, Truck, UserPlus, X } from "lucide-react";
import { apiRequest, setSession } from "../api.js";
import { roleDefinitions } from "../config/roles.js";

export function AuthScreen({ onAuth }) {
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
