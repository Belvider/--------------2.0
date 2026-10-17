"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  BadgePercent,
  Cable,
  Headphones,
  MessagesSquare,
  PackagePlus,
  Scale,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon
} from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import type { PortalCardIconKey, PortalPageContent } from "@/lib/portal-pages";

const iconMap: Record<PortalCardIconKey, LucideIcon> = {
  "shield-check": ShieldCheck,
  wrench: Wrench,
  headphones: Headphones,
  "badge-percent": BadgePercent,
  "messages-square": MessagesSquare,
  scale: Scale,
  cable: Cable,
  sparkles: Sparkles,
  "package-plus": PackagePlus
};

type PortalContentPageProps = {
  user: ComponentProps<typeof PortalShell>["user"];
  content: PortalPageContent;
};

export function PortalContentPage({ user, content }: PortalContentPageProps) {
  const totalItems = content.cards.reduce((sum, card) => sum + card.items.length, 0);

  return (
    <PortalShell user={user}>

      {/* ── Hero ── */}
      <section className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8 animate-fadeUp">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
          <div>
            <span className="portal-chip">{content.label}</span>
            <h1 className="portal-page-title mt-4">{content.title}</h1>
            <p className="portal-subtitle mt-4 max-w-3xl">{content.subtitle}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Розділів</p>
              <p className="mt-2.5 font-[var(--font-heading)] text-3xl font-semibold text-ink">{content.cards.length}</p>
              <p className="mt-1 text-xs text-slate-500">{totalItems} навчальних пунктів</p>
            </div>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{content.sideLabel}</p>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">{content.sideText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Карточки ── */}
      <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-fadeUp" style={{ animationDelay: "120ms" }}>
        {content.cards.map((card, index) => {
          const Icon = iconMap[card.icon] ?? Sparkles;

          return (
            <article key={card.id} className="card group flex min-w-0 h-full flex-col p-4 hover-glow sm:p-5">
              {card.imageUrl && /^(\/[^/]|https?:\/\/)/i.test(card.imageUrl) && <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.imageUrl} alt={card.imageAlt || card.title} loading="lazy"
                  className="h-44 w-full object-contain" referrerPolicy="no-referrer" />
              </div>}

              {/* Шапка карточки */}
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex size-10 flex-none items-center justify-center rounded-[10px] border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.1)]">
                  <Icon className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                </div>
                <span className="font-[var(--font-heading)] text-[1.5rem] font-semibold leading-none text-white/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Назва */}
              <h2 className="mt-4 font-[var(--font-heading)] text-xl font-semibold leading-tight text-white sm:text-2xl">
                {card.title}
              </h2>

              {/* Опис */}
              {card.text && (
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
              )}

              {/* Пункти */}
              {card.items.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {card.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-[10px] border border-white/[0.065] bg-white/[0.02] px-3 py-2.5 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 flex size-4 flex-none items-center justify-center rounded-full bg-[rgba(40,178,158,0.14)] text-[9px] font-bold text-[color:var(--brand-strong)]">
                        {i + 1}
                      </span>
                      <span className="leading-5">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA */}
              {card.href && (
                <div className="mt-auto pt-5">
                  <Link
                    href={card.href as Route}
                    className="focus-ring bg-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
                  >
                    Відкрити матеріал
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </section>

    </PortalShell>
  );
}
