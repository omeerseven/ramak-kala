"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Send,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { WORKPLACES } from "@/lib/labels";

const REPORT_TYPES = [
  { value: "RAMAK_KALA", label: "Ramak Kala" },
  { value: "TEHLIKELI_DURUM", label: "Tehlikeli Durum" },
  { value: "SIKAYET", label: "Şikayet" },
  { value: "ONERI", label: "Öneri" },
  { value: "TALEP", label: "Talep" },
];

export default function BildirPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Bildirim gönderilirken bir hata oluştu.");
        return;
      }

      setSuccess(true);
      form.reset();
      setPhotoName(null);
    } catch {
      setError("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1 bg-slate-50 py-8">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-navy-900">Bildirim Formu</h1>
          <p className="mt-1 text-sm text-slate-600">
            Giriş yapmanıza gerek yok. Gördüğünüz tehlikeyi anlatın, fark
            edilmesi için yeter.
          </p>

          {success ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              <div>
                <p className="text-lg font-semibold text-emerald-800">
                  Bildiriminiz başarıyla oluşturuldu.
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  İlginiz için teşekkür ederiz, en kısa sürede
                  değerlendirilecektir.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSuccess(false)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Yeni Bildirim Yap
                </button>
                <Link
                  href="/"
                  className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="workplace" className="block text-sm font-medium text-navy-900">
                  İş Yeri
                </label>
                <select
                  id="workplace"
                  name="workplace"
                  required
                  defaultValue=""
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  <option value="" disabled>
                    Seçiniz
                  </option>
                  {WORKPLACES.map((wp) => (
                    <option key={wp} value={wp}>
                      {wp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-navy-900">
                  Konu / Başlık
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="Örn: Islak zeminde kayma riski"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-navy-900">
                  Bildirim Türü
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {REPORT_TYPES.map((item, index) => (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-700"
                    >
                      <input
                        type="radio"
                        name="type"
                        value={item.value}
                        defaultChecked={index === 0}
                        required
                        className="h-4 w-4 accent-orange-500"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-navy-900">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  minLength={5}
                  rows={4}
                  placeholder="Gördüğünüz durumu detaylı şekilde anlatın..."
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-navy-900">
                  Fotoğraf (isteğe bağlı)
                </span>
                <label
                  htmlFor="photo"
                  className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 transition hover:border-orange-400 hover:text-orange-600"
                >
                  <ImagePlus className="h-5 w-5" />
                  {photoName ? photoName : "Fotoğraf eklemek için dokunun"}
                </label>
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
                />
                <p className="mt-1 text-xs text-slate-400">
                  JPG, PNG veya WEBP — en fazla 5 MB.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
