export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function getToken() {
  return localStorage.getItem("translogix_token");
}

export function setSession(token, user) {
  localStorage.setItem("translogix_token", token);
  localStorage.setItem("translogix_user", JSON.stringify(user));
}

export function getStoredUser() {
  const raw = localStorage.getItem("translogix_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("translogix_token");
  localStorage.removeItem("translogix_user");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "No se pudo completar la solicitud");
  }

  return payload;
}
