import type { ReportStatus, ReportType } from "@prisma/client";

export const WORKPLACES = ["Fabrika", "Üniversite", "Laboratuvar", "Ofis"] as const;

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  RAMAK_KALA: "Ramak Kala",
  TEHLIKELI_DURUM: "Tehlikeli Durum",
  SIKAYET: "Şikayet",
  ONERI: "Öneri",
  TALEP: "Talep",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  BEKLIYOR: "Bekliyor",
  INCELENIYOR: "İnceleniyor",
  COZULDU: "Sorun Çözüldü",
};

export const REPORT_STATUS_STYLES: Record<ReportStatus, string> = {
  BEKLIYOR: "bg-amber-100 text-amber-800 border-amber-200",
  INCELENIYOR: "bg-blue-100 text-blue-800 border-blue-200",
  COZULDU: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const REPORT_TYPE_STYLES: Record<ReportType, string> = {
  RAMAK_KALA: "bg-orange-100 text-orange-800 border-orange-200",
  TEHLIKELI_DURUM: "bg-red-100 text-red-800 border-red-200",
  SIKAYET: "bg-slate-100 text-slate-700 border-slate-200",
  ONERI: "bg-sky-100 text-sky-800 border-sky-200",
  TALEP: "bg-violet-100 text-violet-800 border-violet-200",
};
