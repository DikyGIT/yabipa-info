"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarMenus } from "@/constants/sidebar-menu";

import { AiOutlineHome } from "react-icons/ai";

type SidebarProps = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  // Menangkap Url
  const pathname = usePathname();

  return (
    <div
      className={`bg-sky-950 min-h-screen transition-all ${isCollapsed ? "w-20" : "w-72"}`}
    >
      {/* Logo */}
      <div
        className={`logo flex gap-2 items-center ${isCollapsed ? "justify-center" : "px-10"} py-7`}
      >
        <Image
          src={"/images/logo.webp"}
          alt="Logo"
          width={40}
          height={40}
          loading="eager"
          className="w-auto h-auto"
        />
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-xl text-white">YABIPA</h1>
            <p className="opacity-50 text-white">PONPES QUR`AN</p>
          </div>
        )}
      </div>
      <hr className="text-white/20" />

      {/* Menu Dashboard */}
      <Link
        href="/dashboard"
        className={`mt-6 ${pathname === "/dashboard" ? "bg-sky-600" : ""} mx-5 rounded ${isCollapsed ? "p-2 justify-center" : "p-3 pl-4"}  flex items-center gap-3`}
      >
        <AiOutlineHome className="text-white text-2xl" />
        {!isCollapsed && <p className="text-white text-lg">Dashboard</p>}
      </Link>

      {/* Menu Utama */}
      <div className="menu-utama mt-8 mx-5">
        <h1
          className={`text-white/50 mb-3 ${isCollapsed ? "hidden" : "block"}`}
        >
          Menu Utama
        </h1>

        <div className="flex flex-col gap-4">
          {sidebarMenus.map((menu, index) => {
            const Icon = menu.icon;

            return (
              <Link
                href={menu.href}
                key={index}
                className={`rounded ${isCollapsed ? "p-2 justify-center" : "p-3 pl-4"} flex items-center gap-3 ${pathname === menu.href ? "bg-sky-600" : ""}`}
              >
                <Icon className="text-white text-2xl" />
                {!isCollapsed && (
                  <span className="text-white text-lg">{menu.title}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
