"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, Cpu, HardDrive, Clock, ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.get("/api/admin/stats");
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="System Administration" />
        <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="System Administration"
        description="Superadmin only view. System statistics and health monitoring."
      />

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        ) : (
          <>
            {/* System Info */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  System Health
                </CardTitle>
                <CardDescription>Current runtime environment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Cpu className="h-4 w-4" /> CPU Usage
                    </p>
                    <p className="text-2xl font-bold">{stats.systemInfo.cpuUsage}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <HardDrive className="h-4 w-4" /> Memory
                    </p>
                    <p className="text-2xl font-bold">{stats.systemInfo.memoryUsage}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Clock className="h-4 w-4" /> Uptime
                    </p>
                    <p className="text-2xl font-bold">{stats.systemInfo.uptime}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Server className="h-4 w-4" /> Version
                    </p>
                    <p className="text-2xl font-bold">v{stats.systemInfo.version}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                  <CardDescription>Users per RBAC role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.roleDistribution).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className="capitalize font-medium">{role}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(count / stats.totalUsers) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Active vs inactive accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.statusDistribution).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="capitalize font-medium">{status}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${status === "active" ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              style={{
                                width: `${(count / stats.totalUsers) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
