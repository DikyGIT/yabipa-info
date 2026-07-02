import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET semua berita (bisa filter by status)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where = status ? { status: status as "DRAFT" | "PUBLISHED" } : {};

  const berita = await prisma.berita.findMany({
    where,
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
  const { judul, kategori, pj, tanggal, status } = body;

  if (!judul || !tanggal) {
    return NextResponse.json({ error: "Judul dan tanggal wajib diisi" }, { status: 400 });
  }

  const berita = await prisma.berita.create({
    data: {
      judul,
      kategori: kategori || null,
      pj: pj || null,
      tanggal: new Date(tanggal),
      status: status || "DRAFT",
    },
  });

  return NextResponse.json(berita, { status: 201 });
}
