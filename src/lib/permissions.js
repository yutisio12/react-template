import { ROLE_PERMISSIONS } from "@/mock/roles";

export function hasPermission(user, permission) {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

export function hasRole(user, role) {
  if (!user || !user.role) return false;
  return user.role === role;
}

export function hasAnyPermission(user, permissions) {
  if (!user || !user.permissions) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

export { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from "@/mock/roles";
