"use client";

import { useAuth } from "@/features/auth/auth.context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header({ title, description }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-border/50 glass">
      <div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 w-56 h-9 bg-muted/50 border-0 focus-visible:ring-1 text-sm rounded-xl"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted/80 transition-colors cursor-pointer group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background" />
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-border/50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <Badge variant="secondary" className="text-[10px] capitalize px-1.5 py-0">
                {user.role}
              </Badge>
            </div>
            <Avatar className="h-9 w-9 ring-2 ring-primary/10">
              <AvatarFallback name={user.name} className="text-xs bg-primary/10 text-primary font-semibold" />
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
