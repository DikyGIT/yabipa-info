"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

type Dokumen = {
  id: string;
  nama: string;
  link: string;
  kategori: string;
  aksesRole: string;
  createdAt: string;
};

const PER_PAGE = 3;

const DokumenPage = () => {
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [nama, setNama] = useState("");
  const [link, setLink] = useState("");
  const [kategori, setKategori] = useState("Kurikulum");
  const [aksesKepala, setAksesKepala] = useState(true);
  const [aksesGuru, setAksesGuru] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const loadDokumen = async () => {
    const res = await fetch("/api/dokumen");
    const data = await res.json();
    setDokumenList(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dokumen")
      .then((res) => res.json())
      .then((data) => { if (!cancelled) { setDokumenList(data); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const filtered = dokumenList.filter((d) => {
    if (!search) return true;
    return d.nama.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setNama("");
    setLink("");
    setKategori("Kurikulum");
    setAksesKepala(true);
    setAksesGuru(true);
    setEditId(null);
    setError("");
    setSuccess("");
  };

  const buildAksesRole = () => {
    const roles: string[] = [];
    if (aksesKepala) roles.push("KEPALA");
    if (aksesGuru) roles.push("GURU");
    return roles.join(",") || "KEPALA,GURU";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const body = {
      nama,
      link,
      kategori,
      aksesRole: buildAksesRole(),
    };

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
      Swal.fire({ icon: "error", title: "Gagal", text: data.error || "Gagal menyimpan dokumen", confirmButtonColor: "#1e40af" });
      return;
    }

    Swal.fire({
      icon: "success",
      title: editId ? "Dokumen diupdate!" : "Dokumen ditambahkan!",
      timer: 1500,
      showConfirmButton: false,
    });
    resetForm();
    loadDokumen();
  };

  const handleEdit = (dokumen: Dokumen) => {
    setEditId(dokumen.id);
    setNama(dokumen.nama);
    setLink(dokumen.link);
    setKategori(dokumen.kategori);
    setAksesKepala(dokumen.aksesRole.includes("KEPALA"));
    setAksesGuru(dokumen.aksesRole.includes("GURU"));
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data dokumen akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await fetch(`/api/dokumen/${id}`, { method: "DELETE" });
      Swal.fire({ icon: "success", title: "Terhapus!", timer: 1000, showConfirmButton: false });
      loadDokumen();
    }
  };

  // Export Excel
  const exportExcel = () => {
    const data = dokumenList.map((d, i) => ({
      No: i + 1,
      Nama: d.nama,
      Link: d.link,
      Akses: d.aksesRole,
      Tanggal: formatTanggal(d.createdAt),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dokumen");
    XLSX.writeFile(wb, "data-dokumen.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Data Dokumen - YABIPA", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["No", "Nama", "Akses Role", "Tanggal"]],
      body: dokumenList.map((d, i) => [
        String(i + 1),
        d.nama,
        d.aksesRole,
        formatTanggal(d.createdAt),
      ]),
    });
    doc.save("data-dokumen.pdf");
  };

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

      {/* Form Tambah/Edit */}
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
          <div className="flex flex-col gap-2">
            <label htmlFor="kategori" className="mb-1">Kategori</label>
            <select
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="Kurikulum">Kurikulum</option>
              <option value="Keguruan">Keguruan</option>
              <option value="Kesiswaan">Kesiswaan</option>
            </select>
          </div>
          {/* Checkbox Akses Role */}
          <div className="flex flex-col gap-2">
            <label className="mb-1">
              Akses Role <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aksesKepala}
                  onChange={(e) => setAksesKepala(e.target.checked)}
                  className="w-4 h-4 accent-blue-800"
                />
                <span>Kepala Sekolah</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aksesGuru}
                  onChange={(e) => setAksesGuru(e.target.checked)}
                  className="w-4 h-4 accent-blue-800"
                />
                <span>Guru</span>
              </label>
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
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h1 className="text-xl font-bold">Tabel Dokumen</h1>
          {dokumenList.length > 0 && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="border border-gray-300 rounded-md py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 cursor-pointer text-sm">📊 Excel</button>
              <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 cursor-pointer text-sm">📄 PDF</button>
            </div>
          )}
        </div>
        {loading ? (
          <p>Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Belum ada dokumen.</p>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Link</th>
                  <th className="p-3 border">Kategori</th>
                  <th className="p-3 border">Akses</th>
                  <th className="p-3 border">Tanggal</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((dokumen, index) => (
                  <tr key={dokumen.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{(currentPage - 1) * PER_PAGE + index + 1}</td>
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
                    <td className="p-3 border">{dokumen.kategori}</td>
                    <td className="p-3 border">
                      <div className="flex gap-1 flex-wrap">
                        {dokumen.aksesRole.split(",").map((role) => (
                          <span
                            key={role}
                            className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
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
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">&laquo;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded border cursor-pointer ${currentPage === page ? "bg-sky-800 text-white border-sky-800" : "border-gray-300 hover:bg-gray-100"}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">&raquo;</button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default DokumenPage;
