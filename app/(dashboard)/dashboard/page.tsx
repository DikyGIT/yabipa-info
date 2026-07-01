"use client";

import { useState, useEffect } from "react";
import { LuNewspaper } from "react-icons/lu";
import { FaFolder, FaUsers, FaUserShield, FaUserTie, FaChalkboardTeacher } from "react-icons/fa";

type Stats = {
  totalUser: number;
  totalBerita: number;
  totalDokumen: number;
  admin: number;
  kepala: number;
  guru: number;
};

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    void fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const cards = stats
    ? [
        { label: "Total Berita", value: stats.totalBerita, icon: LuNewspaper, color: "bg-blue-500" },
        { label: "Total Dokumen", value: stats.totalDokumen, icon: FaFolder, color: "bg-green-500" },
        { label: "Total User", value: stats.totalUser, icon: FaUsers, color: "bg-purple-500" },
        { label: "Admin", value: stats.admin, icon: FaUserShield, color: "bg-red-500" },
        { label: "Kepala Sekolah", value: stats.kepala, icon: FaUserTie, color: "bg-yellow-500" },
        { label: "Guru", value: stats.guru, icon: FaChalkboardTeacher, color: "bg-teal-500" },
      ]
    : [];

  return (
    <div className="mt-5 ml-5">
      {/* Welcome */}
      <div className="bg-white shadow rounded p-10">
        <h1 className="text-3xl font-bold mb-3">Selamat Datang, Admin 👋</h1>
        <p className="text-lg font-medium opacity-50">
          Kelola Konten Website Yabipa dengan Mudah.
        </p>
      </div>

      {/* Statistik */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats
          ? cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white shadow rounded-lg p-5 text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${card.color} text-white mb-3`}>
                    <Icon className="text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold">{card.value}</h2>
                  <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                </div>
              );
            })
          : Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white shadow rounded-lg p-5 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1" />
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
              </div>
            ))}
      </div>
    </div>
  );
};

export default DashboardPage;
