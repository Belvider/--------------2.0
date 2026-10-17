"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, X } from "lucide-react";
import { AccessibleDialog } from "@/components/AccessibleDialog";

const STORAGE_KEY = "portal_onboarded_v1";

type OnboardingModalProps = {
  firstName: string;
  totalModules: number;
  userId?: string;
};

export function OnboardingModal({ firstName, totalModules, userId }: OnboardingModalProps) {
  const [show, setShow] = useState(false);
  const storageKey = `${STORAGE_KEY}:${userId ?? firstName}`;

  useEffect(() => {
    try {
      const done = localStorage.getItem(storageKey);
      if (!done) setShow(true);
    } catch { /* ignore */ }
  }, [storageKey]);

  function dismiss() {
    try { localStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      style={{ background: "rgba(7, 5, 14, 0.82)", backdropFilter: "blur(12px)" }}
      onClick={dismiss}
    >
      <AccessibleDialog label="Ласкаво просимо до порталу" onClose={dismiss}
        className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[20px] border border-white/10 bg-[rgba(13,10,22,0.98)] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] sm:p-8"
      >
        {/* Закрити */}
        <button
          type="button"
          onClick={dismiss}
          className="focus-ring absolute right-4 top-4 rounded-[8px] p-1.5 text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
          aria-label="Закрити"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {/* Контент */}
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-[12px] border border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)]">
            <BookOpenCheck className="size-6 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">PineApple Portal</p>
            <h1 className="mt-0.5 font-[var(--font-heading)] text-xl font-semibold text-white">
              Привіт, {firstName}!
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-500">
          Ласкаво просимо до навчального порталу. Тут {totalModules}+ модулів по всіх брендах і продуктах, тести і сертифікати.
        </p>

        <div className="mt-6 space-y-3">
          {[
            { label: "Оберіть бренд", sub: "Каталог розбитий по напрямках — Apple, Dyson, Garmin та інші" },
            { label: "Пройдіть модуль і тест", sub: "Прохідний бал і кількість спроб зазначені на сторінці тесту" },
            { label: "Отримайте сертифікат", sub: "Після успішного тесту — автоматичний сертифікат у профілі" }
          ].map((step, i) => {
            return (
              <div key={i} className="flex items-start gap-3 rounded-[12px] border border-white/[0.065] bg-white/[0.02] px-3.5 py-3">
                <div className="flex size-6 flex-none items-center justify-center rounded-full bg-[rgba(40,178,158,0.14)] text-[10px] font-bold text-[color:var(--brand-strong)]">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{step.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/brands"
            onClick={dismiss}
            className="focus-ring bg-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
          >
            Відкрити каталог
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="focus-ring inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.04] sm:w-auto"
          >
            Подивлюся сам
          </button>
        </div>
      </AccessibleDialog>
    </div>
  );
}
