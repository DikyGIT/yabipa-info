"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Berita = {
  id: string;
  judul: string;
  kategori: string | null;
  pj: string | null;
  tanggal: string;
};

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const KalenderPage = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Berita[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const loadEvents = async () => {
    const res = await fetch(`/api/events?month=${month}&year=${year}`);
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    void loadEvents();
  }, [month, year]);

  // Generate hari dalam bulan
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Min

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Cek tanggal ada event
  const getEventsForDay = (day: number) => {
    return events.filter((e) => {
      const d = new Date(e.tanggal);
      return d.getDate() === day;
    });
  };

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Kalender Kegiatan</h1>

      <div className="mt-5 grid lg:grid-cols-3 gap-5">
        {/* Kalender */}
        <div className="lg:col-span-2 bg-white shadow rounded p-6">
          {/* Header bulan */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <FaChevronLeft />
            </button>
            <h2 className="text-2xl font-bold">
              {BULAN[month - 1]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Hari header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {HARI.map((h) => (
              <div
                key={h}
                className="text-center text-sm font-bold text-gray-500 py-2"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Grid tanggal */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="p-2" />;
              }

              const dayEvents = getEventsForDay(day);
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() + 1 &&
                year === today.getFullYear();
              const isSelected = day === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDate(isSelected ? null : day)
                  }
                  className={`relative p-2 min-h-[60px] text-left rounded border transition cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : isToday
                        ? "border-blue-300 bg-blue-50/50"
                        : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isToday ? "text-blue-600 font-bold" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="mt-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[10px] bg-sky-100 text-sky-800 rounded px-1 py-0.5 mb-0.5 truncate"
                        >
                          {ev.judul}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-gray-400">
                          +{dayEvents.length - 2} lagi
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail tanggal */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-bold mb-4">
            {selectedDate
              ? `${selectedDate} ${BULAN[month - 1]} ${year}`
              : "Pilih tanggal"}
          </h3>

          {!selectedDate && (
            <p className="text-gray-400 text-sm">
              Klik tanggal di kalender untuk melihat kegiatan.
            </p>
          )}

          {selectedDate && selectedEvents.length === 0 && (
            <p className="text-gray-400 text-sm">
              Tidak ada kegiatan pada tanggal ini.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {selectedEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-sky-50 border border-sky-200 rounded-lg p-4"
              >
                <h4 className="font-bold text-sky-900">{ev.judul}</h4>
                {ev.kategori && (
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded mt-1 inline-block">
                    {ev.kategori}
                  </span>
                )}
                {ev.pj && (
                  <p className="text-sm text-gray-500 mt-1">
                    PJ: {ev.pj}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Ringkasan bulan */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-bold text-sm text-gray-500 mb-2">
              Ringkasan {BULAN[month - 1]}
            </h4>
            <p className="text-sm text-gray-600">
              Total kegiatan: <span className="font-bold">{events.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KalenderPage;
