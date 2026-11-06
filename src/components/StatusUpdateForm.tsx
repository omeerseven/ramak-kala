"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReportStatus } from "@prisma/client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { REPORT_STATUS_LABELS } from "@/lib/labels";

const STATUS_OPTIONS: ReportStatus[] = ["BEKLIYOR", "INCELENIYOR", "COZULDU"];

export function StatusUpdateForm({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: ReportStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    setSaving(true);
    setError(null);
    setSavedMessage(false);

    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Durum güncellenemedi.");
        return;
      }

      setSavedMessage(true);
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-navy-900">Durum Güncelle</h3>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {savedMessage && !error && (
        <p className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Durum güncellendi.
        </p>
      )}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReportStatus)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {REPORT_STATUS_LABELS[option]}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          disabled={saving || status === currentStatus}
          className="flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Güncelle
        </button>
      </div>
    </div>
  );
}
