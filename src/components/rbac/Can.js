"use client";

import { useAuth } from "@/features/auth/auth.context";
import { hasPermission } from "@/lib/permissions";

export function Can({ permission, children, fallback = null }) {
  const { user } = useAuth();

  if (!user) return fallback;

  if (!hasPermission(user, permission)) return fallback;

  return children;
}
