import { NextResponse } from "next/server";
import { ReportStatus } from "@prisma/client";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!Object.values(ReportStatus).includes(status)) {
    return NextResponse.json(
      { error: "Geçersiz durum değeri." },
      { status: 400 }
    );
  }

  try {
    const report = await prisma.report.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ ok: true, status: report.status });
  } catch {
    return NextResponse.json(
      { error: "Bildirim bulunamadı." },
      { status: 404 }
    );
  }
}
