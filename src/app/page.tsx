import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  ClipboardCheck,
  Eye,
  LineChart,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { QrCodeCard } from "@/components/QrCodeCard";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-navy-900 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1 text-sm font-medium text-orange-300">
                <ShieldCheck className="h-4 w-4" />
                İş Sağlığı ve Güvenliği
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Ramak Kala
              </h1>
              <p className="mt-3 text-lg font-medium text-orange-300">
                Tehlikeyi Gör, Bildir, Kazayı Önle.
              </p>
              <p className="mt-4 max-w-md text-white/80">
                Çalışma alanınızda fark ettiğiniz tehlikeli durumları, ramak kala
                olayları ve önerilerinizi saniyeler içinde bildirin. QR kodu
                okutun ya da formu doldurun — kayıt altına alalım, birlikte
                önleyelim.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/bildir"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                >
                  Bildirim Yap
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Yönetici Girişi
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <QrCodeCard />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900">
            Nasıl Çalışır?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
            Üç basit adımda tehlikeyi bildirin, süreci yönetim ekibi takip
            etsin.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <StepCard
              icon={<Eye className="h-6 w-6 text-orange-500" />}
              title="1. Tehlikeyi Gör"
              description="Çalışma alanında bir ramak kala, tehlikeli durum ya da eksiklik fark edin."
            />
            <StepCard
              icon={<MessageSquareWarning className="h-6 w-6 text-orange-500" />}
              title="2. Bildir"
              description="QR kodu okutup formu doldurun, isterseniz fotoğraf ekleyin. Üyelik gerekmez."
            />
            <StepCard
              icon={<ClipboardCheck className="h-6 w-6 text-orange-500" />}
              title="3. Kazayı Önle"
              description="Yönetim ekibi bildirimi inceler, durumu günceller ve sorunu çözer."
            />
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<AlertTriangle className="h-5 w-5 text-navy-900" />}
                title="Ramak Kala & Tehlike"
                description="Kazaya dönüşmeden önce fark edilen tehlikeli durumları bildirin."
              />
              <FeatureCard
                icon={<Camera className="h-5 w-5 text-navy-900" />}
                title="Fotoğraflı Kanıt"
                description="Bildiriminize bir fotoğraf ekleyerek durumu daha anlaşılır hale getirin."
              />
              <FeatureCard
                icon={<LineChart className="h-5 w-5 text-navy-900" />}
                title="Anlık Takip"
                description="Yönetim paneli bildirim durumunu bekliyor, inceleniyor ve çözüldü olarak takip eder."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5 text-navy-900" />}
                title="Güvenli Kayıt"
                description="Tüm bildirimler veritabanında güvenle saklanır, yetkisiz erişime kapalıdır."
              />
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function StepCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
        {icon}
      </div>
      <h3 className="font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
        {icon}
      </div>
      <h3 className="font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}
