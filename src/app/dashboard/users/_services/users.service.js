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

  async getUser(id) {
    return api.get(`/api/users/${id}`);
  },

  async createUser({ name, email, password, role }) {
    return api.post("/api/users", { name, email, password, role });
  },

  async updateUser(id, data) {
    return api.put(`/api/users/${id}`, data);
  },

  async deleteUser(id) {
    return api.delete(`/api/users/${id}`);
  },

  async importUsers(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/users/import", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Import failed");
    return data;
  },

  async exportExcel() {
    const response = await fetch("/api/users/export?format=excel");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Export failed");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  },

  async exportPDF() {
    const response = await fetch("/api/users/export?format=pdf");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Export failed");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  },

  async uploadPhoto(formData) {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
};
