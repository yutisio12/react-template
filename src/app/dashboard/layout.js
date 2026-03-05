"use client";

import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
