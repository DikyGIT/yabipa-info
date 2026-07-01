import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalUser, totalBerita, totalDokumen, userByRole] = await Promise.all([
    prisma.user.count(),
    prisma.berita.count(),
    prisma.dokumen.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    }),
  ]);

  const roleCount: Record<string, number> = {};
  userByRole.forEach((r) => {
    roleCount[r.role] = r._count.role;
  });

  return NextResponse.json({
    totalUser,
    totalBerita,
    totalDokumen,
    admin: roleCount["ADMIN"] || 0,
    kepala: roleCount["KEPALA"] || 0,
    guru: roleCount["GURU"] || 0,
  });
}
