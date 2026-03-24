"use client";

import { Header } from "@/app/dashboard/_components/Header";
import { RevenueChart } from "@/app/dashboard/_components/RevenueChart";
import { UsersBarChart } from "@/app/dashboard/_components/UsersBarChart";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Activity, CreditCard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Dashboard"
        description="Overview of your total revenue and active users."
      />

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground mt-1">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Sales
                </p>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground mt-1">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Now
                </p>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground mt-1">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <UsersBarChart />
        </div>
      </main>
    </div>
  );
}
