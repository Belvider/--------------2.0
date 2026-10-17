"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { Building2, CreditCard, LayoutDashboard, Package, ShieldCheck, UserCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/ui";

type PortalNavProps = {
  role: Role;
  onNavigate?: () => void;
};

const links = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/brands", label: "Бренди", icon: Building2 },
  { href: "/services", label: "Сервіс", icon: Wrench },
  { href: "/accessories", label: "Аксесуари", icon: Package },
  { href: "/credits", label: "Кредити", icon: CreditCard },
  { href: "/profile", label: "Профіль", icon: UserCircle }
] as const;

export function PortalNav({ role, onNavigate }: PortalNavProps) {
  const pathname = usePathname();

  return (
    <nav className="portal-sidebar-nav">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn("focus-ring portal-nav-link group", active ? "portal-nav-link-active" : "portal-nav-link-idle")}
          >
            <span className={cn("portal-nav-icon-shell", active && "portal-nav-icon-shell-active")}>
              <Icon className="size-4 shrink-0" aria-hidden="true" />
            </span>
            <span className="portal-nav-label">{link.label}</span>
            <span className={cn("portal-nav-trail", active && "portal-nav-trail-active")} aria-hidden="true" />
          </Link>
        );
      })}

      {(role === "ADMIN" || role === "MANAGER") && (
        <Link
          href="/admin"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/admin") ? "page" : undefined}
          className={cn(
            "focus-ring portal-nav-link group",
            pathname.startsWith("/admin") ? "portal-nav-link-active" : "portal-nav-link-idle"
          )}
        >
          <span className={cn("portal-nav-icon-shell", pathname.startsWith("/admin") && "portal-nav-icon-shell-active")}>
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          </span>
          <span className="portal-nav-label">Адмін</span>
          <span
            className="rounded-full border border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]"
            aria-hidden="true"
          >
            {role === "ADMIN" ? "ADM" : "MGR"}
          </span>
        </Link>
      )}
    </nav>
  );
}
