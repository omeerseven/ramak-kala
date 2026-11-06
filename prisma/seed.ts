import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await prisma.admin.findUnique({ where: { username } });
  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    await prisma.admin.update({
      where: { username },
      data: { passwordHash },
    });
    console.log(`Yönetici hesabı güncellendi: ${username}`);
  } else {
    await prisma.admin.create({
      data: { username, passwordHash },
    });
    console.log(`Yönetici hesabı oluşturuldu: ${username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
