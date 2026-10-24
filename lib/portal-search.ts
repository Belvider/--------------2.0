import { getFactAnchor, getModuleBlockAnchor, getPortalCardAnchor, getPortalCardItemAnchor, getProductAnchor, getProductDetailAnchor, prepareSearchableHtml, stripSearchableHtml } from "@/lib/content-anchors";
import { parseModuleContentBlocks } from "@/lib/module-content";
import { portalPageMeta, type PortalPageContent } from "@/lib/portal-pages";
import type { SearchResponse, SearchResult } from "@/lib/search-types";

type Brand = { id: number; name: string; slug: string; description?: string | null };
type Category = { id: number; name: string; slug: string; description?: string | null; brand: { name: string; slug: string } };
export type SearchModule = {
  id: number; title: string; description: string; durationMin: number; contentBlocks: unknown; isPublished?: boolean;
  category: { name: string; slug: string; brand: { name: string; slug: string } };
};
type IndexEntry = { result: SearchResult; title: string; text: string; context: string; original: string; container?: string };
export type PortalSearchIndex = IndexEntry[];
type Sources = { modules: SearchModule[]; brands?: Brand[]; categories?: Category[]; portalPages?: PortalPageContent[] };

export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("uk")
    .replace(/[’'ʼ`]/g, "")
    .replace(/(\d)е(?=$|[^\p{L}\p{N}])/gu, "$1e")
    .replace(/([\p{L}])(\d)/gu, "$1 $2").replace(/(\d)([\p{L}])/gu, "$1 $2")
    .replace(/\bpromax\b/g, "pro max")
    .replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}
export function tokenizeSearchQuery(query: string) {
  return [...new Set(normalizeSearchText(query).split(" ").filter(Boolean).map(token => {
    if (/^айфон(?:и|ів|а|у|ом|ах)?$/u.test(token)) return "iphone";
    if (/^айпад(?:и|ів|а|у|ом|ах)?$/u.test(token)) return "ipad";
    if (/^макбук(?:и|ів|а|у|ом|ах)?$/u.test(token)) return "macbook";
    if (token === "епл") return "apple";
    return token;
  }))];
}
const text = (value: unknown) => typeof value === "string" ? stripSearchableHtml(value) : "";
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }

export function buildPortalSearchIndex({ modules, brands = [], categories = [], portalPages = [] }: Sources): PortalSearchIndex {
  const index: PortalSearchIndex = [];
  const add = (result: SearchResult, ownTitle: string, ownText = "", context = "", container?: string) => {
    const original = text(ownText);
    index.push({ result, title: normalizeSearchText(text(ownTitle)), text: normalizeSearchText(original), context: normalizeSearchText(context), original, container });
  };
  for (const brand of brands) {
    if (brand.slug === "pineapple-academy") continue;
    add({ type: "brand", id: brand.id, title: brand.name, subtitle: "Бренд", href: `/brands/${brand.slug}` }, brand.name, brand.description ?? "");
  }
  for (const category of categories) {
    if (category.brand.slug === "pineapple-academy") continue;
    add({ type: "category", id: category.id, title: category.name, subtitle: category.brand.name, href: `/brands/${category.brand.slug}/${category.slug}` }, category.name, category.description ?? "", category.brand.name);
  }
  for (const learningModule of modules) {
    if (learningModule.isPublished === false) continue;
    const moduleHref = `/module/${learningModule.id}`;
    const path = `${learningModule.category.brand.name} · ${learningModule.category.name} · ${learningModule.title}`;
    add({ type: "module", id: learningModule.id, title: learningModule.title, subtitle: `${learningModule.category.brand.name} · ${learningModule.category.name}`, meta: `${learningModule.durationMin} хв`, href: moduleHref }, learningModule.title, learningModule.description, path);
    parseModuleContentBlocks(learningModule.contentBlocks).forEach((block, blockIndex) => {
      const anchor = getModuleBlockAnchor(learningModule.id, blockIndex);
      const href = (fragment: string) => `${moduleHref}#${encodeURIComponent(fragment)}`;
      const context = `${path} ${block.title}`;
      const section = (fragment: string, title: string, ownText: string, meta: string, ownTitle = title, sectionContext = context, container?: string) => {
        add({ type: "section", id: fragment, title, subtitle: path, meta, href: href(fragment) }, ownTitle, ownText, sectionContext, container);
      };
      if (block.type === "text") {
        const prepared = prepareSearchableHtml(typeof block.html === "string" ? block.html : "", anchor);
        section(anchor, block.title, text(block.html), "Розділ", block.title, context, anchor);
        for (const fragment of prepared.fragments) {
          if (fragment.anchor === anchor) continue;
          section(fragment.anchor, fragment.title || block.title, fragment.text, "Фрагмент", "", `${context} ${fragment.title ?? ""}`);
        }
      } else if (block.type === "facts") {
        section(anchor, block.title, "", "Ключові факти");
        strings(block.items).forEach((item, itemIndex) => section(getFactAnchor(anchor, itemIndex), block.title, item, "Ключовий факт", ""));
      } else if (block.type === "image") {
        section(anchor, block.title, text(block.caption), "Ілюстрація");
      } else if (block.type === "video" || block.type === "pdf") {
        section(anchor, block.title, "", block.type === "video" ? "Відео" : "Документ");
      } else if (block.type === "productCatalog") {
        section(anchor, block.title, "", "Каталог пристроїв");
        if (!Array.isArray(block.products)) return;
        block.products.forEach((product, productIndex) => {
          if (!record(product) || typeof product.title !== "string") return;
          const productAnchor = getProductAnchor(anchor, productIndex);
          const productContext = `${context} ${product.title} ${text(product.family)}`;
          add({ type: "product", id: productAnchor, title: product.title, subtitle: path, meta: text(product.family) || "Пристрій", href: href(productAnchor) }, product.title, text(product.family), context);
          const detail = (kind: "summary" | "spec" | "highlight" | "color", detailIndex: number, value: string, label: string) => {
            const target = getProductDetailAnchor(productAnchor, kind, detailIndex);
            add({ type: "section", id: target, title: product.title, subtitle: path, meta: label, href: href(target) }, "", value, productContext);
          };
          if (text(product.summary)) detail("summary", 0, text(product.summary), "Про модель");
          strings(product.overview).forEach((item, itemIndex) => detail("spec", itemIndex, item, "Характеристика"));
          strings(product.highlights).forEach((item, itemIndex) => detail("highlight", itemIndex, item, "Аргумент для консультації"));
          if (Array.isArray(product.colors)) product.colors.forEach((color, colorIndex) => {
            if (record(color)) detail("color", colorIndex, `${text(color.label)} ${text(color.caption)}`, "Колір");
          });
        });
      }
    });
  }
  for (const page of portalPages) {
    const route = portalPageMeta[page.slug].route;
    const pageContext = `${page.title} ${page.label}`;
    add({ type: "section", id: `portal-${page.slug}`, title: page.title, subtitle: page.label, meta: "Навчальний напрям", href: route }, page.title, `${page.subtitle} ${page.sideLabel} ${page.sideText}`);
    page.cards.forEach((card, cardIndex) => {
      const anchor = getPortalCardAnchor(page.slug, cardIndex);
      add({ type: "section", id: anchor, title: card.title, subtitle: page.title, meta: "Розділ", href: `${route}#${anchor}` }, card.title, `${card.text} ${card.imageAlt}`, pageContext);
      strings(card.items).forEach((item, itemIndex) => {
        const itemAnchor = getPortalCardItemAnchor(anchor, itemIndex);
        add({ type: "section", id: itemAnchor, title: card.title, subtitle: page.title, meta: "Навчальний пункт", href: `${route}#${itemAnchor}` }, "", item, `${pageContext} ${card.title}`);
      });
    });
  }
  return index;
}

function snippet(original: string, terms: string[]) {
  if (!original) return undefined;
  const lower = original.toLocaleLowerCase("uk");
  const positions = terms.map(term => lower.indexOf(term)).filter(position => position >= 0);
  const position = positions.length ? Math.min(...positions) : 0;
  let start = Math.max(0, position - 55);
  if (start > 0) { const space = original.indexOf(" ", start); if (space >= 0 && space < position) start = space + 1; }
  const end = Math.min(original.length, start + 185);
  return `${start ? "…" : ""}${original.slice(start, end).trim()}${end < original.length ? "…" : ""}`;
}

export function searchPortalIndex(index: PortalSearchIndex, query: string, options: { offset?: number; limit?: number } = {}): SearchResponse {
  const offset = Math.max(0, Math.floor(options.offset ?? 0));
  const limit = Math.max(1, Math.min(30, Math.floor(options.limit ?? 12)));
  const terms = tokenizeSearchQuery(query);
  if (query.trim().length < 2 || !terms.length) return { results: [], total: 0, offset, limit, hasMore: false };
  const phrase = terms.join(" ");
  const matchers = new Map(terms.map(term => {
    const number = /^\d+$/.test(term) ? new RegExp(`(?:^| )${term}(?: |$)`) : null;
    return [term, (value: string) => number ? number.test(value) : value.includes(term)] as const;
  }));
  const hasTerm = (value: string, term: string) => matchers.get(term)!(value);
  const ranked = index.flatMap((entry, order) => {
    const own = `${entry.title} ${entry.text}`;
    const full = `${own} ${entry.context}`;
    if (!terms.every(term => hasTerm(full, term)) || !terms.some(term => hasTerm(own, term))) return [];
    const score = (entry.title === phrase ? 220 : entry.title.includes(phrase) ? 140 : 0)
      + terms.reduce((sum, term) => sum + (hasTerm(entry.title, term) ? 45 : hasTerm(entry.text, term) ? 25 : 3), 0)
      + (entry.result.href.includes("#") ? 10 : 0);
    return [{ entry, score, order }];
  });
  // Prefer a matching paragraph or row over its aggregate block, without hiding
  // otherwise unanchored visible text or direct matches on the block heading.
  const matches = ranked.filter(({ entry }) => !entry.container
    || terms.every(term => hasTerm(entry.title, term))
    || !ranked.some(other => other.entry !== entry && other.entry.result.href.startsWith(`${entry.result.href}-`)));
  matches.sort((left, right) => right.score - left.score || left.order - right.order);
  const unique = [...new Map(matches.map(item => [item.entry.result.href, item.entry])).values()];
  const results = unique.slice(offset, offset + limit).map(entry => ({ ...entry.result, snippet: snippet(entry.original, terms) }));
  return { results, total: unique.length, offset, limit, hasMore: offset + results.length < unique.length };
}
