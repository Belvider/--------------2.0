"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ModuleCatalogProduct, ModuleContentBlock } from "@/lib/module-content";
import { getVideoSource } from "@/lib/video-source";
import { getRequestError, requestJson } from "@/lib/http-client";

type ModuleViewerProps = {
  moduleId: number;
  blocks: ModuleContentBlock[];
  initialProgressPct: number;
  hasQuiz: boolean;
};

type ModuleViewerPage = {
  title: string;
  blocks: ModuleContentBlock[];
  blockIndexes: number[];
  preview: {
    src: string;
    alt: string;
  } | null;
};

const ALL_FILTER_KEY = "all";
const SIMPLE_BLOCKS_PER_PAGE = 3;

const colorToneMap: Record<string, string> = {
  black: "#202124",
  "space black": "#171717",
  white: "#f7f8fa",
  silver: "#d9dde2",
  "space gray": "#5f6368",
  graphite: "#5f6368",
  gold: "#d0b085",
  "light gold": "#e3ccb1",
  "natural titanium": "#9a8f82",
  "black titanium": "#3c3d42",
  "white titanium": "#f0f2f4",
  "blue titanium": "#7e8ca2",
  "desert titanium": "#b58d6a",
  "pacific blue": "#6f94ab",
  "sierra blue": "#9fb7d6",
  blue: "#7ca7ff",
  "deep blue": "#285da8",
  "mist blue": "#a9c7e8",
  "sky blue": "#9fd3f5",
  ultramarine: "#3549d8",
  teal: "#51b8b0",
  green: "#76ad90",
  "midnight green": "#5c6b60",
  "alpine green": "#667a66",
  red: "#c83d3d",
  yellow: "#f2d260",
  coral: "#ef8d7f",
  pink: "#f4b4cf",
  purple: "#b39adf",
  "deep purple": "#655089",
  lavender: "#c7b7ef",
  sage: "#9eaf95",
  starlight: "#ece6d7",
  midnight: "#2f3647",
  orange: "#f48a3a",
  "cosmic orange": "#ed7b2f",
  "cloud white": "#f4f6f8"
};

function parseOverviewItem(item: string) {
  const separatorIndex = item.indexOf(":");

  if (separatorIndex === -1) {
    return {
      label: "Характеристика",
      value: item
    };
  }

  return {
    label: item.slice(0, separatorIndex).trim(),
    value: item.slice(separatorIndex + 1).trim()
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function isHeavyModuleBlock(block: ModuleContentBlock) {
  if (block.type === "productCatalog" || block.type === "video" || block.type === "pdf") {
    return true;
  }

  if (block.type === "text") {
    const plainText = stripHtml(block.html);
    return block.html.includes("<table") || plainText.length > 2200;
  }

  if (block.type === "facts") {
    return (block.items?.length ?? 0) > 8;
  }

  return false;
}

function getYouTubeThumbnail(url: string) {
  const match = url.match(/(?:embed\/|youtu\.be\/|v=)([^?&/]+)/);
  const videoId = match?.[1];

  if (!videoId) {
    return null;
  }

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getBlockPreview(block: ModuleContentBlock) {
  if (block.type === "image" && block.url) {
    return {
      src: block.url,
      alt: block.caption ?? block.title
    };
  }

  if (block.type === "productCatalog") {
    const firstProduct = block.products[0];
    const previewColor = firstProduct?.colors.find((color) => color.default) ?? firstProduct?.colors[0];

    if (previewColor?.imageUrl) {
      return {
        src: previewColor.imageUrl,
        alt: previewColor.caption || firstProduct?.title || block.title
      };
    }
  }

  if (block.type === "video" && block.url) {
    const thumbnailUrl = getYouTubeThumbnail(block.url);

    if (thumbnailUrl) {
      return {
        src: thumbnailUrl,
        alt: block.title
      };
    }
  }

  return null;
}

function getPagePreview(blocks: ModuleContentBlock[]) {
  for (const block of blocks) {
    const preview = getBlockPreview(block);

    if (preview) {
      return preview;
    }
  }

  return null;
}

function getBlockTypeLabel(block: ModuleContentBlock) {
  if (block.type === "video") return "Відео";
  if (block.type === "pdf") return "PDF";
  if (block.type === "image") return "Зображення";
  if (block.type === "facts") return "Факти";
  if (block.type === "productCatalog") return "Каталог";
  return "Текст";
}

function buildModulePages(blocks: ModuleContentBlock[]): ModuleViewerPage[] {
  const pages: ModuleViewerPage[] = [];
  let buffer: ModuleContentBlock[] = [];
  let bufferIndexes: number[] = [];

  function flushBuffer() {
    if (buffer.length === 0) {
      return;
    }

    pages.push({
      title: buffer[0]?.title ?? "Розділ модуля",
      blocks: [...buffer],
      blockIndexes: [...bufferIndexes],
      preview: getPagePreview(buffer)
    });

    buffer = [];
    bufferIndexes = [];
  }

  blocks.forEach((block, index) => {
    if (isHeavyModuleBlock(block)) {
      flushBuffer();
      pages.push({
        title: block.title,
        blocks: [block],
        blockIndexes: [index],
        preview: getPagePreview([block])
      });
      return;
    }

    buffer.push(block);
    bufferIndexes.push(index);

    if (buffer.length >= SIMPLE_BLOCKS_PER_PAGE) {
      flushBuffer();
    }
  });

  flushBuffer();

  return pages;
}

function getPageSecondaryLabel(page: ModuleViewerPage) {
  if (page.blocks.length <= 1) {
    return "Окремий розділ";
  }

  return `${page.blocks.length} об'єднані підрозділи`;
}

function getProductYear(product: ModuleCatalogProduct) {
  return Number(product.title.match(/\((\d{4})\)/)?.[1] ?? 0);
}

function getProductFamily(product: ModuleCatalogProduct) {
  if (product.family) {
    return product.family;
  }

  const title = product.title.toLowerCase();

  if (title.includes("ultra")) {
    return "Ultra";
  }

  if (title.includes("pro max")) {
    return "Pro Max";
  }

  if (title.includes("pro")) {
    return "Pro";
  }

  if (title.includes("plus")) {
    return "Plus";
  }

  if (title.includes("mini")) {
    return "Mini";
  }

  if (title.includes("se") || title.includes("16e")) {
    return "SE / e";
  }

  return "Стандартна лінійка";
}

function getCatalogFilters(products: ModuleCatalogProduct[]) {
  const families = Array.from(
    new Set(
      products
        .map(getProductFamily)
        .map((family) => family.trim())
        .filter(Boolean)
    )
  );

  if (families.length <= 1) {
    return [{ key: ALL_FILTER_KEY, label: "Усі моделі" }];
  }

  return [
    { key: ALL_FILTER_KEY, label: "Усі моделі" },
    ...families.map((family) => ({
      key: `family:${family}`,
      label: family
    }))
  ];
}

function matchesCatalogFilter(product: ModuleCatalogProduct, filter: string) {
  if (filter === ALL_FILTER_KEY) {
    return true;
  }

  if (filter.startsWith("family:")) {
    return getProductFamily(product) === filter.replace("family:", "");
  }

  return true;
}

function getColorTone(label: string) {
  const normalized = label.toLowerCase();

  for (const [token, tone] of Object.entries(colorToneMap).sort(([left], [right]) => right.length - left.length)) {
    if (normalized.includes(token)) {
      return tone;
    }
  }

  return "#cbd5e1";
}

function getConsultationSummary(product: ModuleCatalogProduct) {
  if (product.summary) {
    return product.summary;
  }

  const family = getProductFamily(product);
  const overviewSummary = product.overview
    .map(parseOverviewItem)
    .slice(0, 3)
    .map((item) => (item.label === "Характеристика" ? item.value : `${item.label}: ${item.value}`))
    .join(" • ");

  if (overviewSummary) {
    return `${product.title} — модель у лінійці ${family}. Ключові орієнтири: ${overviewSummary}.`;
  }

  return `${product.title} — модель у лінійці ${family} для швидкої консультації та точного підбору під запит клієнта.`;
}

function ProductCatalogCard({ product }: { product: ModuleCatalogProduct }) {
  const defaultColorIndex = Math.max(product.colors.findIndex((color) => color.default), 0);
  const [activeColorIndex, setActiveColorIndex] = useState(defaultColorIndex);
  const activeColor = product.colors[activeColorIndex] ?? product.colors[0];
  const overview = product.overview.map(parseOverviewItem);
  const visibleHighlights = product.highlights.slice(0, 6);
  const extraHighlights = product.highlights.slice(6);
  const year = product.title.match(/\((\d{4})\)/)?.[1];
  const family = getProductFamily(product);

  return (
    <article
      id={product.slug}
      className="scroll-mt-6 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.025] transition duration-200 hover:-translate-y-[2px] hover:border-[rgba(40,178,158,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
    >
      {/* ── Шапка: назва + badges ── */}
      <div className="border-b border-white/[0.07] px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {family}
          </span>
          {year && (
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              {year}
            </span>
          )}
          {product.colors.length > 0 && (
            <span className="rounded-full border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              {product.colors.length} кольорів
            </span>
          )}
        </div>
        <h4 className="mt-3 font-[var(--font-heading)] text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-[1.75rem]">
          {product.title}
        </h4>
      </div>

      {/* ── Основний контент: ліво = фото, право = деталі ── */}
      <div className="grid gap-0 sm:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">

        {/* ── Ліво: зображення ── */}
        <div className="border-b border-white/[0.07] bg-white/[0.015] p-5 sm:border-b-0 sm:border-r">
          {activeColor ? (
            <figure>
              <Image
                src={activeColor.imageUrl}
                alt={`${product.title}, ${activeColor.caption}`}
                width={560}
                height={560}
                unoptimized
                className="mx-auto h-[200px] w-full max-w-[240px] object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.35)] sm:h-[240px]"
              />
            </figure>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-slate-600">
              Зображення не додано
            </div>
          )}

          {/* Колір-dots: тільки кольорові кружечки */}
          {product.colors.length > 0 && (
            <div className="mt-5">
              <div className="flex flex-wrap justify-center gap-2">
                {product.colors.map((color, index) => {
                  const active = index === activeColorIndex;
                  const tone = getColorTone(color.label);
                  return (
                    <button
                      key={`${product.slug}-dot-${index}`}
                      type="button"
                      onClick={() => setActiveColorIndex(index)}
                      title={color.label}
                      aria-label={color.label}
                      className={`focus-ring rounded-full transition-all duration-150 ${
                        active
                          ? "scale-125 ring-2 ring-[color:var(--brand-strong)] ring-offset-1 ring-offset-[rgba(15,11,23,0.9)]"
                          : "opacity-60 hover:opacity-90 hover:scale-110"
                      }`}
                      style={{ width: 20, height: 20, backgroundColor: tone, border: "1.5px solid rgba(255,255,255,0.15)" }}
                    />
                  );
                })}
              </div>
              {activeColor && (
                <p className="mt-3 text-center text-xs font-medium text-slate-400">
                  {activeColor.label}
                  {activeColor.caption && activeColor.caption !== activeColor.label && (
                    <span className="ml-1.5 text-slate-600">· {activeColor.caption}</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Право: характеристики + аргументи ── */}
        <div className="space-y-0 divide-y divide-white/[0.06]">

          {/* Технічні характеристики */}
          {overview.length > 0 && (
            <div className="px-4 py-4 sm:px-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Характеристики</p>
              <dl className="space-y-2">
                {overview.map((item) => (
                  <div key={`${product.slug}-${item.label}`} className="flex items-baseline gap-3">
                    <dt className="w-28 flex-none text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:w-32">
                      {item.label}
                    </dt>
                    <dd className="min-w-0 flex-1 text-sm font-medium text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Аргументи для консультації */}
          {visibleHighlights.length > 0 && (
            <div className="px-4 py-4 sm:px-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Аргументи продажу
              </p>
              <ul className="space-y-2">
                {visibleHighlights.map((item, index) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 flex size-4 flex-none items-center justify-center rounded-full bg-[rgba(40,178,158,0.14)] text-[9px] font-bold text-[color:var(--brand-strong)]">
                      {index + 1}
                    </span>
                    <span className="leading-5">{item}</span>
                  </li>
                ))}
              </ul>

              {extraHighlights.length > 0 && (
                <details className="group mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-300 transition list-none">
                    + ще {extraHighlights.length} характеристик
                  </summary>
                  <ul className="mt-2 space-y-1.5">
                    {extraHighlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="mt-1.5 size-1 flex-none rounded-full bg-[color:var(--brand-strong)] opacity-50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

        </div>
      </div>
    </article>
  );
}

function ProductCatalogBlockView({ block }: { block: Extract<ModuleContentBlock, { type: "productCatalog" }> }) {
  const [query, setQuery] = useState("");
  const catalogFilters = useMemo(() => getCatalogFilters(block.products), [block.products]);
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER_KEY);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return block.products.filter((product) => {
      if (!matchesCatalogFilter(product, activeFilter)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        product.title,
        ...product.overview,
        ...product.highlights,
        ...product.colors.map((color) => color.label)
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeFilter, block.products, query]);

  useEffect(() => {
    if (!catalogFilters.some((filter) => filter.key === activeFilter)) {
      setActiveFilter(ALL_FILTER_KEY);
    }
  }, [activeFilter, catalogFilters]);

  const years = block.products.map(getProductYear).filter((year) => year > 0);
  const oldestYear = years.length > 0 ? Math.min(...years) : null;
  const newestYear = years.length > 0 ? Math.max(...years) : null;
  const uniqueFamilies = Array.from(new Set(block.products.map(getProductFamily)));
  const familySummaryLabel = uniqueFamilies.length === 1 ? uniqueFamilies[0] : `${uniqueFamilies.length}`;
  const familySummaryCaption = uniqueFamilies.length === 1 ? "Фокус каталогу" : "Сімейств у блоці";

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_20%),linear-gradient(150deg,rgba(17,24,39,0.62),rgba(31,41,55,0.56)_56%,rgba(51,65,85,0.5))] px-4 py-5 text-white shadow-[0_16px_34px_rgba(15,23,42,0.12)] backdrop-blur-[20px] sm:rounded-[36px] sm:px-6 sm:py-7">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(138,242,223,0.84),transparent)]" />
        <div className="pointer-events-none absolute -right-12 top-0 size-40 rounded-full bg-[radial-gradient(circle,rgba(138,242,223,0.14),transparent_72%)] blur-3xl" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-300/80">Модельний ряд</p>
            <h3 className="mt-4 max-w-4xl font-[var(--font-heading)] text-[2rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[#48d9c2] sm:text-[3.2rem]">
              {block.title}
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-[1.02rem]">
              Внутрішній конспект для команди продажів: швидко звіряйте покоління, позиціонування, ключові характеристики й
              аргументи продажу, а також підбирайте потрібний варіант під запит клієнта без зайвого пошуку.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300/75">Швидкий зріз</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">Моделей</p>
                  <p className="mt-2 text-sm text-slate-300">У каталозі</p>
                </div>
                <p className="font-[var(--font-heading)] text-4xl font-semibold text-white">{block.products.length}</p>
              </div>

              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">Період</p>
                  <p className="mt-2 text-sm text-slate-300">Діапазон поколінь</p>
                </div>
                <p className="text-right font-[var(--font-heading)] text-3xl font-semibold text-white">
                  {oldestYear && newestYear ? `${oldestYear}-${newestYear}` : "Без року"}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">
                    {uniqueFamilies.length === 1 ? "Лінійка" : "Сімейства"}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{familySummaryCaption}</p>
                </div>
                <p className="text-right font-[var(--font-heading)] text-3xl font-semibold text-white">{familySummaryLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,19,36,0.68),rgba(16,12,24,0.72))] p-3.5 shadow-[0_10px_22px_rgba(0,0,0,0.12)] backdrop-blur-[18px] sm:rounded-[30px] sm:p-5">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(138,242,223,0.64),transparent)]" />
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px] 2xl:items-start">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {catalogFilters.length > 1 ? "Навігація по каталогу" : "Огляд лінійки"}
            </p>
            {catalogFilters.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {catalogFilters.map((filter) => {
                  const active = filter.key === activeFilter;

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveFilter(filter.key)}
                      className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.16)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
                          : "border border-white/10 bg-white/5 text-slate-300 hover:border-[rgba(40,178,158,0.2)] hover:bg-white/10"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                У цьому блоці зібрано одну серію пристроїв, тож можна одразу перейти до пошуку конкретної моделі або швидкого
                переходу по картках нижче.
              </p>
            )}
          </div>

          <label className="block min-w-0">
            <span className="sr-only">Пошук по моделях</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Пошук по моделі, кольору або характеристиці"
              className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <p>
            Показано <strong className="text-white">{filteredProducts.length}</strong> з{" "}
            <strong className="text-white">{block.products.length}</strong> моделей
          </p>
          <p>Фільтри допомагають швидко перейти до потрібного сегмента лінійки</p>
        </div>

        <details className="mt-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3.5 sm:rounded-[24px]">
          <summary className="cursor-pointer text-sm font-semibold text-white">Швидкий перехід по моделях</summary>
          <div className="mt-4 flex flex-wrap gap-2">
            {filteredProducts.map((product) => (
              <a
                key={`${product.slug}-jump`}
                href={`#${product.slug}`}
                className="focus-ring rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-[rgba(40,178,158,0.2)] hover:bg-white/10"
              >
                {product.title}
              </a>
            ))}
          </div>
        </details>
      </div>

      <div className="space-y-5">
        {filteredProducts.map((product) => (
          <ProductCatalogCard key={product.slug} product={product} />
        ))}

        {filteredProducts.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-[rgba(255,255,255,0.04)] px-6 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <p className="font-[var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-white">
              Нічого не знайдено
            </p>
            <p className="mt-2 text-sm text-slate-300">Спробуйте змінити фільтр або скоротити пошуковий запит.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function classifyPowerStationCapacity(recommendedWh: number) {
  if (recommendedWh <= 500) return "≈ 300–500 Wh";
  if (recommendedWh <= 750) return "≈ 700 Wh";
  if (recommendedWh <= 1000) return "≈ 700–1000 Wh";
  if (recommendedWh <= 1500) return "≈ 1000–1500 Wh";
  if (recommendedWh <= 2000) return "≈ 1500–2000 Wh";
  return "≥ 2000 Wh";
}

function formatPowerStationValue(value: number) {
  return new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: value >= 100 ? 0 : 1
  }).format(value);
}

function PowerStationCalculatorCard() {
  const [power, setPower] = useState("120");
  const [hours, setHours] = useState("4");
  const [efficiency, setEfficiency] = useState("0.85");
  const [resultHtml, setResultHtml] = useState("");

  function handleCalculate() {
    const powerValue = Number(power);
    const hoursValue = Number(hours);
    const efficiencyValue = Number(efficiency);

    if (
      !Number.isFinite(powerValue) ||
      !Number.isFinite(hoursValue) ||
      !Number.isFinite(efficiencyValue) ||
      powerValue <= 0 ||
      hoursValue <= 0 ||
      efficiencyValue < 0.6 ||
      efficiencyValue > 0.9
    ) {
      setResultHtml("<strong>Перевір значення.</strong> Потужність і час мають бути більші за нуль, а ККД — у межах 0.6–0.9.");
      return;
    }

    const minimumWh = (powerValue * hoursValue) / efficiencyValue;
    const recommendedWh = minimumWh * 1.25;
    const stationClass = classifyPowerStationCapacity(recommendedWh);

    setResultHtml(
      `<strong>Мінімально потрібно:</strong> ${formatPowerStationValue(minimumWh)} Wh.<br><strong>Із запасом 25%:</strong> ${formatPowerStationValue(recommendedWh)} Wh.<br><strong>Рекомендований клас станції:</strong> ${stationClass}.`
    );
  }

  function handleReset() {
    setPower("120");
    setHours("4");
    setEfficiency("0.85");
    setResultHtml("");
  }

  return (
    <div className="calc-card">
      <div className="calc-grid">
        <label className="calc-field">
          <span>Сумарна потужність навантаження (Вт)</span>
          <input type="number" min="1" step="1" value={power} onChange={(event) => setPower(event.target.value)} />
        </label>
        <label className="calc-field">
          <span>Час роботи (год)</span>
          <input type="number" min="0.1" step="0.5" value={hours} onChange={(event) => setHours(event.target.value)} />
        </label>
        <label className="calc-field">
          <span>ККД системи (0.6–0.9)</span>
          <input
            type="number"
            min="0.6"
            max="0.9"
            step="0.05"
            value={efficiency}
            onChange={(event) => setEfficiency(event.target.value)}
          />
        </label>
      </div>
      <div className="calc-actions">
        <button type="button" className="calc-button" onClick={handleCalculate}>
          Розрахувати
        </button>
        <button type="button" className="calc-button calc-button-secondary" onClick={handleReset}>
          Скинути
        </button>
      </div>
      {resultHtml ? <div className="calc-result" dangerouslySetInnerHTML={{ __html: resultHtml }} /> : null}
    </div>
  );
}

function renderBlock(block: ModuleContentBlock) {
  if (block.type === "video" && block.url) {
    const video = getVideoSource(block.url, block.provider);
    return (
      <div className="space-y-2">
        <h3 className="font-[var(--font-heading)] text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--brand-strong)] sm:text-3xl">
          {block.title}
        </h3>
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
          {video?.kind === "video" ? (
            <video src={video.url} controls preload="metadata" className="aspect-video w-full" aria-label={block.title}>
              Ваш браузер не підтримує відтворення відео.
            </video>
          ) : video ? <iframe
            src={video.url}
            title={block.title}
            className="aspect-video w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          /> : <p role="alert" className="p-4 text-sm text-rose-200">Посилання на відео некоректне. Повідомте адміністратора.</p>}
        </div>
      </div>
    );
  }

  if (block.type === "pdf" && block.url) {
    return (
      <div className="space-y-4">
        <h3 className="font-[var(--font-heading)] text-[1.9rem] font-semibold tracking-[-0.03em] text-[color:var(--brand-strong)] sm:text-3xl">
          {block.title}
        </h3>
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-2.5 rounded-full border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.1)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Відкрити PDF
        </a>
      </div>
    );
  }

  if (block.type === "image" && block.url) {
    return (
      <div className="space-y-3">
        <h3 className="font-[var(--font-heading)] text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--brand-strong)] sm:text-3xl">
          {block.title}
        </h3>
        <div className="relative h-56 w-full overflow-hidden rounded-[24px] border border-white/10 sm:h-72">
          <Image src={block.url} alt={block.caption ?? block.title} fill unoptimized className="object-cover" />
        </div>
        {block.caption && <p className="text-sm text-slate-600">{block.caption}</p>}
      </div>
    );
  }

  if (block.type === "facts") {
    return (
      <div className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-[7px] border border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.1)] text-[11px] font-bold text-[color:var(--brand-strong)]">
            {(block.items?.length ?? 0)}
          </span>
          <h3 className="font-[var(--font-heading)] text-base font-semibold tracking-[-0.01em] text-white">
            {block.title}
          </h3>
        </div>
        <ul className="mt-4 space-y-2">
          {block.items?.map((item, i) => (
            <li key={item} className="flex items-start gap-3 rounded-[10px] border border-white/[0.065] bg-white/[0.015] px-3 py-2.5 text-sm text-slate-600">
              <span className="mt-0.5 flex size-4 flex-none items-center justify-center rounded-full bg-[rgba(40,178,158,0.14)] text-[9px] font-bold text-[color:var(--brand-strong)]">
                {i + 1}
              </span>
              <span className="leading-5">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "productCatalog") {
    return <ProductCatalogBlockView block={block} />;
  }

  if (block.type === "text") {
    const calculatorMarker = "<!-- power-station-calculator -->";
    const hasPowerStationCalculator = block.html.includes(calculatorMarker);
    const textSegments = hasPowerStationCalculator ? block.html.split(calculatorMarker) : [block.html];

    return (
      <article className="space-y-2">
        <h3 className="font-[var(--font-heading)] text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--brand-strong)] sm:text-3xl">
          {block.title}
        </h3>
        <div className="space-y-4">
          {textSegments.map((segment, index) => (
            <div key={`${block.title}-segment-${index}`} className="space-y-4">
              {segment.trim() ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: segment }} /> : null}
              {hasPowerStationCalculator && index < textSegments.length - 1 ? <PowerStationCalculatorCard /> : null}
            </div>
          ))}
        </div>
      </article>
    );
  }

  return <p className="text-sm text-slate-500">Цей тип контенту поки не підтримується.</p>;
}

export function ModuleViewer({ moduleId, blocks, initialProgressPct, hasQuiz }: ModuleViewerProps) {
  const router = useRouter();
  const pages = useMemo(() => buildModulePages(blocks), [blocks]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [seenBlockIndexes, setSeenBlockIndexes] = useState<Set<number>>(new Set());
  const contentTopRef = useRef<HTMLDivElement>(null);
  const [savedProgress, setSavedProgress] = useState({ moduleId, pct: initialProgressPct });
  const savedProgressPct = savedProgress.moduleId === moduleId ? savedProgress.pct : initialProgressPct;
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [retrySave, setRetrySave] = useState(0);

  useEffect(() => {
    setActivePageIndex(0);
    setSaveError(null);
    setIsSaving(false);
  }, [moduleId]);

  useEffect(() => {
    setActivePageIndex((current) => Math.min(current, Math.max(pages.length - 1, 0)));
  }, [pages.length]);

  useEffect(() => {
    if (blocks.length === 0) {
      return;
    }

    const seenByDefault = Math.round((initialProgressPct / 100) * blocks.length);
    const prefill = new Set<number>();
    for (let i = 0; i < seenByDefault; i += 1) {
      prefill.add(i);
    }

    setSeenBlockIndexes(prefill);
  }, [moduleId, blocks.length, initialProgressPct]);

  // Скролимо до верху контенту при зміні сторінки
  useEffect(() => {
    if (activePageIndex > 0 || contentTopRef.current) {
      contentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activePageIndex]);

  useEffect(() => {
    const activePage = pages[activePageIndex];

    if (!activePage) {
      return;
    }

    setSeenBlockIndexes((prev) => {
      const next = new Set(prev);
      activePage.blockIndexes.forEach((index) => next.add(index));
      return next;
    });
  }, [activePageIndex, pages]);

  const progressPct = useMemo(() => {
    if (blocks.length === 0) return 0;
    return Math.round((seenBlockIndexes.size / blocks.length) * 100);
  }, [blocks.length, seenBlockIndexes]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setIsSaving(true);
      setSaveError(null);
      requestJson<{ progress: { progressPct: number } }>("/api/progress", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleId, progressPct }), keepalive: true
      }).then(({ progress }) => {
        if (!active) return;
        setSavedProgress((previous) => ({ moduleId, pct: previous.moduleId === moduleId ? Math.max(previous.pct, progress.progressPct) : progress.progressPct }));
        if (progress.progressPct >= 100 && initialProgressPct < 100) router.refresh();
      }).catch((error: unknown) => {
        if (active) setSaveError(getRequestError(error, "Не вдалося зберегти прогрес"));
      }).finally(() => { if (active) setIsSaving(false); });
    }, 450);

    return () => { active = false; clearTimeout(timer); };
  }, [moduleId, progressPct, initialProgressPct, router, retrySave]);

  const activePage = pages[activePageIndex];

  return (
    <section className="grid gap-3 sm:gap-4 2xl:grid-cols-[minmax(0,1fr)_248px] 2xl:items-start">
      <div ref={contentTopRef} className="card min-w-0 animate-fadeUp space-y-4 p-4 sm:p-6">
        {activePage ? (
          <div className="space-y-6">
            {activePage.blocks.length > 1 ? (
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-3.5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] sm:rounded-[24px] sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">У цьому розділі</p>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {activePage.blocks.map((block, index) => {
                    const preview = getBlockPreview(block) ?? activePage.preview;

                    return (
                      <div
                        key={`${block.title}-${index}`}
                        className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-3"
                      >
                        {preview ? (
                          <div className="relative h-14 w-14 flex-none overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.03]">
                            <Image src={preview.src} alt={preview.alt} fill unoptimized className="object-contain p-2" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {getBlockTypeLabel(block)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-100">{block.title}</p>
                          <p className="mt-1 text-xs text-slate-400">{getBlockTypeLabel(block)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="space-y-6 sm:space-y-8">
              {activePage.blocks.map((block, index) => (
                <div
                  key={`${block.title}-${index}`}
                  className={index > 0 ? "border-t border-slate-200 pt-6 sm:pt-8" : undefined}
                >
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Контент модуля відсутній</p>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-4">
          <button
            type="button"
            onClick={() => setActivePageIndex((value) => Math.max(0, value - 1))}
            disabled={activePageIndex === 0}
            className="focus-ring module-btn-back"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Назад
          </button>
          <span className="text-xs font-semibold tabular-nums text-slate-500">
            {activePageIndex + 1} / {pages.length}
          </span>
          <button
            type="button"
            onClick={() => setActivePageIndex((value) => Math.min(pages.length - 1, value + 1))}
            disabled={activePageIndex >= pages.length - 1}
            className="focus-ring module-btn-next"
          >
            Далі
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <aside className="card h-fit p-3.5 sm:p-4 2xl:sticky 2xl:top-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Розділи модуля</p>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-500">
            {pages.length}
          </span>
        </div>

        <div className="mt-3 grid gap-1.5 sm:grid-cols-2 2xl:grid-cols-1">
          {pages.map((page, index) => {
            const active = index === activePageIndex;
            const done = !active && page.blockIndexes.every((blockIndex) => seenBlockIndexes.has(blockIndex));
            const stateClass = active
              ? "module-nav-page-active"
              : done
                ? "module-nav-page-done"
                : "module-nav-page-idle";

            return (
              <button
                key={index}
                type="button"
                onClick={() => setActivePageIndex(index)}
                className={`focus-ring module-nav-page ${stateClass}`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {page.preview ? (
                    <span className="relative h-10 w-10 flex-none overflow-hidden rounded-[12px] border border-white/10 bg-white/[0.04]">
                      <Image src={page.preview.src} alt={page.preview.alt} fill unoptimized className="object-contain p-1.5" />
                    </span>
                  ) : (
                    <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-[12px] border ${active ? "border-white/15 bg-white/10" : done ? "border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)]" : "border-white/8 bg-white/[0.03]"}`}>
                      {done
                        ? <CheckCircle2 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                        : active
                          ? <PlayCircle className="size-4 text-white/80" aria-hidden="true" />
                          : <Circle className="size-4 text-slate-500" aria-hidden="true" />}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{page.title}</span>
                    <span className={`mt-0.5 block text-xs ${active ? "text-white/60" : done ? "text-[color:var(--brand-strong)]/70" : "text-slate-500"}`}>
                      {getPageSecondaryLabel(page)}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.02]">
          <div className="p-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Прогрес</p>
              <p className="font-[var(--font-heading)] text-lg font-bold text-ink">{progressPct}%</p>
            </div>
            <div className="progress-track mt-2.5">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-2.5 text-xs leading-5 text-slate-500">
              {progressPct >= 100
                ? savedProgressPct >= 100 ? hasQuiz ? "Весь матеріал переглянуто. Можна складати тест." : "Матеріал завершено, прогрес збережено."
                  : "Зберігаємо завершення матеріалу…"
                : hasQuiz ? "Тест відкриється після перегляду всіх розділів." : "Перегляньте всі розділи, щоб завершити матеріал."}
            </p>
          </div>

          {saveError && <div role="alert" className="px-4 pb-3 text-sm text-rose-200">
            {saveError}
            <button type="button" onClick={() => setRetrySave((value) => value + 1)} disabled={isSaving}
              className="focus-ring ml-2 rounded px-2 py-1 underline disabled:opacity-50">Спробувати ще раз</button>
          </div>}
          {progressPct >= 100 && savedProgressPct >= 100 && hasQuiz ? (
            <a
              href={`/module/${moduleId}/quiz`}
              className="focus-ring flex items-center justify-center gap-2 border-t border-white/10 bg-[linear-gradient(135deg,rgba(40,178,158,0.22),rgba(13,16,28,0.9))] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
              Перейти до тесту
            </a>
          ) : hasQuiz ? (
            <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-white/[0.015] px-4 py-3 text-sm font-medium text-slate-500">
              {progressPct >= 100 ? "Очікуємо збереження прогресу…" : "Тест після 100%"}
            </div>
          ) : <p className="border-t border-white/10 px-4 py-3 text-center text-sm text-slate-300">Для цього матеріалу окремий тест не потрібен.</p>}
        </div>
      </aside>
    </section>
  );
}
