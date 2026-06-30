import { LuNewspaper } from "react-icons/lu";
import { FaFolder, FaUsers } from "react-icons/fa";

export const sidebarMenus = [
  {
    title: "Berita",
    href: "/dashboard/berita",
    icon: LuNewspaper,
  },
  {
    title: "Dokumen",
    href: "/dashboard/dokumen",
    icon: FaFolder,
  },
  {
    title: "Kelola User",
    href: "/dashboard/users",
    icon: FaUsers,
  },
];
