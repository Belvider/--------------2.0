"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderKanban,
  History,
  LayoutDashboard,
  Target,
  Users2
} from "lucide-react";
import { cn } from "@/lib/ui";

type NavLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const LINKS: NavLink[] = [
  { href: "/admin",             label: "Огляд",         icon: LayoutDashboard, exact: true },
  { href: "/admin/users",       label: "Команда",       icon: Users2 },
  { href: "/admin/reports",     label: "Звіти",         icon: BarChart3 },
  { href: "/admin/content",     label: "Контент",       icon: FolderKanban },
  { href: "/admin/assignments", label: "Траєкторії",    icon: Target },
  { href: "/admin/audit",       label: "Аудит",         icon: History }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="portal-sidebar-nav" aria-label="Адмін-навігація">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href as Route}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring portal-nav-link group",
              active ? "portal-nav-link-active" : "portal-nav-link-idle"
            )}
          >
            <span className={cn("portal-nav-icon-shell", active && "portal-nav-icon-shell-active")}>
              <Icon className="size-4 shrink-0" aria-hidden="true" />
            </span>
            <span className="portal-nav-label">{link.label}</span>
            <span className={cn("portal-nav-trail", active && "portal-nav-trail-active")} aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
