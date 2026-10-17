"use client";

import { getRequestError } from "@/lib/http-client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  Plus,
  Save,
  Trash2
} from "lucide-react";
import { AdminImageField } from "@/components/admin/AdminImageField";
import type { PortalCardIconKey, PortalPageCard, PortalPageContent } from "@/lib/portal-pages";
import { portalPageMeta } from "@/lib/portal-pages";

const iconOptions: Array<{ value: PortalCardIconKey; label: string }> = [
  { value: "shield-check", label: "Гарантія / щит" },
  { value: "wrench", label: "Сервіс / ремонт" },
  { value: "headphones", label: "Підтримка / гарнітура" },
  { value: "badge-percent", label: "Кредит / відсоток" },
  { value: "messages-square", label: "Скрипти / комунікація" },
  { value: "scale", label: "Етика / баланс" },
  { value: "cable", label: "Сумісність / кабель" },
  { value: "sparkles", label: "Акцент / upsell" },
  { value: "package-plus", label: "Комплект / набір" }
];

function createEmptyCard(): PortalPageCard {
  return {
    id: `card-${Math.random().toString(36).slice(2, 8)}`,
    title: "Нова картка",
    icon: "sparkles",
    text: "",
    items: [],
    imageUrl: "",
    imageAlt: "",
    href: ""
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

type AdminPortalPageEditorProps = {
  page: PortalPageContent;
};

export function AdminPortalPageEditor({ page }: AdminPortalPageEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(page);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const meta = portalPageMeta[content.slug];

  function updateCard(index: number, patch: Partial<PortalPageCard>) {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.map((card, currentIndex) => (currentIndex === index ? { ...card, ...patch } : card))
    }));
  }

  function addCard() {
    setContent((prev) => ({
      ...prev,
      cards: [...prev.cards, createEmptyCard()]
    }));
  }

  function removeCard(index: number) {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.length === 1 ? [createEmptyCard()] : prev.cards.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  function moveCard(index: number, direction: "up" | "down") {
    setContent((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= prev.cards.length) {
        return prev;
      }

      const nextCards = [...prev.cards];
      const [card] = nextCards.splice(index, 1);
      nextCards.splice(targetIndex, 0, card);

      return {
        ...prev,
        cards: nextCards
      };
    });
  }

  function savePage() {
    if (isPending) return;
    startTransition(async () => {
      try {
        setNotice(null);
        setError(null);
  
        const response = await fetch("/api/admin/portal-pages", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slug: content.slug,
            content
          })
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося зберегти сторінку");
          return;
        }
  
        setNotice(`Сторінку «${content.title}» оновлено`);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      }
    });
  }

  return (
    <section className="space-y-4">
      <section className="card relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(40,178,158,0.16),transparent_26%),linear-gradient(145deg,rgba(255,255,255,0.04),transparent_54%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/admin" className="underline">
                Адмін-панель
              </Link>
              <span>/</span>
              <span className="text-slate-300">Редактор сторінки порталу</span>
            </div>

            <span className="portal-chip mt-5 inline-flex">Контент поза брендами</span>
            <h1 className="portal-page-title mt-4">{content.title}</h1>
            <p className="portal-subtitle mt-3 max-w-3xl">
              Тут ми керуємо окремими сторінками порталу: текстами, акцентами, картками, фото і структурою блоків для
              сервісу, кредитів та аксесуарів.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {meta.adminLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {content.cards.length} карток
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                Маршрут: {meta.route}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <a
              href={meta.route}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/[0.04]"
            >
              <Eye className="size-4" aria-hidden="true" />
              Відкрити сторінку
            </a>
            <button
              type="button"
              onClick={savePage}
              disabled={isPending}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-ink px-4 py-3 text-sm font-medium text-white transition disabled:opacity-60"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              Зберегти сторінку
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
        <article className="card xl:self-start xl:sticky xl:top-24 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <LayoutTemplate className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Параметри сторінки</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Hero та метадані</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              value={content.label}
              onChange={(event) => setContent((prev) => ({ ...prev, label: event.target.value }))}
              placeholder="Малий лейбл"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <input
              value={content.title}
              onChange={(event) => setContent((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Заголовок сторінки"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <textarea
              value={content.subtitle}
              onChange={(event) => setContent((prev) => ({ ...prev, subtitle: event.target.value }))}
              rows={6}
              placeholder="Підзаголовок сторінки"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <input
              value={content.sideLabel}
              onChange={(event) => setContent((prev) => ({ ...prev, sideLabel: event.target.value }))}
              placeholder="Заголовок правого акцентного блоку"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <textarea
              value={content.sideText}
              onChange={(event) => setContent((prev) => ({ ...prev, sideText: event.target.value }))}
              rows={5}
              placeholder="Текст правого акцентного блоку"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
          </div>

          {notice ? <p className="mt-4 text-sm text-emerald-300">{notice}</p> : null}
          {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
        </article>

        <article className="card p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <ImagePlus className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Контент сторінки</p>
                  <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Картки, тексти та фото</h2>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Для кожної картки можна окремо задати заголовок, іконку, текст, список тез і фото. Якщо список не
                потрібен, достатньо залишити тільки текстовий блок.
              </p>
            </div>

            <button
              type="button"
              onClick={addCard}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
            >
              <Plus className="size-4" aria-hidden="true" />
              Додати картку
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {content.cards.map((card, index) => (
              <section key={card.id} className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,10,18,0.14))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Картка {index + 1}</p>
                    <p className="mt-2 text-base font-medium text-slate-100">{card.title || "Без назви"}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveCard(index, "up")}
                      disabled={index === 0}
                      className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCard(index, "down")}
                      disabled={index === content.cards.length - 1}
                      className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-100"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
                    <input
                      value={card.title}
                      onChange={(event) => updateCard(index, { title: event.target.value })}
                      placeholder="Заголовок картки"
                      className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                    />
                    <select
                      value={card.icon}
                      onChange={(event) => updateCard(index, { icon: event.target.value as PortalCardIconKey })}
                      className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    value={card.href ?? ""}
                    onChange={(event) => updateCard(index, { href: event.target.value })}
                    placeholder="Внутрішнє посилання, наприклад /services/trade-in"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />

                  <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
                    <AdminImageField
                      value={card.imageUrl}
                      onChange={(nextUrl) => updateCard(index, { imageUrl: nextUrl })}
                      folder="portal-pages"
                      placeholder="URL зображення"
                    />
                    <input
                      value={card.imageAlt}
                      onChange={(event) => updateCard(index, { imageAlt: event.target.value })}
                      placeholder="Alt текст для зображення"
                      className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                    />
                  </div>

                  <textarea
                    value={card.text}
                    onChange={(event) => updateCard(index, { text: event.target.value })}
                    rows={5}
                    placeholder="Основний текст картки"
                    className="focus-ring rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                  />

                  <textarea
                    value={card.items.join("\n")}
                    onChange={(event) => updateCard(index, { items: splitLines(event.target.value) })}
                    rows={6}
                    placeholder="Кожен новий рядок = окремий пункт списку"
                    className="focus-ring rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                  />
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
