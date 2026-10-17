"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Layers3, Search, Sparkles, SwatchBook } from "lucide-react";
import { getBrandVisual } from "@/lib/brand-visuals";
import { compareUkText } from "@/lib/ui";

type BrandCatalogExplorerProps = {
  brands: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string;
    categories: {
      id: number;
      name: string;
      slug: string;
      modulesCount: number;
    }[];
  }[];
};

type FilterKey = "all" | "new" | "largest" | "compact";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Усі бренди" },
  { key: "new", label: "Нові напрями" },
  { key: "largest", label: "Найбільше модулів" },
  { key: "compact", label: "Швидкий старт" }
];

const NEW_BRAND_SLUGS = new Set(["harman", "whoop", "portable-power"]);

const BRAND_CONTEXT: Record<string, string> = {
  apple: "Екосистема та преміальна техніка",
  dyson: "Технології догляду та клімату",
  garmin: "Навігація, спорт і outdoor",
  marshall: "Портативне та домашнє аудіо",
  jbl: "Bluetooth-аудіо й lifestyle-пристрої",
  playstation: "Консолі, ігри та периферія",
  cameras: "Фото, відео та креативні сценарії",
  smeg: "Дизайнерська кухонна техніка",
  harman: "Преміальне аудіо та car electronics",
  whoop: "Відновлення, fitness і performance",
  "portable-power": "Живлення, автономність і backup power"
};

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export function BrandsCatalogExplorer({ brands }: BrandCatalogExplorerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const preparedBrands = useMemo(
    () =>
      brands.map((brand) => {
        const modulesCount = brand.categories.reduce((sum, category) => sum + category.modulesCount, 0);
        const featuredCategories = [...brand.categories]
          .sort(
            (left, right) =>
              right.modulesCount - left.modulesCount || compareUkText(left.name, right.name) || left.id - right.id
          )
          .slice(0, 3);

        return {
          ...brand,
          modulesCount,
          categoryCount: brand.categories.length,
          featuredCategories,
          isNew: NEW_BRAND_SLUGS.has(brand.slug),
          contextLabel: BRAND_CONTEXT[brand.slug] ?? "Продуктові модулі та практичні сценарії"
        };
      }),
    [brands]
  );

  const filteredBrands = useMemo(() => {
    const normalizedQuery = normalizeQuery(query);

    return preparedBrands.filter((brand) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "new"
            ? brand.isNew
            : filter === "largest"
              ? brand.modulesCount >= 6
              : brand.categoryCount <= 2 || brand.modulesCount <= 4;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        brand.name,
        brand.slug,
        brand.description ?? "",
        brand.contextLabel,
        ...brand.categories.map((category) => category.name)
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [preparedBrands, query, filter]);

  const largestBrand = useMemo(
    () =>
      [...preparedBrands].sort(
        (left, right) => right.modulesCount - left.modulesCount || compareUkText(left.name, right.name) || left.id - right.id
      )[0],
    [preparedBrands]
  );

  const newestBrands = useMemo(() => preparedBrands.filter((brand) => brand.isNew).slice(0, 3), [preparedBrands]);

  return (
    <>
      <section className="card p-4 sm:p-6 xl:p-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="portal-chip">Навігація по каталогу</span>
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {filteredBrands.length} у фокусі
              </span>
            </div>

            <div>
              <h2 className="portal-display-title text-2xl text-ink sm:text-[2rem]">
                Знайдіть бренд швидше, ніж відкриється наступне питання клієнта
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                Тут ми зібрали всі брендові напрями в один компактний каталог. Можна шукати по бренду, продукту або
                категорії й одразу переходити в потрібну гілку навчання без зайвих кроків.
              </p>
            </div>

            <label className="focus-within:border-[color:var(--brand-strong)]/60 flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 transition">
              <Search className="size-4 text-slate-500" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Пошук по бренду, категорії або сценарію"
                className="focus-ring w-full bg-transparent text-sm text-white placeholder:text-slate-500"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => {
                const isActive = option.key === filter;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFilter(option.key)}
                    className={`focus-ring inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                      isActive
                        ? "border border-[color:var(--brand-strong)]/40 bg-[color:var(--brand-strong)]/15 text-[color:var(--brand-strong)]"
                        : "border border-white/10 bg-white/[0.025] text-slate-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.025] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Найобʼємніший бренд</p>
                  <p className="portal-display-title-tight mt-3 text-2xl text-ink">{largestBrand?.name ?? "—"}</p>
                </div>
                <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[color:var(--brand-strong)]">
                  <Layers3 className="size-5" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {largestBrand ? `${largestBrand.modulesCount} модулів у ${largestBrand.categoryCount} категоріях.` : "Каталог ще наповнюється."}
              </p>
              {largestBrand ? (
                <Link
                  href={`/brands/${largestBrand.slug}`}
                  className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]"
                >
                  Перейти до бренду
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.025] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Нові напрями</p>
                  <p className="mt-3 font-[var(--font-heading)] text-2xl font-semibold text-ink">{newestBrands.length}</p>
                </div>
                <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[color:var(--brand-strong)]">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {newestBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`#brand-${brand.slug}`}
                    className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.05]"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredBrands.map((brand) => {
          const visual = getBrandVisual(brand.slug, brand.logoUrl);

          return (
            <article
              id={`brand-${brand.slug}`}
              key={brand.id}
              className="card group flex h-full flex-col p-4 hover-glow sm:p-5"
            >
              {/* Шапка: назва + "Новий" badge */}
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-[var(--font-heading)] text-xl font-semibold text-white">{brand.name}</h2>
                {brand.isNew && (
                  <span className="mt-0.5 flex-none rounded-full border border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.1)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                    Новий
                  </span>
                )}
              </div>

              {/* Опис */}
              <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">
                {brand.contextLabel}
              </p>

              {/* Зображення */}
              <div className="relative mt-4 h-[148px] overflow-hidden rounded-[14px] border border-white/[0.065] bg-white/[0.02] sm:h-[172px]">
                <Image
                  src={visual.src}
                  alt={`Прев'ю бренду ${brand.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className={visual.cardImageClassName ?? "object-contain p-3 sm:p-4"}
                />
              </div>

              {/* Категорії — прості теги */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {brand.featuredCategories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-white/[0.065] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-slate-400"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {/* Лічильники */}
              <div className="mt-3 flex gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Layers3 className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  {brand.categoryCount} категорій
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <SwatchBook className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  {brand.modulesCount} модулів
                </span>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-4">
                <Link
                  href={`/brands/${brand.slug}`}
                  aria-label={`Відкрити бренд ${brand.name}`}
                  className="focus-ring bg-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
                >
                  Відкрити бренд
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {filteredBrands.length === 0 ? (
        <section className="card p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="inline-flex size-11 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Search className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="portal-display-title text-2xl text-ink">Нічого не знайшли по цьому запиту</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Спробуйте шукати по бренду, коротшій назві категорії або переключіться на інший фільтр. Наприклад:
                Apple, аудіо, аксесуари, portable, whoop.
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
