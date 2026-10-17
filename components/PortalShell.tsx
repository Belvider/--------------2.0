import type { Role } from "@prisma/client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { PortalBottomNav } from "@/components/PortalBottomNav";
import { PortalMobileHeader } from "@/components/PortalMobileHeader";
import { PortalNav } from "@/components/PortalNav";
import { SearchTrigger } from "@/components/SearchTrigger";
import { UserAvatar } from "@/components/UserAvatar";

type PortalShellProps = {
  user: {
    name: string;
    avatarUrl?: string | null;
    role: Role;
    department: string;
    store: string | null;
  };
  children: React.ReactNode;
};

export function PortalShell({ user, children }: PortalShellProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1720px] px-3 py-3 sm:px-6 lg:px-8 lg:py-6">

      {/* ── Мобільний top bar ── */}
      <div className="lg:hidden">
        <PortalMobileHeader user={{ name: user.name, avatarUrl: user.avatarUrl, role: user.role }} />
      </div>

      {/* ── Desktop top bar ── */}
      <div className="portal-topbar hidden lg:flex">
        <div className="portal-topbar-brand">
          <BrandMark size="lg" className="portal-brand-standalone !rounded-none !border-0 !bg-transparent !px-0 !py-0" />
        </div>
        <SearchTrigger />
        <Link href="/profile" className="focus-ring portal-profile-dock">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" className="portal-profile-avatar" />
          <div className="portal-profile-copy">
            <span className="portal-profile-overline">Профіль</span>
            <span className="portal-profile-name">{user.name}</span>
          </div>
        </Link>
      </div>

      {/* ── Основний контент ── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[312px_minmax(0,1fr)] xl:gap-6">

        {/* Desktop sidebar */}
        <aside className="card portal-sidebar hidden h-fit p-2.5 sm:p-3 lg:sticky lg:top-4 lg:block">
          <PortalNav role={user.role} />
          <form action="/api/auth/logout" method="post" className="portal-sidebar-footer">
            <button type="submit" className="focus-ring portal-sidebar-logout">
              <span className="portal-nav-icon-shell">
                <LogOut className="size-4" aria-hidden="true" />
              </span>
              <span className="portal-nav-label">Вийти</span>
              <span className="portal-nav-trail" aria-hidden="true" />
            </button>
          </form>
        </aside>

        {/* Main content — bottom padding для mobile bottom nav */}
        <main className="min-w-0 space-y-4 pb-24 sm:space-y-5 lg:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav — fixed ── */}
      <PortalBottomNav role={user.role} />
    </div>
  );
}
