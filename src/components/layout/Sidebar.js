"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/auth.context";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS } from "@/mock/roles";
import { APP_CONFIG } from "@/config/app";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    permission: PERMISSIONS.VIEW_USERS,
  },
  {
    label: "Admin",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    permission: PERMISSIONS.VIEW_ADMIN_PAGE,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = navItems.filter(
    (item) => user && hasPermission(user, item.permission)
  );

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-sm shrink-0">
          SA
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight">
            {APP_CONFIG.name}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User Info + Logout */}
      <div className="p-3 space-y-2">
        {user && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback name={user.name} className="text-xs" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {user.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full border bg-background shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}
