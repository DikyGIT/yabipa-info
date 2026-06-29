"use client";

import { useSession } from "next-auth/react";

const dataKurikulum = [
  { label: "Data 1", href: "/data/kurikulum/1" },
  { label: "Data 2", href: "/data/kurikulum/2" },
  { label: "Data 3", href: "/data/kurikulum/3" },
  { label: "Data 4", href: "/data/kurikulum/4" },
  { label: "Data 5", href: "/data/kurikulum/5" },
  { label: "Data 6", href: "/data/kurikulum/6" },
];

const dataKeguruan = [
  { label: "Struktur Organisasi", href: "/data/keguruan/1" },
  { label: "Data 2", href: "/data/keguruan/2" },
  { label: "Data 3", href: "/data/keguruan/3" },
  { label: "Data 4", href: "/data/keguruan/4" },
  { label: "Data 5", href: "/data/keguruan/5" },
  { label: "Data 6", href: "/data/keguruan/6" },
];

const dataKesiswaan = [
  { label: "Kelas 7", href: "/data/kesiswaan/7" },
  { label: "Kelas 8", href: "/data/kesiswaan/8" },
  { label: "Kelas 9", href: "/data/kesiswaan/9" },
  { label: "Kelas 10", href: "/data/kesiswaan/10" },
  { label: "Kelas 11", href: "/data/kesiswaan/11" },
  { label: "Kelas 12", href: "/data/kesiswaan/12" },
];

const DataSection = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;

  // Kepala: semua data, Guru: hanya kurikulum & keguruan, Belum login: semua
  const showKesiswaan = role !== "GURU";

  return (
    <div className="kumpulan-data sm:py-20 py-10" id="data">
      <h1 className="text-5xl/tight font-bold mb-5 text-center">
        Kumpulan Data
      </h1>
      <p className="lg:text-lg/loose text-base/loose text-center">
        Berikut ini merupakan kumpulan data yang dapat diakses.
      </p>

      <div className="mt-16 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {/* Kurikulum - semua bisa akses */}
        <div className="kurikulum">
          <h1 className="text-center font-bold text-xl">Kurikulum</h1>
          <div className="flex flex-col gap-3 mt-6">
            {dataKurikulum.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Keguruan - semua bisa akses */}
        <div className="keguruan">
          <h1 className="text-center font-bold text-xl">Keguruan</h1>
          <div className="flex flex-col gap-3 w-fit mx-auto mt-6">
            {dataKeguruan.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Kesiswaan - hanya kepala & belum login */}
        <div className="kesiswaan">
          <h1 className="text-center font-bold text-xl">Kesiswaan</h1>
          <div className="flex flex-col gap-3 w-fit mx-auto mt-6">
            {showKesiswaan ? (
              dataKesiswaan.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  {item.label}
                </a>
              ))
            ) : (
              <p className="text-center text-gray-400 italic">
                Akses terbatas untuk role Guru
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSection;
