"use client";

import { getRequestError } from "@/lib/http-client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  FilePenLine,
  LayoutTemplate,
  Loader2,
  Plus,
  Save,
  Trash2
} from "lucide-react";
import { AdminImageField } from "@/components/admin/AdminImageField";
import type { PortalCardIconKey, PortalPageCard, PortalPageContent, PortalPageSlug } from "@/lib/portal-pages";

type AdminPortalPageRow = {
  slug: PortalPageSlug;
  path: string;
  adminLabel: string;
  description: string;
  content: PortalPageContent;
};

type AdminPortalPagesTreeProps = {
  role: Role;
  pages: AdminPortalPageRow[];
};

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

export function AdminPortalPagesTree({ role, pages }: AdminPortalPagesTreeProps) {
  const router = useRouter();
  const isAdmin = role === "ADMIN";
  const [pageDrafts, setPageDrafts] = useState<Partial<Record<PortalPageSlug, PortalPageContent>>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPageDrafts(
      pages.reduce<Partial<Record<PortalPageSlug, PortalPageContent>>>((accumulator, page) => {
        accumulator[page.slug] = page.content;
        return accumulator;
      }, {})
    );
  }, [pages]);

  function getPageSource(slug: PortalPageSlug) {
    return pages.find((page) => page.slug === slug);
  }

  function mutatePageDraft(slug: PortalPageSlug, recipe: (current: PortalPageContent) => PortalPageContent) {
    const source = getPageSource(slug)?.content;
    if (!source) {
      return;
    }

    setPageDrafts((prev) => ({
      ...prev,
      [slug]: recipe(prev[slug] ?? source)
    }));
  }

  function updateCard(slug: PortalPageSlug, index: number, patch: Partial<PortalPageCard>) {
    mutatePageDraft(slug, (current) => ({
      ...current,
      cards: current.cards.map((card, currentIndex) => (currentIndex === index ? { ...card, ...patch } : card))
    }));
  }

  function addCard(slug: PortalPageSlug) {
    mutatePageDraft(slug, (current) => ({
      ...current,
      cards: [...current.cards, createEmptyCard()]
    }));
  }

  function removeCard(slug: PortalPageSlug, index: number) {
    mutatePageDraft(slug, (current) => ({
      ...current,
      cards: current.cards.length === 1 ? [createEmptyCard()] : current.cards.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  function moveCard(slug: PortalPageSlug, index: number, direction: "up" | "down") {
    mutatePageDraft(slug, (current) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.cards.length) {
        return current;
      }

      const nextCards = [...current.cards];
      const [card] = nextCards.splice(index, 1);
      nextCards.splice(targetIndex, 0, card);

      return {
        ...current,
        cards: nextCards
      };
    });
  }

  function savePage(slug: PortalPageSlug) {
    const draft = pageDrafts[slug];
    if (!draft || !isAdmin || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        setPendingKey(`portal-page:${slug}`);
        setNotice(null);
        setError(null);
  
        const response = await fetch("/api/admin/portal-pages", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slug,
            content: draft
          })
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося зберегти сторінку");
          setPendingKey(null);
          return;
        }
  
        setNotice(`Сторінку «${draft.title}» оновлено`);
        setPendingKey(null);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      } finally {
        setPendingKey(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      {notice ? (
        <div className="rounded-[22px] border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.1)] px-4 py-3 text-sm text-white">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[22px] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {pages.map((page) => {
        const draft = pageDrafts[page.slug] ?? page.content;

        return (
          <article key={page.slug} className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03]">
                    <LayoutTemplate className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-[var(--font-heading)] text-2xl font-semibold text-ink">{draft.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {page.adminLabel} · {page.slug}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{draft.subtitle}</p>
                <p className="mt-3 text-sm leading-7 text-slate-500">{page.description}</p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <a
                  href={page.path}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
                >
                  <Eye className="size-3.5" aria-hidden="true" />
                  Відкрити
                </a>
                {isAdmin ? (
                  <Link
                    href={`/admin/portal-pages/${page.slug}`}
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
                  >
                    <FilePenLine className="size-3.5" aria-hidden="true" />
                    Окремо
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {draft.label}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {draft.cards.length} карток
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {page.path}
              </span>
            </div>

            {isAdmin ? (
              <details className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <summary className="cursor-pointer list-none text-left text-sm font-semibold text-slate-100">Редагувати сторінку</summary>

                <div className="mt-4 grid gap-3">
                  <input
                    value={draft.label}
                    onChange={(event) =>
                      mutatePageDraft(page.slug, (current) => ({
                        ...current,
                        label: event.target.value
                      }))
                    }
                    placeholder="Малий лейбл"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                  <input
                    value={draft.title}
                    onChange={(event) =>
                      mutatePageDraft(page.slug, (current) => ({
                        ...current,
                        title: event.target.value
                      }))
                    }
                    placeholder="Заголовок сторінки"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                  <textarea
                    value={draft.subtitle}
                    onChange={(event) =>
                      mutatePageDraft(page.slug, (current) => ({
                        ...current,
                        subtitle: event.target.value
                      }))
                    }
                    rows={5}
                    placeholder="Підзаголовок сторінки"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                  <input
                    value={draft.sideLabel}
                    onChange={(event) =>
                      mutatePageDraft(page.slug, (current) => ({
                        ...current,
                        sideLabel: event.target.value
                      }))
                    }
                    placeholder="Заголовок акцентного блоку"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                  <textarea
                    value={draft.sideText}
                    onChange={(event) =>
                      mutatePageDraft(page.slug, (current) => ({
                        ...current,
                        sideText: event.target.value
                      }))
                    }
                    rows={4}
                    placeholder="Текст акцентного блоку"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100">Картки сторінки</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Структура нижнього блоку редагується тут так само, як ти працюєш із вкладеними сутностями у брендах.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addCard(page.slug)}
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Додати картку
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {draft.cards.map((card, index) => (
                    <div key={card.id} className="rounded-[24px] border border-white/10 bg-[rgba(8,10,18,0.18)] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-100">{card.title || `Картка ${index + 1}`}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {card.icon} · {card.href || "без посилання"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                              {card.items.length} пунктів
                            </span>
                            {card.imageUrl ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                                є зображення
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => moveCard(page.slug, index, "up")}
                            disabled={index === 0}
                            className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <ArrowUp className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCard(page.slug, index, "down")}
                            disabled={index === draft.cards.length - 1}
                            className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <ArrowDown className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCard(page.slug, index)}
                            className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-100"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <details className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.025] p-4">
                        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">Редагувати картку</summary>

                        <div className="mt-4 grid gap-3">
                          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
                            <input
                              value={card.title}
                              onChange={(event) => updateCard(page.slug, index, { title: event.target.value })}
                              placeholder="Заголовок картки"
                              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                            />
                            <select
                              value={card.icon}
                              onChange={(event) => updateCard(page.slug, index, { icon: event.target.value as PortalCardIconKey })}
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
                            onChange={(event) => updateCard(page.slug, index, { href: event.target.value })}
                            placeholder="Внутрішнє посилання, наприклад /services/trade-in"
                            className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                          />

                          <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
                            <AdminImageField
                              value={card.imageUrl}
                              onChange={(nextUrl) => updateCard(page.slug, index, { imageUrl: nextUrl })}
                              folder="portal-pages"
                              placeholder="URL зображення"
                            />
                            <input
                              value={card.imageAlt}
                              onChange={(event) => updateCard(page.slug, index, { imageAlt: event.target.value })}
                              placeholder="Alt текст для зображення"
                              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                            />
                          </div>

                          <textarea
                            value={card.text}
                            onChange={(event) => updateCard(page.slug, index, { text: event.target.value })}
                            rows={5}
                            placeholder="Основний текст картки"
                            className="focus-ring rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                          />

                          <textarea
                            value={card.items.join("\n")}
                            onChange={(event) => updateCard(page.slug, index, { items: splitLines(event.target.value) })}
                            rows={6}
                            placeholder="Кожен новий рядок = окремий пункт списку"
                            className="focus-ring rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                          />
                        </div>
                      </details>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => savePage(page.slug)}
                    disabled={isPending}
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
                  >
                    {pendingKey === `portal-page:${page.slug}` ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="size-4" aria-hidden="true" />
                    )}
                    Зберегти сторінку
                  </button>
                </div>
              </details>
            ) : null}
          </article>
        );
      })}

      {isPending && !pendingKey ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Застосовую зміни...
        </div>
      ) : null}
    </div>
  );
}
