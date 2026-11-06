import { NextResponse } from "next/server";
import { ReportType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { savePhoto } from "@/lib/upload";
import { WORKPLACES } from "@/lib/labels";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const workplace = String(formData.get("workplace") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const type = String(formData.get("type") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const photo = formData.get("photo");

    if (!WORKPLACES.includes(workplace as (typeof WORKPLACES)[number])) {
      return NextResponse.json(
        { error: "Lütfen geçerli bir iş yeri seçin." },
        { status: 400 }
      );
    }

    if (!subject || subject.length > 200) {
      return NextResponse.json(
        { error: "Konu / başlık zorunludur ve 200 karakteri aşamaz." },
        { status: 400 }
      );
    }

    if (!Object.values(ReportType).includes(type as ReportType)) {
      return NextResponse.json(
        { error: "Lütfen geçerli bir bildirim türü seçin." },
        { status: 400 }
      );
    }

    if (!description || description.length < 5) {
      return NextResponse.json(
        { error: "Açıklama en az 5 karakter olmalıdır." },
        { status: 400 }
      );
    }

    let photoPath: string | undefined;

    if (photo instanceof File && photo.size > 0) {
      const result = await savePhoto(photo);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      photoPath = result.filename;
    }

    const report = await prisma.report.create({
      data: {
        workplace,
        subject,
        type: type as ReportType,
        description,
        photoPath,
      },
    });

    return NextResponse.json({ id: report.id }, { status: 201 });
  } catch (error) {
    console.error("Bildirim oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Bildirim gönderilirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
