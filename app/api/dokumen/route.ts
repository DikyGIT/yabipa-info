import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET semua dokumen (bisa filter by role query param)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  const where = role
    ? { aksesRole: { contains: role } }
    : {};

  const dokumen = await prisma.dokumen.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(dokumen);
}

// POST tambah dokumen (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { nama, link, aksesRole } = body;

  if (!nama || !link) {
    return NextResponse.json({ error: "Nama dan link wajib diisi" }, { status: 400 });
  }

  const dokumen = await prisma.dokumen.create({
    data: {
      nama,
      link,
      aksesRole: aksesRole || "KEPALA,GURU",
    },
  });

  return NextResponse.json(dokumen, { status: 201 });
}
