"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";

const KesiswaanPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const role = session?.user?.role;

  if (role === "GURU") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
        <p className="text-lg text-gray-600 mb-8">
          Anda tidak memiliki akses ke data Kesiswaan.
        </p>
        <Link
          href="/yabipa-home"
          className="bg-sky-800 hover:bg-sky-900 text-white px-6 py-2 rounded"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">Data Kesiswaan - Kelas {params.id}</h1>
      <p className="text-gray-600 mb-8">Data kesiswaan akan ditampilkan di sini.</p>
      <Link
        href="/yabipa-home#data"
        className="bg-sky-800 hover:bg-sky-900 text-white px-6 py-2 rounded"
      >
        Kembali
      </Link>
    </div>
  );
};

export default KesiswaanPage;
