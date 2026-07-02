"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";

const Navbar = () => {
  const { data: session } = useSession();

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
    <div className="navbar">
      <div className="container px-4 mx-auto">
        <div className="navbar-box flex justify-between items-center py-7">
          <div className="logo">
            <a href="#beranda">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={50}
                height={50}
                className="w-auto h-auto"
              />
            </a>
          </div>
          <ul className="menu flex sm:space-x-8 space-x-3">
            <li>
              <a href="#tentang" className="hover:underline text-base sm:text-lg">Tentang</a>
            </li>
            <li>
              <a href="#berita" className="hover:underline text-base sm:text-lg">Berita</a>
            </li>
            <li className="sm:block hidden">
              <a href="#program" className="hover:underline text-base sm:text-lg">Program</a>
            </li>
            <li>
              <a href="#data" className="hover:underline text-base sm:text-lg">Data</a>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            {session ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded cursor-pointer hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <a href="/login" className="underline text-xl">Login</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
