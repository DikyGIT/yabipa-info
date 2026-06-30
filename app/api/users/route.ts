import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET semua user (admin only)
export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

// POST tambah user (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { username, password, name, role } = body;

  if (!username || !password || !name || !role) {
    return NextResponse.json(
      { error: "Semua field wajib diisi" },
      { status: 400 }
    );
  }

  // Cek username sudah ada
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    return NextResponse.json(
      { error: "Username sudah digunakan" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      role,
    },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
