import { NextResponse } from "next/server";
import path from "path";
import { getCurrentAdmin } from "@/lib/auth";
import { getSupabaseClient, PHOTOS_BUCKET } from "@/lib/supabase";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { filename } = await params;
  const safeFilename = path.basename(filename);
  const extension = path.extname(safeFilename).toLowerCase();
  const contentType = CONTENT_TYPES[extension];

  if (!contentType) {
    return NextResponse.json({ error: "Geçersiz dosya." }, { status: 400 });
  }

  const { data, error } = await getSupabaseClient()
    .storage.from(PHOTOS_BUCKET)
    .download(safeFilename);

  if (error || !data) {
    return NextResponse.json({ error: "Fotoğraf bulunamadı." }, { status: 404 });
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
    },
  });
}
