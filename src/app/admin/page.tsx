import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Search,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/AdminHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, TypeBadge } from "@/components/Badges";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [total, pending, inReview, resolved, reports] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: "BEKLIYOR" } }),
    prisma.report.count({ where: { status: "INCELENIYOR" } }),
    prisma.report.count({ where: { status: "COZULDU" } }),
    prisma.report.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader adminUsername={admin.username} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-navy-900">Gösterge Paneli</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gelen bildirimleri görüntüleyin ve durumlarını güncelleyin.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ClipboardList}
            label="Toplam Bildirim"
            value={total}
            accent="bg-navy-900/10 text-navy-900"
          />
          <StatCard
            icon={Clock}
            label="Bekleyen"
            value={pending}
            accent="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={Search}
            label="İnceleniyor"
            value={inReview}
            accent="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={CheckCircle2}
            label="Sorun Çözüldü"
            value={resolved}
            accent="bg-emerald-100 text-emerald-700"
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-navy-900">Bildirimler</h2>
          </div>

          {reports.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Henüz bir bildirim alınmadı.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Tarih</th>
                    <th className="px-5 py-3">İş Yeri</th>
                    <th className="px-5 py-3">Konu</th>
                    <th className="px-5 py-3">Tür</th>
                    <th className="px-5 py-3">Durum</th>
                    <th className="px-5 py-3 text-right">Detay</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {new Intl.DateTimeFormat("tr-TR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(report.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-slate-700">{report.workplace}</td>
                      <td className="max-w-[220px] truncate px-5 py-3 font-medium text-navy-900">
                        {report.subject}
                      </td>
                      <td className="px-5 py-3">
                        <TypeBadge type={report.type} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/admin/bildirimler/${report.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
                        >
                          Detay
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
