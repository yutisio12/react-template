import { ROLES, ROLE_PERMISSIONS } from "./roles";

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const DEMO_TOTP_SECRETS = {
  superadmin: "JBSWY3DPEHPK3PXP",
  admin: "JBSWY3DPEHPK3PXQ",
  manager: "JBSWY3DPEHPK3PXR",
  user: "JBSWY3DPEHPK3PXS",
};

const initialUsers = [
  {
    id: "usr_superadmin_001",
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "password123",
    role: ROLES.SUPERADMIN,
    permissions: ROLE_PERMISSIONS[ROLES.SUPERADMIN],
    totpSecret: DEMO_TOTP_SECRETS.superadmin,
    mfaEnabled: true,
    status: "active",
    createdAt: "2024-01-15T08:00:00.000Z",
    lastLogin: "2024-03-01T10:30:00.000Z",
  },
  {
    id: "usr_admin_002",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: ROLES.ADMIN,
    permissions: ROLE_PERMISSIONS[ROLES.ADMIN],
    totpSecret: DEMO_TOTP_SECRETS.admin,
    mfaEnabled: true,
    status: "active",
    createdAt: "2024-02-01T09:00:00.000Z",
    lastLogin: "2024-03-02T14:15:00.000Z",
  },
  {
    id: "usr_manager_003",
    name: "Manager User",
    email: "manager@example.com",
    password: "password123",
    role: ROLES.MANAGER,
    permissions: ROLE_PERMISSIONS[ROLES.MANAGER],
    totpSecret: DEMO_TOTP_SECRETS.manager,
    mfaEnabled: true,
    status: "active",
    createdAt: "2024-02-10T11:00:00.000Z",
    lastLogin: "2024-03-03T09:45:00.000Z",
  },
  {
    id: "usr_user_004",
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    role: ROLES.USER,
    permissions: ROLE_PERMISSIONS[ROLES.USER],
    totpSecret: DEMO_TOTP_SECRETS.user,
    mfaEnabled: true,
    status: "active",
    createdAt: "2024-03-01T13:00:00.000Z",
    lastLogin: "2024-03-04T08:00:00.000Z",
  },
];

const additionalUsers = Array.from({ length: 46 }, (_, i) => ({
  id: `usr_gen_${String(i + 5).padStart(3, "0")}`,
  name: `User ${i + 5}`,
  email: `user${i + 5}@example.com`,
  password: "password123",
  role: [ROLES.USER, ROLES.MANAGER, ROLES.ADMIN][i % 3],
  permissions: ROLE_PERMISSIONS[[ROLES.USER, ROLES.MANAGER, ROLES.ADMIN][i % 3]],
  totpSecret: `JBSWY3DPEHPK3P${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}`,
  mfaEnabled: true,
  status: i % 7 === 0 ? "inactive" : "active",
  createdAt: new Date(2024, 0, 15 + i).toISOString(),
  lastLogin: new Date(2024, 2, 1 + (i % 28)).toISOString(),
}));

let users = [...initialUsers, ...additionalUsers];

export function findUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}

export function getAllUsers({ page = 1, pageSize = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = {}) {
  let filtered = [...users];

  if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch) ||
        u.role.toLowerCase().includes(lowerSearch)
    );
  }

  filtered.sort((a, b) => {
    const aVal = a[sortBy] || "";
    const bVal = b[sortBy] || "";
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data: data.map(({ password, totpSecret, ...user }) => user),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function createUser({ name, email, password, role }) {
  const existing = findUserByEmail(email);
  if (existing) {
    return { error: "Email already exists" };
  }

  const newUser = {
    id: generateId(),
    name,
    email,
    password,
    role,
    permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.USER],
    totpSecret: `JBSWY3DPEHPK3P${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
    mfaEnabled: true,
    status: "active",
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  users = [...users, newUser];

  const { password: _, totpSecret: __, ...safeUser } = newUser;
  return { user: safeUser, totpSecret: newUser.totpSecret };
}

export function getStats() {
  const roleCount = {};
  const statusCount = { active: 0, inactive: 0 };

  users.forEach((u) => {
    roleCount[u.role] = (roleCount[u.role] || 0) + 1;
    statusCount[u.status] = (statusCount[u.status] || 0) + 1;
  });

  return {
    totalUsers: users.length,
    roleDistribution: roleCount,
    statusDistribution: statusCount,
    systemInfo: {
      version: "1.0.0",
      environment: "demo",
      uptime: "72h 14m",
      memoryUsage: "256MB / 1GB",
      cpuUsage: "12%",
      lastDeployment: "2024-03-04T12:00:00.000Z",
    },
  };
}
