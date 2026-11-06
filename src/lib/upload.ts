import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
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

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { ok: true, filename };
}

export function getUploadPath(filename: string): string {
  return path.join(UPLOAD_DIR, filename);
}
