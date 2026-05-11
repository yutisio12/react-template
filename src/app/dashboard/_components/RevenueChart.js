"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6800 },
  { month: "Jun", revenue: 8400 },
  { month: "Jul", revenue: 7900 },
  { month: "Aug", revenue: 9200 },
  { month: "Sep", revenue: 8600 },
  { month: "Oct", revenue: 10400 },
  { month: "Nov", revenue: 11200 },
  { month: "Dec", revenue: 12800 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xl shadow-black/5">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-bold text-primary">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff", fill: "var(--color-chart-1)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
