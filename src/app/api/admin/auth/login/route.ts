import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username: String(username).trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    await createSession(admin.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Giriş hatası:", error);
    return NextResponse.json(
      { error: "Giriş sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
