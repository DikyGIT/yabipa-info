"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

type Berita = { id: string; judul: string; kategori: string | null; pj: string | null; tanggal: string; };
type Catatan = { id: string; tanggal: string; judul: string; catatan: string; };

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const KalenderPage = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Berita[]>([]);
  const [catatanList, setCatatanList] = useState<Catatan[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [catatanJudul, setCatatanJudul] = useState("");
  const [catatanIsi, setCatatanIsi] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/events?month=${month}&year=${year}`).then((r) => r.json()),
      fetch(`/api/catatan?month=${month}&year=${year}`).then((r) => r.json()),
    ]).then(([events, catatan]) => {
      if (!cancelled) { setEvents(events); setCatatanList(catatan); }
    });
    return () => { cancelled = true; };
  }, [month, year]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => events.filter((e) => new Date(e.tanggal).getDate() === day);
  const getCatatanForDay = (day: number) => catatanList.filter((c) => new Date(c.tanggal).getDate() === day);

  const loadData = () => {
    Promise.all([
      fetch(`/api/events?month=${month}&year=${year}`).then((r) => r.json()),
      fetch(`/api/catatan?month=${month}&year=${year}`).then((r) => r.json()),
    ]).then(([events, catatan]) => { setEvents(events); setCatatanList(catatan); });
  };

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(year - 1); } else { setMonth(month - 1); } setSelectedDate(null); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(year + 1); } else { setMonth(month + 1); } setSelectedDate(null); };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];
  const selectedCatatan = selectedDate ? getCatatanForDay(selectedDate) : [];

  const handleAddCatatan = async () => {
    if (!selectedDate || !catatanJudul || !catatanIsi) return;

    const tanggal = `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

    const res = await fetch("/api/catatan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tanggal, judul: catatanJudul, catatan: catatanIsi }),
    });

    if (res.ok) {
      Swal.fire({ icon: "success", title: "Catatan ditambahkan!", timer: 1000, showConfirmButton: false });
      setCatatanJudul(""); setCatatanIsi(""); setShowForm(false);
      loadData();
    }
  };

  const handleDeleteCatatan = async (id: string) => {
    const result = await Swal.fire({
      title: "Hapus catatan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      await fetch(`/api/catatan?id=${id}`, { method: "DELETE" });
      Swal.fire({ icon: "success", title: "Terhapus!", timer: 1000, showConfirmButton: false });
      loadData();
    }
  };

  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Kalender Kegiatan</h1>

      <div className="mt-5 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded cursor-pointer"><FaChevronLeft /></button>
            <h2 className="text-2xl font-bold">{BULAN[month - 1]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded cursor-pointer"><FaChevronRight /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {HARI.map((h) => <div key={h} className="text-center text-sm font-bold text-gray-500 py-2">{h}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="p-2" />;
              const dayEvents = getEventsForDay(day);
              const dayCatatan = getCatatanForDay(day);
              const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
              const isSelected = day === selectedDate;
              const hasContent = dayEvents.length > 0 || dayCatatan.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`relative p-2 min-h-15 text-left rounded border transition cursor-pointer ${
                    isSelected ? "border-blue-500 bg-blue-50" : isToday ? "border-blue-300 bg-blue-50/50" : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium ${isToday ? "text-blue-600 font-bold" : "text-gray-700"}`}>{day}</span>
                  {hasContent && (
                    <div className="mt-1">
                      {dayCatatan.length > 0 && <div className="text-[10px] bg-yellow-100 text-yellow-800 rounded px-1 py-0.5 mb-0.5 truncate">📝 {dayCatatan.length}</div>}
                      {dayEvents.length > 0 && <div className="text-[10px] bg-sky-100 text-sky-800 rounded px-1 py-0.5 truncate">📅 {dayEvents.length}</div>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel samping */}
        <div className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              {selectedDate ? `${selectedDate} ${BULAN[month - 1]} ${year}` : "Pilih tanggal"}
            </h3>
            {selectedDate && (
              <button onClick={() => setShowForm(!showForm)} className="bg-sky-800 text-white p-2 rounded hover:bg-sky-900 cursor-pointer" title="Tambah catatan">
                <FaPlus />
              </button>
            )}
          </div>

          {!selectedDate && <p className="text-gray-400 text-sm">Klik tanggal di kalender untuk melihat kegiatan.</p>}

          {/* Form tambah catatan */}
          {showForm && selectedDate && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-sm mb-2">Tambah Catatan</h4>
              <input type="text" placeholder="Judul catatan" value={catatanJudul} onChange={(e) => setCatatanJudul(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-sky-800" />
              <textarea placeholder="Isi catatan..." value={catatanIsi} onChange={(e) => setCatatanIsi(e.target.value)} rows={3} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-sky-800" />
              <div className="flex gap-2">
                <button onClick={handleAddCatatan} className="bg-sky-800 text-white px-3 py-1 rounded text-sm hover:bg-sky-900 cursor-pointer">Simpan</button>
                <button onClick={() => { setShowForm(false); setCatatanJudul(""); setCatatanIsi(""); }} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 cursor-pointer">Batal</button>
              </div>
            </div>
          )}

          {/* Event list */}
          {selectedDate && selectedEvents.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-sm text-gray-500 mb-2">📅 Kegiatan</h4>
              <div className="flex flex-col gap-2">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                    <h4 className="font-bold text-sky-900">{ev.judul}</h4>
                    {ev.pj && <p className="text-sm text-gray-500 mt-1">PJ: {ev.pj}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catatan list */}
          {selectedDate && (
            <div>
              <h4 className="font-bold text-sm text-gray-500 mb-2">📝 Catatan</h4>
              {selectedCatatan.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada catatan.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedCatatan.map((cat) => (
                    <div key={cat.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-yellow-900">{cat.judul}</h4>
                          <p className="text-sm text-gray-600 mt-1">{cat.catatan}</p>
                        </div>
                        <button onClick={() => handleDeleteCatatan(cat.id)} className="text-red-500 hover:text-red-700 cursor-pointer"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ringkasan */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-bold text-sm text-gray-500 mb-2">Ringkasan {BULAN[month - 1]}</h4>
            <p className="text-sm text-gray-600">Kegiatan: <span className="font-bold">{events.length}</span></p>
            <p className="text-sm text-gray-600">Catatan: <span className="font-bold">{catatanList.length}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KalenderPage;
