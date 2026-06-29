"use client";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // mendeteksi ukuran layar
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // sidebar yang digunakan Website
  const sidebarCollapsed = isTablet || isCollapsed;

  return (
    <div className="flex">
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="flex-1">
        <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
