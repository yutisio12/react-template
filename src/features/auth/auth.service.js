import { api } from "@/lib/api";

export const authService = {
  async login(email, password) {
    return api.post("/api/auth/login", { email, password });
  },

  async register({ name, email, password, role }) {
    return api.post("/api/auth/register", { name, email, password, role });
  },

  async verifyMfa(email, code) {
    return api.post("/api/auth/verify-mfa", { email, code });
  },

  async getMe() {
    return api.get("/api/auth/me");
  },

  async logout() {
    return api.post("/api/auth/logout", {});
  },
};
