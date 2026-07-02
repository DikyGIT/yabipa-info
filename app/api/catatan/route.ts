import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET catatan by bulan
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const catatan = await prisma.catatan.findMany({
    where: { tanggal: { gte: startDate, lte: endDate } },
    orderBy: { tanggal: "asc" },
  });

  return NextResponse.json(catatan);
}

// POST tambah catatan
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tanggal, judul, catatan } = body;

  if (!tanggal || !judul || !catatan) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const result = await prisma.catatan.create({
    data: { tanggal: new Date(tanggal), judul, catatan },
  });

  return NextResponse.json(result, { status: 201 });
}

// DELETE catatan
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  }

  await prisma.catatan.delete({ where: { id } });
  return NextResponse.json({ message: "Catatan dihapus" });
}
