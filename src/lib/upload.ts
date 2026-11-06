import { randomBytes } from "crypto";
import { getSupabaseClient, PHOTOS_BUCKET } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type UploadResult =
  | { ok: true; filename: string }
  | { ok: false; error: string };

export async function savePhoto(file: File): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: "Fotoğraf boyutu 5 MB'den büyük olamaz." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { ok: false, error: "Sadece JPG, PNG veya WEBP formatında fotoğraf yükleyebilirsiniz." };
  }

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await getSupabaseClient()
    .storage.from(PHOTOS_BUCKET)
    .upload(filename, buffer, { contentType: file.type });

  if (error) {
    console.error("Supabase Storage yükleme hatası:", error);
    return { ok: false, error: "Fotoğraf yüklenirken bir hata oluştu." };
  }

  return { ok: true, filename };
}
