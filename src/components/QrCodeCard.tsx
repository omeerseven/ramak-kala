import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";

function resolveSiteUrl(): string {
  // Vercel'in otomatik sağladığı kalıcı prod alan adı (ör. ramak-kala.vercel.app).
  // Mevcutsa her zaman bunu kullan; böylece NEXT_PUBLIC_SITE_URL yanlış/eski
  // girilse veya hiç girilmese bile QR kod prod'da doğru adrese gider.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Yerel geliştirme / telefonla LAN testi için elle ayarlanan adres.
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return "http://localhost:3000";
}

export async function QrCodeCard() {
  const siteUrl = resolveSiteUrl();
  const targetUrl = `${siteUrl.replace(/\/$/, "")}/bildir`;

  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 320,
    margin: 2,
    color: {
      dark: "#0f1b3c",
      light: "#ffffff",
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-navy-900">
        <QrCode className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold">Bildirim QR Kodu</h3>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrDataUrl}
        alt="Bildirim formuna yönlendiren QR kod"
        className="h-56 w-56 rounded-lg border border-slate-100"
      />

      <p className="text-center text-xs text-slate-500 break-all">{targetUrl}</p>

      <a
        href={qrDataUrl}
        download="ramak-kala-qr-kod.png"
        className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
      >
        <Download className="h-4 w-4" />
        QR Kodu İndir
      </a>
    </div>
  );
}
