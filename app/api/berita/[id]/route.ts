import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const berita = await prisma.berita.findUnique({ where: { id } });
  if (!berita) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(berita);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { judul, pj, tanggal } = body;

  const berita = await prisma.berita.update({
    where: { id },
    data: { judul, pj: pj || null, tanggal: new Date(tanggal) },
  });

  return NextResponse.json(berita);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.berita.delete({ where: { id } });
  return NextResponse.json({ message: "Berita dihapus" });
}
