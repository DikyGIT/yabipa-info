import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      username: "admin",
      password: adminPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  const kepalaPassword = await bcrypt.hash("kepala123", 10);
  await prisma.user.create({
    data: {
      username: "kepala",
      password: kepalaPassword,
      name: "Kepala Sekolah",
      role: "KEPALA",
    },
  });

  const guruPassword = await bcrypt.hash("guru123", 10);
  await prisma.user.create({
    data: {
      username: "guru",
      password: guruPassword,
      name: "Guru",
      role: "GURU",
    },
  });

  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
