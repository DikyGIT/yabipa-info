"use client";

import { useState, useEffect } from "react";

type Dokumen = {
  id: string;
  nama: string;
  link: string;
  createdAt: string;
};

const DokumenPage = () => {
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [nama, setNama] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch dokumen
  const loadDokumen = async () => {
    const res = await fetch("/api/dokumen");
    const data = await res.json();
    setDokumenList(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadDokumen();
  }, []);

  // Reset form
  const resetForm = () => {
    setNama("");
    setLink("");
    setEditId(null);
    setError("");
    setSuccess("");
  };

  // Submit form (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const body = { nama, link };

    let res;
    if (editId) {
      res = await fetch(`/api/dokumen/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch("/api/dokumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan dokumen");
      return;
    }

    setSuccess(editId ? "Dokumen berhasil diupdate!" : "Dokumen berhasil ditambahkan!");
    resetForm();
    loadDokumen();
  };

  // Edit dokumen
  const handleEdit = (dokumen: Dokumen) => {
    setEditId(dokumen.id);
    setNama(dokumen.nama);
    setLink(dokumen.link);
    setError("");
    setSuccess("");
  };

  // Hapus dokumen
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus dokumen ini?")) return;

    await fetch(`/api/dokumen/${id}`, { method: "DELETE" });
    loadDokumen();
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
      <h1 className="text-4xl font-bold">Dokumen</h1>

      {/* Form Tambah/Edit Dokumen */}
      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">{editId ? "Edit Dokumen" : "Tambah Dokumen"}</h1>

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
              <label htmlFor="nama" className="mb-1">
                Nama Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama dokumen"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="link" className="mb-1">
                Link Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Masukkan link dokumen"
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

      {/* Tabel Dokumen */}
      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold mb-4">Tabel Dokumen</h1>
        {loading ? (
          <p>Memuat data...</p>
        ) : dokumenList.length === 0 ? (
          <p className="text-gray-500">Belum ada dokumen.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Link</th>
                  <th className="p-3 border">Tanggal</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dokumenList.map((dokumen, index) => (
                  <tr key={dokumen.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{dokumen.nama}</td>
                    <td className="p-3 border">
                      <a
                        href={dokumen.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {dokumen.link.length > 40
                          ? dokumen.link.substring(0, 40) + "..."
                          : dokumen.link}
                      </a>
                    </td>
                    <td className="p-3 border">{formatTanggal(dokumen.createdAt)}</td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(dokumen)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dokumen.id)}
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

export default DokumenPage;
