"use client";

import { Header } from "@/app/dashboard/_components/Header";
import { RevenueChart } from "@/app/dashboard/_components/RevenueChart";
import { UsersBarChart } from "@/app/dashboard/_components/UsersBarChart";
import { RolePieChart } from "@/app/dashboard/_components/RolePieChart";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Activity, CreditCard, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    gradient: "gradient-primary",
    iconBg: "bg-white/20",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    gradient: "gradient-success",
    iconBg: "bg-white/20",
  },
  {
    title: "Sales",
    value: "12,234",
    change: "+19%",
    trend: "up",
    icon: CreditCard,
    gradient: "gradient-info",
    iconBg: "bg-white/20",
  },
  {
    title: "Active Now",
    value: "573",
    change: "+201",
    trend: "up",
    icon: Activity,
    gradient: "gradient-rose",
    iconBg: "bg-white/20",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Dashboard"
        description="Overview of your total revenue and active users."
      />

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div className={`${stat.gradient} p-5 text-white relative overflow-hidden`}>
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-white/80">
                        {stat.title}
                      </p>
                      <div className={`${stat.iconBg} p-2 rounded-xl`}>
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    <div className="flex items-center gap-1 mt-1.5">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-white/80" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-white/80" />
                      )}
                      <p className="text-xs text-white/80 font-medium">
                        {stat.change} from last month
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RevenueChart />
          <UsersBarChart />
        </div>

        {/* Pie Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <RolePieChart />
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold">Recent Activity</h3>
                  <span className="text-xs text-muted-foreground">Last 24 hours</span>
                </div>
                <div className="space-y-1">
                  {[
                    { action: "New user registered", detail: "john@example.com", time: "2 min ago", icon: Users, color: "bg-indigo-100 text-indigo-600" },
                    { action: "Sales report generated", detail: "Q4 2024 report", time: "1 hour ago", icon: CreditCard, color: "bg-blue-100 text-blue-600" },
                    { action: "System backup completed", detail: "2.4GB archived", time: "3 hours ago", icon: Activity, color: "bg-emerald-100 text-emerald-600" },
                    { action: "Payment received", detail: "$1,250.00 from Acme Inc.", time: "5 hours ago", icon: DollarSign, color: "bg-amber-100 text-amber-600" },
                    { action: "New user registered", detail: "sarah@example.com", time: "8 hours ago", icon: Users, color: "bg-indigo-100 text-indigo-600" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
