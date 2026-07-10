const API_BASE = "http://localhost:8000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hermaa_token");
}

async function request(method: string, endpoint: string, body?: unknown) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts: RequestInit = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    if (res.status === 401) {
      localStorage.removeItem("hermaa_token");
      localStorage.removeItem("hermaa_user");
      window.location.href = "/auth/login";
      return null;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Request failed (${res.status})`);
    }
    return await res.json();
  } catch (e: unknown) {
    const error = e as Error;
    if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
      console.warn("Backend unavailable");
      return null;
    }
    throw e;
  }
}

export const api = {
  // Auth
  async register(name: string, email: string, age: number, language: string) {
    const data = await request("POST", "/auth/register", { name, email, age, language });
    if (data?.access_token) {
      localStorage.setItem("hermaa_token", data.access_token);
      localStorage.setItem("hermaa_user", JSON.stringify({ name: data.name, email, age, language, userId: data.user_id }));
    }
    return data;
  },

  async login(email: string, password: string) {
    const data = await request("POST", "/auth/login", { email, password, provider: "email" });
    if (data?.access_token) {
      localStorage.setItem("hermaa_token", data.access_token);
      localStorage.setItem("hermaa_user", JSON.stringify({ name: data.name, email, userId: data.user_id }));
    }
    return data;
  },

  // Cycle
  async getCycleStatus() {
    return await request("GET", "/cycle/status");
  },

  async logCycle(data: { date: string; flow?: string; mood?: string; symptoms?: string[]; pain_level?: number }) {
    return await request("POST", "/cycle/log", data);
  },

  async getPredictions() {
    return await request("GET", "/cycle/predictions");
  },

  async getHealthScore() {
    return await request("GET", "/cycle/health-score");
  },

  async getInsights() {
    return await request("GET", "/cycle/insights");
  },

  // AI
  async chat(message: string, language = "en", context?: Record<string, unknown>) {
    return await request("POST", "/ai/chat", { message, language, context });
  },

  async resetChat() {
    return await request("POST", "/ai/reset-chat");
  },

  async getSuggestions() {
    return await request("GET", "/ai/suggested-questions");
  },

  // User
  async getProfile() {
    return await request("GET", "/user/profile");
  },

  async updateProfile(data: Record<string, unknown>) {
    return await request("PUT", "/user/profile", data);
  },

  // Health check
  async checkHealth() {
    try {
      const res = await fetch("http://localhost:8000/health");
      return res.ok;
    } catch {
      return false;
    }
  },
};
