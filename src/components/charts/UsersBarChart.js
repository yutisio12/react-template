"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { month: "Jan", newUsers: 120, activeUsers: 890 },
  { month: "Feb", newUsers: 145, activeUsers: 920 },
  { month: "Mar", newUsers: 98, activeUsers: 950 },
  { month: "Apr", newUsers: 178, activeUsers: 1020 },
  { month: "May", newUsers: 156, activeUsers: 1080 },
  { month: "Jun", newUsers: 203, activeUsers: 1150 },
  { month: "Jul", newUsers: 189, activeUsers: 1220 },
  { month: "Aug", newUsers: 234, activeUsers: 1340 },
  { month: "Sep", newUsers: 212, activeUsers: 1410 },
  { month: "Oct", newUsers: 267, activeUsers: 1520 },
  { month: "Nov", newUsers: 289, activeUsers: 1650 },
  { month: "Dec", newUsers: 312, activeUsers: 1800 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name === "newUsers" ? "New Users" : "Active Users"}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function UsersBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New vs active users per month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="newUsers"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="activeUsers"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
