import Image from "next/image";

import { IoIosArrowDown } from "react-icons/io";

import { dataBerita, dataProgram } from "@/constants/data-yabipa";

const page = () => {
  return (
    <div className="homepage">
      <div className="container lg:max-w-300 px-4 mx-auto">
        <div className="hero grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-20 items-center py-20">
          <div className="box lg:text-left text-center">
            <p className="bg-white shadow p-4 w-fit lg:block hidden mb-5 rounded-sm">
              <q>Bina Insan Paripurna - Ponpes Qur`an Yabipa</q>
            </p>
            <h1 className="sm:text-7xl/tight text-5xl/tight font-bold mb-5">
              Welcome to <br /> Yabipa
            </h1>
            <p className="text-lg/loose sm:text-xl/loose mb-10 lg:w-125 w-full">
              Islamic Boarding School dengan Model Pembelajaran berbasis Proyek
              yang berpusat pada Peserta Didik
            </p>
            <a
              href="#program"
              className="bg-sky-800 hover:bg-sky-900 text-white text-2xl font-bold py-2 px-4 rounded"
            >
              Lihat Program <IoIosArrowDown className="inline-block ml-1" />
            </a>
          </div>
          <Image
            src={"/images/hero.webp"}
            width={600}
            height={600}
            alt="Hero"
            loading="eager"
            priority
            className="rounded-lg mx-auto"
          />
        </div>

        {/* Tentang */}
        <div className="tentang sm:py-20 py-10" id="tentang">
          <h1 className="text-5xl/tight font-bold mb-5 text-center">
            Tentang Sekolah
          </h1>
          <p className="md:text-lg/loose text-base/loose lg:text-center text-justify">
            Selamat datang di Pondok Pesantren Qur`an Yabipa & SMP IT Yabipa.
            Kami berikhtiar membina generasi muda melalui pembiasan karakter
            Islami dan pengembangan fisik serta kemandirian dalam cita-cita
            membentuk generasi muda Basthotan fil Ilmi wal Jismi, dalam
            lingkungan pengasuhan positif dan fasilitas yang nyaman.
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-10">
            <div className="bg-white shadow p-5 rounded-lg h-fit">
              <h1 className="text-3xl font-bold mb-4">Visi</h1>
              <p className="text-base/loose">
                Membangun Lembaga Pendidikan Islam Terpadu Yang Terpercaya
                Dengan Mengusung Kearifan Lokal.
              </p>
            </div>
            <div className="bg-white shadow p-5 rounded-lg">
              <h1 className="text-3xl font-bold mb-4">Misi</h1>
              <ol className="list-decimal pl-4 text-base/loose">
                <li>Mendidik Para Siswa yang Berkarakter Islami.</li>
                <li>
                  Menyelenggarakan Pendidikan Nasional (SMP/SMA/SMK) Terbaik.
                </li>
                <li>
                  Menyelenggarakan Pendidikan Pondok Pesantren Dengan Fasilitas
                  terbaik (The Best Boarding School).
                </li>
                <li>
                  Menyelenggarakan Klinik Usaha Sebagai Sarana Pelatihan Bagi
                  Para Siswa.
                </li>
              </ol>
            </div>
          </div>
        </div>
        {/* Tentang */}

        {/* Acara */}
        <div className="acara sm:py-20 py-10" id="berita">
          <h1 className="text-5xl/tight font-bold mb-5 text-center">
            Berita Terbaru
          </h1>
          <p className="lg:text-lg/loose text-base/loose text-center">
            Informasi terkini mengenai kegiatan dan berita terbaru Yabipa.
          </p>

          <div className="mt-16 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {dataBerita.map((data) => (
              <div
                className="bg-white shadow rounded-tr-2xl rounded-tl-2xl"
                key={data.id}
              >
                <Image
                  src={"/images/hero-img.webp"}
                  width={400}
                  height={200}
                  alt="Hero"
                  loading="lazy"
                  className="aspect-video rounded-tr-2xl rounded-tl-2xl w-full"
                />
                <div className="desc p-4 text-center">
                  <h1 className="text-2xl font-bold mb-2">{data.Judul}</h1>
                  <p>{data.tanggal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Acara */}

        {/* Program Akademik */}
        <div className="program sm:py-20 py-10" id="program">
          <h1 className="text-5xl/tight font-bold mb-5 text-center">
            Program Akademik
          </h1>
          <p className="lg:text-lg/loose text-base/loose text-center">
            Beberapa Program Akademik yang diselenggarakan di Yabipa.
          </p>

          <div className="mt-16 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {dataProgram.map((data) => (
              <div
                className="bg-white shadow rounded-tr-2xl rounded-tl-2xl p-7 text-center"
                key={data.id}
              >
                <Image
                  src={data.gambar}
                  width={50}
                  height={50}
                  alt="Program"
                  loading="lazy"
                  className="mx-auto mb-4"
                />
                <h1 className="text-xl font-bold mb-2">{data.program}</h1>
                <p className="text-base/loose">{data.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Program Akademik */}

        {/* Data */}
        <div className="kumpulan-data sm:py-20 py-10" id="data">
          <h1 className="text-5xl/tight font-bold mb-5 text-center">
            Kumpulan Data
          </h1>
          <p className="lg:text-lg/loose text-base/loose text-center">
            Berikut ini merupakan kumpulan data yang dapat diakses.
          </p>

          <div className="mt-16 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            <div className="kurikulum">
              <h1 className="text-center font-bold text-xl">Kurikulum</h1>
              <div className="flex flex-col gap-3 mt-6">
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 1
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 2
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 3
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 4
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 5
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 6
                </a>
              </div>
            </div>
            <div className="keguruan">
              <h1 className="text-center font-bold text-xl">Keguruan</h1>
              <div className="flex flex-col gap-3 w-fit mx-auto mt-6">
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Struktur Organisasi
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 2
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 3
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 4
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 5
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Data 6
                </a>
              </div>
            </div>
            <div className="kesiswaan">
              <h1 className="text-center font-bold text-xl">Kesiswaan</h1>
              <div className="flex flex-col gap-3 w-fit mx-auto mt-6">
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Kelas 7
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Kelas 8
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Kelas 9
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Kelas 10
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Kelas 11
                </a>
                <a
                  href="#"
                  className="bg-sky-800 hover:bg-sky-900 text-white p-2 rounded w-fit mx-auto"
                >
                  Kelas 12
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Data */}
      </div>
    </div>
  );
};

export default page;
