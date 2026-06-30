import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// PUT update user (admin only)
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
  const { username, password, name, role } = body;

  const data: Record<string, string> = { username, name, role };

  // Update password hanya jika diisi
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

// DELETE user (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Cegah admin hapus diri sendiri
  if (session.user?.username) {
    const currentUser = await prisma.user.findUnique({ where: { id } });
    if (currentUser?.username === session.user.username) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus akun sendiri" },
        { status: 400 }
      );
    }
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "User dihapus" });
}
