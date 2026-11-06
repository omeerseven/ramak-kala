import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

export function AdminHeader({ adminUsername }: { adminUsername: string }) {
  return (
    <header className="border-b border-navy-900/10 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
            <ShieldAlert className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg tracking-tight">Ramak Kala Panel</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-white/70 sm:inline">
            {adminUsername}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
