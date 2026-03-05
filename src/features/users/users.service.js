import { api } from "@/lib/api";

export const usersService = {
  async getUsers({ page = 1, pageSize = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      search,
      sortBy,
      sortOrder,
    });
    return api.get(`/api/users?${params.toString()}`);
  },

  async createUser({ name, email, password, role }) {
    return api.post("/api/users", { name, email, password, role });
  },
};
