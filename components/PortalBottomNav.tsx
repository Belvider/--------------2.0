"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  Building2,
  CreditCard,
  House,
  LogOut,
  MoreHorizontal,
  Package,
  ShieldCheck,
  UserCircle,
  Wrench,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/ui";
import { AccessibleDialog } from "@/components/AccessibleDialog";

type NavItem = { href: Route; label: string; icon: ComponentType<{ className?: string }> };

const MAIN_LINKS: NavItem[] = [
  { href: "/dashboard", label: "Головна", icon: House },
  { href: "/brands",    label: "Бренди",   icon: Building2 },
  { href: "/profile",   label: "Профіль",  icon: UserCircle }
];

const MORE_LINKS: NavItem[] = [
  { href: "/services",     label: "Сервіс",    icon: Wrench },
  { href: "/accessories",  label: "Аксесуари", icon: Package },
  { href: "/credits",      label: "Кредити",   icon: CreditCard }
];

const ADMIN_LINKS: NavItem[] = [
  { href: "/dashboard", label: "Головна", icon: House },
  { href: "/brands",    label: "Бренди",   icon: Building2 },
  { href: "/profile",   label: "Профіль",  icon: UserCircle },
  { href: "/admin",     label: "Адмін",    icon: ShieldCheck }
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
}

export function PortalBottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Закриваємо "Ще" при переході на нову сторінку
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Повертаємо скрол і фокус, якщо ширина змінилась на desktop.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMoreOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const isAdmin = role === "ADMIN" || role === "MANAGER";
  const mainLinks = isAdmin ? ADMIN_LINKS : MAIN_LINKS;

  // Перевіряємо чи активний якийсь "More" розділ
  const moreIsActive = MORE_LINKS.some((l) => isActive(pathname, l.href));

  return (
    <>
      {/* ── Дровер "Ще" ── */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[58] bg-[rgba(6,8,16,0.7)] backdrop-blur-[8px] lg:hidden"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] z-[59] lg:hidden">
            <AccessibleDialog label="Додаткові розділи" onClose={() => setMoreOpen(false)}
              className="mx-3 mb-2 max-h-[65dvh] overflow-y-auto rounded-[20px] border border-white/10 bg-[rgba(12,9,22,0.96)] p-2 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] backdrop-blur-[24px]">
              <div className="mb-2 flex items-center justify-between px-2 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Навчальні розділи</p>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="flex size-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-500 hover:text-white"
                  aria-label="Закрити"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {MORE_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-[14px] border px-3 py-3.5 text-center transition",
                        active
                          ? "border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.1)] text-[color:var(--brand-strong)]"
                          : "border-white/[0.07] bg-white/[0.025] text-slate-400 hover:border-white/[0.12] hover:text-white"
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      <span className="text-[11px] font-semibold">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              {isAdmin && <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {[
                  { href: "/admin/users", label: "Команда" },
                  { href: "/admin/reports", label: "Звіти" },
                  { href: "/admin/content", label: "Контент" },
                  { href: "/admin/assignments", label: "Траєкторії" },
                  { href: "/admin/audit", label: "Аудит" }
                ].map((link) => <Link key={link.href} href={link.href as Route} onClick={() => setMoreOpen(false)}
                  className="focus-ring rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">{link.label}</Link>)}
              </div>}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <button type="button" className="focus-ring rounded-full px-3 py-2 text-sm text-slate-300" aria-haspopup="dialog"
                  onClick={() => { setMoreOpen(false); window.dispatchEvent(new Event("portal:open-search")); }}>Пошук</button>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-300">
                    <LogOut className="size-4" aria-hidden="true" />Вийти
                  </button>
                </form>
              </div>
            </AccessibleDialog>
          </div>
        </>
      )}

      {/* ── Bottom navigation bar ── */}
      <nav className="portal-bottom-nav" aria-label="Навігація">
        <div className="portal-bottom-nav-inner">

          {/* Основні посилання */}
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "portal-bottom-nav-item focus-ring",
                  active ? "portal-bottom-nav-item-active" : "portal-bottom-nav-item-idle"
                )}
              >
                {active && <span className="portal-bottom-nav-indicator" aria-hidden="true" />}
                <Icon className="portal-bottom-nav-icon" aria-hidden="true" />
                <span className="portal-bottom-nav-label">{link.label}</span>
              </Link>
            );
          })}

          {/* Додаткові розділи і вихід для всіх ролей */}
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={cn(
                "portal-bottom-nav-item focus-ring",
                moreOpen || moreIsActive ? "portal-bottom-nav-item-active" : "portal-bottom-nav-item-idle"
              )}
              aria-expanded={moreOpen}
              aria-label="Показати більше розділів"
            >
              {(moreOpen || moreIsActive) && <span className="portal-bottom-nav-indicator" aria-hidden="true" />}
              {moreOpen
                ? <X className="portal-bottom-nav-icon" aria-hidden="true" />
                : <MoreHorizontal className="portal-bottom-nav-icon" aria-hidden="true" />
              }
              <span className="portal-bottom-nav-label">Ще</span>
            </button>

        </div>
      </nav>
    </>
  );
}
