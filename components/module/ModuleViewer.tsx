"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ModuleCatalogProduct, ModuleContentBlock } from "@/lib/module-content";
import { getVideoSource } from "@/lib/video-source";
import { getRequestError, requestJson } from "@/lib/http-client";
import styles from "./ModuleViewer.module.css";

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
};

const ALL_FILTER_KEY = "all";
const SIMPLE_BLOCKS_PER_PAGE = 3;

// The Apple Store PNGs include large transparent margins. Frame the device,
// keeping a transparent safety margin and the original image proportions.
const iphoneImageFrames = [
  { prefix: "/materials/iphone/2026/18-pro/", x: 145, y: 200, width: 650, height: 772 },
  { prefix: "/materials/iphone/2026/duo/", x: 49, y: 272, width: 841, height: 568 },
  { prefix: "/materials/iphone/2026/17e/", x: 116, y: 132, width: 708, height: 849 }
];

const colorToneMap: Record<string, string> = {
  black: "#202124",
  "space black": "#171717",
  white: "#f7f8fa",
  silver: "#d9dde2",
  "space gray": "#5f6368",
  graphite: "#5f6368",
  gold: "#d0b085",
  "radiant gold": "#d7b76d",
  "dark bronze": "#665344",
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
  glacier: "#c5dce4",
  burgundy: "#6c293d",
  "night sky": "#263448",
  "night blue": "#263746",
  "pearl white": "#f0ece4",
  "star white": "#f2f1ed",
  ultramarine: "#3549d8",
  teal: "#51b8b0",
  green: "#76ad90",
  "midnight green": "#5c6b60",
  "alpine green": "#667a66",
  red: "#c83d3d",
  yellow: "#f2d260",
  coral: "#ef8d7f",
  pink: "#f4b4cf",
  "soft pink": "#f0dce0",
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
      blockIndexes: [...bufferIndexes]
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
        blockIndexes: [index]
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

function ProductCatalogCard({ product }: { product: ModuleCatalogProduct }) {
  const defaultColorIndex = Math.max(product.colors.findIndex((color) => color.default), 0);
  const [activeColorIndex, setActiveColorIndex] = useState(defaultColorIndex);
  const activeColor = product.colors[activeColorIndex] ?? product.colors[0];
  const imageFrame = iphoneImageFrames.find((frame) => activeColor?.imageUrl.startsWith(frame.prefix));
  const overview = product.overview.map(parseOverviewItem);
  const visibleHighlights = product.highlights.slice(0, 6);
  const extraHighlights = product.highlights.slice(6);
  const year = product.title.match(/\((\d{4})\)/)?.[1];
  const family = getProductFamily(product);
  const productImage = activeColor ? (
    <Image
      src={activeColor.imageUrl}
      alt={`${product.title}, ${activeColor.caption}`}
      width={imageFrame ? 940 : 560}
      height={imageFrame ? 1112 : 560}
      unoptimized
      className={imageFrame ? styles.framedProductImage : "mx-auto h-[200px] w-full max-w-[240px] object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.35)] sm:h-[240px]"}
      style={imageFrame ? {
        width: `${940 / imageFrame.width * 100}%`,
        height: `${1112 / imageFrame.height * 100}%`,
        left: `${-imageFrame.x / imageFrame.width * 100}%`,
        top: `${-imageFrame.y / imageFrame.height * 100}%`
      } : undefined}
    />
  ) : null;

  return (
    <article
      id={product.slug}
      className={styles.productCard}
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
        </div>
        <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[1.75rem]">
          {product.title}
        </h3>
        {product.summary ? <p className={styles.productSummary}>{product.summary}</p> : null}
      </div>

      {/* ── Основний контент: ліво = фото, право = деталі ── */}
      <div className={activeColor ? styles.productLayout : undefined}>

        {/* ── Ліво: зображення ── */}
        {activeColor ? <div className={styles.productVisual}>
          <figure className={imageFrame ? styles.productImageFigure : undefined}>
            {imageFrame ? (
              <div
                className={styles.productImageViewport}
                style={{
                  aspectRatio: `${imageFrame.width} / ${imageFrame.height}`,
                  width: `min(100%, calc(var(--product-image-height) * ${imageFrame.width / imageFrame.height}))`
                }}
              >
                {productImage}
              </div>
            ) : productImage}
          </figure>

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
                      aria-label={`${product.title}: ${color.label}`}
                      aria-pressed={active}
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
                    <span className="ml-1.5 text-slate-400">· {activeColor.caption}</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div> : null}

        {/* ── Право: характеристики + аргументи ── */}
        <div className="space-y-0 divide-y divide-white/[0.06]">

          {/* Технічні характеристики */}
          {overview.length > 0 && (
            <div className="px-4 py-4 sm:px-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Характеристики</p>
              <dl className="space-y-2">
                {overview.map((item) => (
                  <div key={`${product.slug}-${item.label}-${item.value}`} className={styles.specification}>
                    <dt>
                      {item.label}
                    </dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Аргументи для консультації */}
          {visibleHighlights.length > 0 && (
            <div className="px-4 py-4 sm:px-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Що пояснити клієнту
              </p>
              <ul className="space-y-2">
                {visibleHighlights.map((item, index) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
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
                    Інші особливості ({extraHighlights.length})
                  </summary>
                  <ul className="mt-2 space-y-1.5">
                    {extraHighlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
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
  return (
    <section className="space-y-5">
      <header className={styles.catalogHeader}>
        <div>
          <p className={styles.eyebrow}>Модельний ряд</p>
          <h2 className={styles.blockTitle}>{block.title}</h2>
        </div>
        <p className={styles.catalogMeta}>
          Моделей: <strong>{block.products.length}</strong>
          {oldestYear && newestYear ? <span> · {oldestYear === newestYear ? oldestYear : `${oldestYear}–${newestYear}`}</span> : null}
        </p>
      </header>

      <div className={styles.catalogTools}>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200">{catalogFilters.length > 1 ? "Оберіть лінійку" : "Пошук моделі"}</p>
            {catalogFilters.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {catalogFilters.map((filter) => {
                  const active = filter.key === activeFilter;

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveFilter(filter.key)}
                      aria-pressed={active}
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
            ) : null}
          </div>

          <label className="block min-w-0">
            <span className="sr-only">Знайти модель, колір або характеристику</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Модель, колір або характеристика"
              className="focus-ring w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <p role="status" aria-live="polite">
            Показано <strong className="text-white">{filteredProducts.length}</strong> з{" "}
            <strong className="text-white">{block.products.length}</strong> моделей
          </p>
          {query || activeFilter !== ALL_FILTER_KEY ? <button type="button" onClick={() => { setQuery(""); setActiveFilter(ALL_FILTER_KEY); }} className="focus-ring rounded px-2 py-1 text-sm text-[color:var(--brand-strong)] underline underline-offset-4">Скинути фільтри</button> : null}
        </div>

        <details className="mt-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3.5 sm:rounded-[24px]">
          <summary className="focus-ring cursor-pointer rounded text-sm font-semibold text-white">Перейти до моделі</summary>
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
      setResultHtml("<strong>Перевірте значення.</strong> Потужність і час мають бути більшими за нуль, а ККД — у межах 0,6–0,9.");
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
          <span>ККД системи (0,6–0,9)</span>
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
      {resultHtml ? <div className="calc-result" role="status" aria-live="polite" dangerouslySetInnerHTML={{ __html: resultHtml }} /> : null}
    </div>
  );
}

function renderBlock(block: ModuleContentBlock) {
  if (block.type === "video" && block.url) {
    const video = getVideoSource(block.url, block.provider);
    return (
      <div className="space-y-5">
        <h2 className={styles.blockTitle}>
          {block.title}
        </h2>
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
        <h2 className={styles.blockTitle}>
          {block.title}
        </h2>
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
        <h2 className={styles.blockTitle}>
          {block.title}
        </h2>
        <div className="relative h-56 w-full overflow-hidden rounded-[24px] border border-white/10 sm:h-72">
          <Image src={block.url} alt={block.caption ?? block.title} fill unoptimized className="object-cover" />
        </div>
        {block.caption && <p className="text-sm leading-6 text-slate-400">{block.caption}</p>}
      </div>
    );
  }

  if (block.type === "facts") {
    return (
      <div className={styles.facts}>
        <h2 className={styles.blockTitle}>{block.title}</h2>
        <ol className="mt-5 space-y-3">
          {block.items?.map((item, i) => (
            <li key={item} className="flex items-start gap-3 text-[0.97rem] text-slate-300">
              <span aria-hidden="true" className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-full bg-[rgba(40,178,158,0.12)] text-xs font-semibold text-[color:var(--brand-strong)]">
                {i + 1}
              </span>
              <span className="leading-7">{item}</span>
            </li>
          ))}
        </ol>
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
      <article className={`space-y-5 ${styles.lessonText}`}>
        <h2 className={styles.blockTitle}>
          {block.title}
        </h2>
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

  return <p className="text-sm text-slate-400">Не вдалося відкрити матеріал. Повідомте адміністратора.</p>;
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
  const getBlockAnchor = (blockIndex: number) => `module-${moduleId}-topic-${blockIndex + 1}`;

  function openPage(index: number) {
    setActivePageIndex(index);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    contentTopRef.current?.scrollIntoView({ behavior, block: "start" });
  }

  return (
    <section className={styles.viewer} aria-label="Навчальний матеріал">
      <aside className={`card ${styles.sidebar}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-200">Зміст матеріалу</h2>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-500">
            {pages.length}
          </span>
        </div>

        <nav className={styles.moduleNav} aria-label="Зміст матеріалу">
          <ol className={styles.moduleNavList}>
          {pages.map((page, index) => {
            const active = index === activePageIndex;
            const done = !active && page.blockIndexes.every((blockIndex) => seenBlockIndexes.has(blockIndex));
            const stateClass = active
              ? "module-nav-page-active"
              : done
                ? "module-nav-page-done"
                : "module-nav-page-idle";

            return (
              <li key={index}>
              <button
                type="button"
                onClick={() => openPage(index)}
                aria-current={active ? "step" : undefined}
                aria-controls={`module-${moduleId}-content`}
                className={`focus-ring module-nav-page ${stateClass}`}
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className={styles.pageNumber} aria-hidden="true">
                    {done ? <CheckCircle2 className="size-4 text-[color:var(--brand-strong)]" /> : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.pageName}>
                    <span className="block text-sm font-medium leading-5">{page.title}</span>
                    {page.blocks.length > 1 ? <span className={styles.pageTopics}>{page.blocks.slice(1).map((block) => block.title).join(" · ")}</span> : null}
                    <span className="sr-only">{active ? "Поточний розділ" : done ? "Переглянуто" : "Ще не переглянуто"}</span>
                  </span>
                </span>
              </button>
              </li>
            );
          })}
          </ol>
        </nav>

        <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.02]">
          <div className="p-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Прогрес</p>
              <p className="font-[var(--font-heading)] text-lg font-bold text-ink">{progressPct}%</p>
            </div>
            <div className="progress-track mt-2.5" role="progressbar" aria-label="Переглянутий матеріал" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
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
          ) : null}
        </div>
      </aside>

      <div ref={contentTopRef} id={`module-${moduleId}-content`} className={`card animate-fadeUp ${styles.content}`}>
        {activePage ? (
          <div className="space-y-8">
            <p className={styles.eyebrow}>Розділ {activePageIndex + 1} із {pages.length}</p>
            {activePage.blocks.length > 1 ? (
              <nav className={styles.topicNav} aria-label="Теми поточного розділу">
                <p className={styles.topicNavLabel}>У цьому розділі</p>
                <ol className={styles.topicLinks}>
                  {activePage.blocks.map((block, index) => (
                    <li key={`${block.title}-${index}`}>
                      <a
                        href={`#${getBlockAnchor(activePage.blockIndexes[index])}`}
                        className={`focus-ring ${styles.topicLink}`}
                      >
                        <span className={styles.topicNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                        <span>{block.title}</span>
                        <ChevronRight className="ml-auto size-4 shrink-0 text-slate-500" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <div className={styles.topics}>
              {activePage.blocks.map((block, index) => (
                <div
                  key={`${block.title}-${index}`}
                  id={getBlockAnchor(activePage.blockIndexes[index])}
                  tabIndex={-1}
                  className={styles.topic}
                >
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-8 text-slate-400">Навчальні матеріали ще не опубліковані.</p>
        )}

        {pages.length > 1 ? <nav aria-label="Перехід між розділами" className={styles.pageControls}>
          <button
            type="button"
            onClick={() => openPage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="focus-ring module-btn-back"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Назад
          </button>
          <span className="text-xs font-semibold tabular-nums text-slate-500">
            <span className="sr-only">Розділ </span>{activePageIndex + 1} / {pages.length}
          </span>
          <button
            type="button"
            onClick={() => openPage(Math.min(pages.length - 1, activePageIndex + 1))}
            disabled={activePageIndex >= pages.length - 1}
            className="focus-ring module-btn-next"
          >
            Далі
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </nav> : null}
      </div>
    </section>
  );
}
