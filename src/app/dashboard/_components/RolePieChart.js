"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { name: "Users", value: 20, color: "#6366f1" },
  { name: "Managers", value: 15, color: "#8b5cf6" },
  { name: "Admins", value: 10, color: "#a78bfa" },
  { name: "Superadmins", value: 5, color: "#c4b5fd" },
];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xl shadow-black/5">
        <p className="text-xs text-muted-foreground mb-0.5">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].value} users
        </p>
      </div>
    );
  }
  return null;
}

export function RolePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Distribution</CardTitle>
        <CardDescription>Users by role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
