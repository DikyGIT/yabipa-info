"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

type Berita = {
  id: string;
  judul: string;
  pj: string | null;
  tanggal: string;
  createdAt: string;
};

const PER_PAGE = 3;

const BeritaPage = () => {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [judul, setJudul] = useState("");
  const [pj, setPj] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/berita")
      .then((res) => res.json())
      .then((data) => { if (!cancelled) { setBeritaList(data); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const resetForm = () => {
    setJudul(""); setPj(""); setTanggal(""); setEditId(null);
    setError(""); setSuccess("");
  };

  const filtered = beritaList.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.judul.toLowerCase().includes(q) || (b.pj || "").toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const body = { judul, pj, tanggal };

    const url = editId ? `/api/berita/${editId}` : "/api/berita";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      Swal.fire({ icon: "error", title: "Gagal", text: data.error || "Gagal menyimpan berita", confirmButtonColor: "#1e40af" });
      return;
    }

    Swal.fire({ icon: "success", title: editId ? "Berita diupdate!" : "Berita ditambahkan!", timer: 1500, showConfirmButton: false });
    resetForm();
    fetch("/api/berita").then((r) => r.json()).then(setBeritaList);
  };

  const handleEdit = (berita: Berita) => {
    setEditId(berita.id);
    setJudul(berita.judul);
    setPj(berita.pj || "");
    setTanggal(berita.tanggal.split("T")[0]);
    setError(""); setSuccess("");
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data berita akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      await fetch(`/api/berita/${id}`, { method: "DELETE" });
      Swal.fire({ icon: "success", title: "Terhapus!", timer: 1000, showConfirmButton: false });
      fetch("/api/berita").then((r) => r.json()).then(setBeritaList);
    }
  };

  const formatTanggal = (t: string) => new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const exportExcel = () => {
    const data = filtered.map((b, i) => ({ No: i + 1, Judul: b.judul, PJ: b.pj || "-", Tanggal: formatTanggal(b.tanggal) }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Berita");
    XLSX.writeFile(wb, "data-berita.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Data Berita - YABIPA", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["No", "Judul", "PJ", "Tanggal"]],
      body: filtered.map((b, i) => [String(i + 1), b.judul, b.pj || "-", formatTanggal(b.tanggal)]),
    });
    doc.save("data-berita.pdf");
  };

  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Berita</h1>

      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">{editId ? "Edit Berita" : "Tambah Berita"}</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="judul" className="mb-1">Judul Berita <span className="text-red-500">*</span></label>
              <input type="text" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan judul berita" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800" required />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="pj" className="mb-1">PJ <span className="opacity-50">(optional)</span></label>
              <input type="text" id="pj" value={pj} onChange={(e) => setPj(e.target.value)} placeholder="Masukkan pj" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <label htmlFor="tanggal" className="mb-1">Tanggal <span className="text-red-500">*</span></label>
            <input type="date" id="tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-800 text-white py-2 px-6 rounded-md hover:bg-blue-900 hover:cursor-pointer">{editId ? "Update" : "Simpan"}</button>
            {editId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 hover:cursor-pointer">Batal</button>}
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded p-6 mt-5">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h1 className="text-xl font-bold">Tabel Berita</h1>
          {beritaList.length > 0 && (
            <div className="flex gap-2 items-center">
              <input type="text" placeholder="Cari berita..." value={search} onChange={(e) => handleSearch(e.target.value)} className="border border-gray-300 rounded-md py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
              <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 cursor-pointer text-sm">📊 Excel</button>
              <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 cursor-pointer text-sm">📄 PDF</button>
            </div>
          )}
        </div>
        {loading ? <p>Memuat data...</p> : filtered.length === 0 ? <p className="text-gray-500">Belum ada berita.</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">No</th>
                    <th className="p-3 border">Judul</th>
                    <th className="p-3 border">PJ</th>
                    <th className="p-3 border">Tanggal</th>
                    <th className="p-3 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((berita, index) => (
                    <tr key={berita.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{(currentPage - 1) * PER_PAGE + index + 1}</td>
                      <td className="p-3 border">{berita.judul}</td>
                      <td className="p-3 border">{berita.pj || "-"}</td>
                      <td className="p-3 border">{formatTanggal(berita.tanggal)}</td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(berita)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(berita.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer">Hapus</button>
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

export default BeritaPage;
