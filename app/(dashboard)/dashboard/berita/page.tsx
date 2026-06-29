"use client";

import { useState, useEffect } from "react";

type Berita = {
  id: string;
  judul: string;
  kategori: string | null;
  pj: string | null;
  tanggal: string;
  createdAt: string;
};

const BeritaPage = () => {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [pj, setPj] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch berita
  const loadBerita = async () => {
    const res = await fetch("/api/berita");
    const data = await res.json();
    setBeritaList(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadBerita();
  }, []);

  // Reset form
  const resetForm = () => {
    setJudul("");
    setKategori("");
    setPj("");
    setTanggal("");
    setEditId(null);
    setError("");
    setSuccess("");
  };

  // Submit form (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const body = { judul, kategori, pj, tanggal };

    let res;
    if (editId) {
      res = await fetch(`/api/berita/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch("/api/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan berita");
      return;
    }

    setSuccess(editId ? "Berita berhasil diupdate!" : "Berita berhasil ditambahkan!");
    resetForm();
    loadBerita();
  };

  // Edit berita
  const handleEdit = (berita: Berita) => {
    setEditId(berita.id);
    setJudul(berita.judul);
    setKategori(berita.kategori || "");
    setPj(berita.pj || "");
    setTanggal(berita.tanggal.split("T")[0]);
    setError("");
    setSuccess("");
  };

  // Hapus berita
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    await fetch(`/api/berita/${id}`, { method: "DELETE" });
    loadBerita();
  };

  // Format tanggal
  const formatTanggal = (t: string) => {
    return new Date(t).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Berita</h1>

      {/* Form Tambah/Edit Berita */}
      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">{editId ? "Edit Berita" : "Tambah Berita"}</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="judul" className="mb-1">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan judul berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="kategori" className="mb-1">
                Kategori Berita <span className="opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                id="kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="Masukkan kategori berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="pj" className="mb-1">
                Penanggung Jawab <span className="opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                id="pj"
                value={pj}
                onChange={(e) => setPj(e.target.value)}
                placeholder="Masukkan pj berita"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="tanggal" className="mb-1">
                Tanggal Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="tanggal"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-800 text-white py-2 px-6 rounded-md hover:bg-blue-900 hover:cursor-pointer"
            >
              {editId ? "Update" : "Simpan"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 hover:cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel Berita */}
      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold mb-4">Tabel Berita</h1>
        {loading ? (
          <p>Memuat data...</p>
        ) : beritaList.length === 0 ? (
          <p className="text-gray-500">Belum ada berita.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Judul</th>
                  <th className="p-3 border">Kategori</th>
                  <th className="p-3 border">PJ</th>
                  <th className="p-3 border">Tanggal</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {beritaList.map((berita, index) => (
                  <tr key={berita.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{berita.judul}</td>
                    <td className="p-3 border">{berita.kategori || "-"}</td>
                    <td className="p-3 border">{berita.pj || "-"}</td>
                    <td className="p-3 border">{formatTanggal(berita.tanggal)}</td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(berita)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(berita.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeritaPage;
