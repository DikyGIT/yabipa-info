import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET semua dokumen
export async function GET() {
  const dokumen = await prisma.dokumen.findMany({
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
  const { nama, link } = body;

  if (!nama || !link) {
    return NextResponse.json({ error: "Nama dan link wajib diisi" }, { status: 400 });
  }

  const dokumen = await prisma.dokumen.create({
    data: { nama, link },
  });

  return NextResponse.json(dokumen, { status: 201 });
}
