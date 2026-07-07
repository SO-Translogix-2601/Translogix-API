import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, ShieldCheck, Truck, UserPlus, X } from "lucide-react";
import { apiRequest, setSession } from "../api.js";
import { roleDefinitions } from "../config/roles.js";

export function AuthScreen({ onAuth }) {
  const { t } = useTranslation();
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
        <div className="brand big"><div className="brandMark"><Truck size={24} /></div><div><strong>{t("auth.brand")}</strong><span>{t("auth.tagline")}</span></div></div>
        <h1>{t("auth.heroTitle")}</h1>
        <p>{t("auth.heroBody")}</p>
        <div className="architectureStrip"><span>{t("auth.layerPresentation")}</span><span>{t("auth.layerApplication")}</span><span>{t("auth.layerData")}</span></div>
      </section>

      <form className="loginBox" onSubmit={submit}>
        <div>
          <p className="eyebrow">{t("auth.iam")}</p>
          <h2>{mode === "login" ? t("auth.login") : t("auth.register")}</h2>
        </div>
        <div className="authTabs"><button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>{t("auth.login")}</button><button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>{t("auth.register")}</button></div>
        {mode === "register" && <><label className="field"><span>{t("auth.name")}</span><input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label className="field"><span>{t("auth.phone")}</span><input value={telefono} onChange={(e) => setTelefono(e.target.value)} /></label><label className="field"><span>{t("auth.role")}</span><select value={rol} onChange={(e) => setRol(e.target.value)}>{Object.keys(roleDefinitions).map((key) => <option key={key} value={key}>{t(`roles.${key}.title`)}</option>)}</select></label><div className="roleHint">{t(`roles.${rol}.description`)}</div></>}
        <label className="field"><span>{t("auth.email")}</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")} required /></label>
        <label className="field"><span>{t("auth.password")}</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.passwordPlaceholder")} required minLength={6} /></label>
        {error && <div className="notice error"><X size={18} /><span>{error}</span></div>}
        <button className="primaryButton full" disabled={loading} type="submit">{loading ? <Loader2 className="spin" size={18} /> : mode === "login" ? <ShieldCheck size={18} /> : <UserPlus size={18} />}{mode === "login" ? t("auth.submitLogin") : t("auth.submitRegister")}</button>
      </form>
    </main>
  );
}
