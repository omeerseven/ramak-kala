import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
            <ShieldAlert className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg tracking-tight">Ramak Kala</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/bildir"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Bildirim Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}
