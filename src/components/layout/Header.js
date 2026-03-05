"use client";

import { useAuth } from "@/features/auth/auth.context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export function Header({ title, description }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Indicator */}
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors duration-200 cursor-pointer">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </button>

        {/* User Badge */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <Badge variant="secondary" className="text-[10px] capitalize">
                {user.role}
              </Badge>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback name={user.name} className="text-xs" />
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
