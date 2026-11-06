import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, FileText, ImageOff } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/AdminHeader";
import { StatusBadge, TypeBadge } from "@/components/Badges";
import { StatusUpdateForm } from "@/components/StatusUpdateForm";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });

  if (!report) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader adminUsername={admin.username} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Panele Dön
        </Link>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-navy-900">{report.subject}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <TypeBadge type={report.type} />
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">İş Yeri</dt>
                <dd className="text-sm text-slate-700">{report.workplace}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">
                  Oluşturulma Tarihi
                </dt>
                <dd className="text-sm text-slate-700">
                  {new Intl.DateTimeFormat("tr-TR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(report.createdAt)}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">Açıklama</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {report.description}
              </dd>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase text-slate-400">
              Yüklenen Fotoğraf
            </p>
            {report.photoPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/admin/photos/${report.photoPath}`}
                alt="Bildirim fotoğrafı"
                className="max-h-96 w-full rounded-xl border border-slate-200 object-contain"
              />
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-400">
                <ImageOff className="h-5 w-5" />
                Bu bildirime fotoğraf eklenmemiş.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <StatusUpdateForm reportId={report.id} currentStatus={report.status} />
        </div>
      </main>
    </div>
  );
}
