import type { Role } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { BrandMark } from "@/components/BrandMark";
import { PortalBottomNav } from "@/components/PortalBottomNav";
import { SearchTrigger } from "@/components/SearchTrigger";
import { UserAvatar } from "@/components/UserAvatar";

type AdminShellProps = {
  user: {
    name: string;
    avatarUrl?: string | null;
    role: Role;
    department: string;
    store: string | null;
  };
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1720px] px-3 py-3 sm:px-6 lg:px-8 lg:py-6">

      {/* ── Мобільний top bar ── */}
      <header className="portal-mobile-topbar lg:hidden">
        <BrandMark size="sm" href="/admin" className="!rounded-none !border-0 !bg-transparent !p-0" imageClassName="!h-9 !w-auto" />
        <Link href="/profile" className="focus-ring portal-mobile-topbar-avatar" aria-label="Профіль">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" className="portal-profile-avatar" />
        </Link>
      </header>

      {/* ── Desktop top bar ── */}
      <div className="portal-topbar hidden lg:flex">
        <div className="portal-topbar-brand">
          <BrandMark size="lg" href="/admin" className="portal-brand-standalone !rounded-none !border-0 !bg-transparent !px-0 !py-0" imageClassName="translate-x-0" />
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Admin
          </span>
          <SearchTrigger />
          <Link href="/profile" className="focus-ring portal-profile-dock">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" className="portal-profile-avatar" />
            <div className="portal-profile-copy">
              <span className="portal-profile-overline">Профіль</span>
              <span className="portal-profile-name">{user.name}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Основний контент ── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">

        {/* ── Admin Sidebar ── */}
        <aside className="card portal-sidebar hidden h-fit p-2.5 sm:p-3 lg:sticky lg:top-4 lg:block">
          {/* Заголовок секції */}
          <div className="mb-3 flex items-center gap-2.5 px-1 py-1">
            <div className="flex size-8 items-center justify-center rounded-[8px] border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.1)]">
              <ShieldCheck className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Адміністрування</p>
              <p className="mt-0.5 text-xs font-semibold text-white/80">{user.name}</p>
            </div>
          </div>

          {/* Навігація */}
          <AdminNav />

          {/* Роздільник + повернення */}
          <div className="mt-3 border-t border-white/[0.06] pt-3 space-y-1">
            <Link
              href="/dashboard"
              className="focus-ring flex items-center gap-3 rounded-[14px] border border-transparent px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-white/[0.03] hover:text-slate-300"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] border border-transparent bg-transparent">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </span>
              <span>До порталу</span>
            </Link>

            <form action="/api/auth/logout" method="post">
              <button type="submit" className="focus-ring portal-sidebar-logout w-full">
                <span className="portal-nav-icon-shell">
                  <LogOut className="size-4" aria-hidden="true" />
                </span>
                <span className="portal-nav-label">Вийти</span>
              </button>
            </form>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 space-y-4 pb-24 sm:space-y-5 lg:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <PortalBottomNav role={user.role} />
    </div>
  );
}
