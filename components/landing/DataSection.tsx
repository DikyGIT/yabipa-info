"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type Dokumen = {
  id: string;
  nama: string;
  link: string;
  aksesRole: string;
};

const DataSection = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const url = role
        ? `/api/dokumen?role=${role}`
        : "/api/dokumen";
      const res = await fetch(url);
      const data = await res.json();
      setDokumenList(data);
      setLoading(false);
    }
    void load();
  }, [role]);

  return (
    <div className="kumpulan-data sm:py-20 py-10" id="data">
      <h1 className="text-5xl/tight font-bold mb-5 text-center">
        Kumpulan Data
      </h1>
      <p className="lg:text-lg/loose text-base/loose text-center">
        Berikut ini merupakan kumpulan data yang dapat diakses.
      </p>

      {loading ? (
        <p className="text-center text-gray-400 mt-10">Memuat data...</p>
      ) : dokumenList.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">Belum ada data tersedia.</p>
      ) : (
        <div className="mt-16 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {dokumenList.map((dokumen) => (
            <div
              key={dokumen.id}
              className="bg-white shadow rounded-tr-2xl rounded-tl-2xl p-7 text-center"
            >
              <h1 className="text-xl font-bold mb-2">{dokumen.nama}</h1>
              <a
                href={dokumen.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-sky-800 hover:bg-sky-900 text-white p-2 rounded mt-4"
              >
                Buka Dokumen
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSection;
