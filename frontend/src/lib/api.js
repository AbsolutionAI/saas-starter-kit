const API_BASE = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("token");
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const authApi = {
  signup: (body) => api("/api/auth/signup", { method: "POST", body }),
  login: (body) => api("/api/auth/login", { method: "POST", body }),
  me: () => api("/api/auth/me"),
};

export const billingApi = {
  plans: () => api("/api/subscriptions/plans"),
  current: () => api("/api/subscriptions/current"),
  checkout: (priceId) =>
    api("/api/subscriptions/create-checkout", { method: "POST", body: { priceId } }),
  portal: () => api("/api/subscriptions/create-portal", { method: "POST" }),
};

export const keysApi = {
  list: () => api("/api/keys"),
  create: (name) => api("/api/keys", { method: "POST", body: { name } }),
  remove: (id) => api(`/api/keys/${id}`, { method: "DELETE" }),
};
