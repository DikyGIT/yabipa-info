"use client";

import { MdMenuOpen } from "react-icons/md";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";

type HeaderProps = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ isCollapsed, setIsCollapsed }: HeaderProps) => {
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <MdMenuOpen
          className="text-4xl"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-2 rounded cursor-pointer hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
