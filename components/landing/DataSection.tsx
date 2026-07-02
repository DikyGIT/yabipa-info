"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type Dokumen = {
  id: string;
  nama: string;
  link: string;
  kategori: string;
  aksesRole: string;
};

const KATEGORI = ["Semua", "Kurikulum", "Keguruan", "Kesiswaan"];

const DataSection = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;

  useEffect(() => {
    async function load() {
      const url = role ? `/api/dokumen?role=${role}` : "/api/dokumen";
      const res = await fetch(url);
      const data = await res.json();
      setDokumenList(data);
      setLoading(false);
    }
    void load();
  }, [role]);

  const handleFilter = (value: string) => {
    setActiveKategori(value);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filtered = dokumenList.filter((d) => {
    const matchKategori = activeKategori === "Semua" || d.kategori === activeKategori;
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="kumpulan-data sm:py-20 py-10" id="data">
      <h1 className="text-5xl/tight font-bold mb-5 text-center">
        Kumpulan Data
      </h1>
      <p className="lg:text-lg/loose text-base/loose text-center">
        Berikut ini merupakan kumpulan data yang dapat diakses.
      </p>

      {/* Filter + Search */}
      {dokumenList.length > 0 && (
        <div className="flex justify-center items-center mt-8 gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-800 text-sm"
          />
          <select
            value={activeKategori}
            onChange={(e) => handleFilter(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-800 text-sm"
          >
            {KATEGORI.map((kat) => (
              <option key={kat} value={kat}>{kat}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 mt-10">Memuat data...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">Belum ada data tersedia.</p>
      ) : (
        <>
          <div className="mt-8 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {paged.map((dokumen) => (
              <a
                key={dokumen.id}
                href={dokumen.link}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-sky-800 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg p-4 flex items-center gap-3"
              >
                <span className="font-bold text-lg">{dokumen.nama}</span>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border cursor-pointer ${
                    currentPage === page
                      ? "bg-sky-800 text-white border-sky-800"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataSection;
