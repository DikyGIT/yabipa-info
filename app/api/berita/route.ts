import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET semua berita
export async function GET() {
  const berita = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(berita);
}

// POST tambah berita (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { judul, pj, tanggal } = body;

  if (!judul || !tanggal) {
    return NextResponse.json({ error: "Judul dan tanggal wajib diisi" }, { status: 400 });
  }

  const berita = await prisma.berita.create({
    data: {
      judul,
      pj: pj || null,
      tanggal: new Date(tanggal),
    },
  });

  return NextResponse.json(berita, { status: 201 });
}
