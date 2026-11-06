import type { ReportStatus, ReportType } from "@prisma/client";
import {
  REPORT_STATUS_LABELS,
  REPORT_STATUS_STYLES,
  REPORT_TYPE_LABELS,
  REPORT_TYPE_STYLES,
} from "@/lib/labels";

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${REPORT_STATUS_STYLES[status]}`}
    >
      {REPORT_STATUS_LABELS[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: ReportType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${REPORT_TYPE_STYLES[type]}`}
    >
      {REPORT_TYPE_LABELS[type]}
    </span>
  );
}
