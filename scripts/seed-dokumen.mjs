// Seed 10 dokumen test - Jalankan: node scripts/seed-dokumen.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dokumen = [
  { nama: "Kurikulum Merdeka SMP 2026", link: "https://drive.google.com/file/d/example1/view", kategori: "Kurikulum", aksesRole: "KEPALA,GURU" },
  { nama: "Kurikulum Tahfidz Qur'an", link: "https://drive.google.com/file/d/example2/view", kategori: "Kurikulum", aksesRole: "KEPALA,GURU" },
  { nama: "Jadwal Pelajaran Semester Ganjil", link: "https://drive.google.com/file/d/example3/view", kategori: "Kurikulum", aksesRole: "KEPALA,GURU" },
  { nama: "Struktur Organisasi Sekolah", link: "https://drive.google.com/file/d/example4/view", kategori: "Keguruan", aksesRole: "KEPALA,GURU" },
  { nama: "Rencana Program Kerja Tahunan", link: "https://drive.google.com/file/d/example5/view", kategori: "Keguruan", aksesRole: "KEPALA" },
  { nama: "Panduan Tata Tertib Guru", link: "https://drive.google.com/file/d/example6/view", kategori: "Keguruan", aksesRole: "KEPALA,GURU" },
  { nama: "Surat Keputusan Kepala Sekolah", link: "https://drive.google.com/file/d/example7/view", kategori: "Keguruan", aksesRole: "KEPALA" },
  { nama: "Panduan Tata Tertib Siswa", link: "https://drive.google.com/file/d/example8/view", kategori: "Kesiswaan", aksesRole: "KEPALA,GURU" },
  { nama: "Daftar Nilai Mid Semester", link: "https://drive.google.com/file/d/example9/view", kategori: "Kesiswaan", aksesRole: "KEPALA" },
  { nama: "Laporan Kegiatan MPLS", link: "https://drive.google.com/file/d/example10/view", kategori: "Kesiswaan", aksesRole: "KEPALA,GURU" },
];

async function main() {
  console.log("🗑️  Menghapus dokumen lama...");
  await prisma.dokumen.deleteMany();

  console.log("📝 Menambahkan 10 dokumen test...\n");

  for (const d of dokumen) {
    const created = await prisma.dokumen.create({ data: d });
    console.log(`  ✅ [${created.kategori}] ${created.nama}`);
  }

  console.log(`\n🎉 Berhasil menambahkan ${dokumen.length} dokumen!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
