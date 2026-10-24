import { getFactAnchor, getModuleBlockAnchor, getPortalCardAnchor, getPortalCardItemAnchor, getProductAnchor, getProductDetailAnchor, prepareSearchableHtml, stripSearchableHtml } from "@/lib/content-anchors";
import { parseModuleContentBlocks } from "@/lib/module-content";
import { portalPageMeta, type PortalPageContent } from "@/lib/portal-pages";
import type { SearchResponse, SearchResult } from "@/lib/search-types";
import { normalizeSearchQuery, normalizeSearchText, tokenizeSearchQuery } from "@/lib/search-query";
import { getSearchHighlightRanges } from "@/lib/search-highlights";

export { normalizeSearchText, tokenizeSearchQuery } from "@/lib/search-query";

type Brand = { id: number; name: string; slug: string; description?: string | null };
type Category = { id: number; name: string; slug: string; description?: string | null; brand: { name: string; slug: string } };
export type SearchModule = {
  id: number; title: string; description: string; durationMin: number; contentBlocks: unknown; isPublished?: boolean;
  category: { name: string; slug: string; brand: { name: string; slug: string } };
};
type ModelScope = { modelTitle?: string; modelDescription?: string; localContext?: string; aggregate?: boolean; nestedTargets?: string[] };
type IndexEntry = { result: SearchResult; title: string; text: string; context: string; original: string; container?: string } & ModelScope;
export type PortalSearchIndex = IndexEntry[];
type Sources = { modules: SearchModule[]; brands?: Brand[]; categories?: Category[]; portalPages?: PortalPageContent[] };

const text = (value: unknown) => typeof value === "string" ? stripSearchableHtml(value) : "";
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }

/** Keep nested list-item hits attached to their smallest rendered target. */
function nestedFragmentTargets(html: string, anchors: Set<string>) {
  const descendants = new Map<string, string[]>();
  const stack: { tag: string; anchor?: string }[] = [];
  const tokens = /<!--[\s\S]*?(?:-->|$)|<(script|style|noscript)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<\/?([a-z][\w:-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  for (const token of html.matchAll(tokens)) {
    if (!token[2]) continue;
    const tag = token[2].toLowerCase();
    if (token[0].startsWith("</")) {
      let position = stack.length - 1;
      while (position >= 0 && stack[position].tag !== tag) position -= 1;
      if (position >= 0) stack.splice(position);
      continue;
    }
    const candidate = token[0].match(/\sdata-material-anchor="([^"]+)"/)?.[1];
    const anchor = candidate && anchors.has(candidate) ? candidate : undefined;
    if (anchor) for (const parent of stack) if (parent.anchor) {
      const targets = descendants.get(parent.anchor) ?? [];
      targets.push(anchor);
      descendants.set(parent.anchor, targets);
    }
    if (!/^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag) && !token[0].endsWith("/>")) stack.push({ tag, anchor });
  }
  return descendants;
}

export function buildPortalSearchIndex({ modules, brands = [], categories = [], portalPages = [] }: Sources): PortalSearchIndex {
  const index: PortalSearchIndex = [];
  const add = (result: SearchResult, ownTitle: string, ownText = "", context = "", container?: string, modelScope: ModelScope = {}) => {
    const original = text(ownText);
    index.push({ result, title: normalizeSearchText(text(ownTitle)), text: normalizeSearchText(original), context: normalizeSearchText(context), original, container, ...modelScope });
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
      const section = (fragment: string, title: string, ownText: string, meta: string, ownTitle = title, sectionContext = context, container?: string, modelScope: ModelScope = { localContext: block.title }) => {
        add({ type: "section", id: fragment, title, subtitle: path, meta, href: href(fragment) }, ownTitle, ownText, sectionContext, container, modelScope);
      };
      if (block.type === "text") {
        const prepared = prepareSearchableHtml(typeof block.html === "string" ? block.html : "", anchor);
        const nestedTargets = nestedFragmentTargets(prepared.html, new Set(prepared.fragments.map(fragment => fragment.anchor)));
        section(anchor, block.title, text(block.html), "Розділ", block.title, context, anchor, { aggregate: prepared.fragments.some(fragment => fragment.anchor !== anchor) });
        for (const fragment of prepared.fragments) {
          if (fragment.anchor === anchor) continue;
          section(fragment.anchor, fragment.title || block.title, fragment.text, "Фрагмент", "", `${context} ${fragment.title ?? ""}`, undefined, { localContext: fragment.title || block.title, nestedTargets: nestedTargets.get(fragment.anchor) });
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
          add({ type: "product", id: productAnchor, title: product.title, subtitle: path, meta: text(product.family) || "Пристрій", href: href(productAnchor) }, product.title, text(product.family), context, undefined, { modelTitle: product.title, modelDescription: text(product.summary) });
          const detail = (kind: "summary" | "spec" | "highlight" | "color", detailIndex: number, value: string, label: string) => {
            const target = getProductDetailAnchor(productAnchor, kind, detailIndex);
            add({ type: "section", id: target, title: product.title, subtitle: path, meta: label, href: href(target) }, "", value, productContext, undefined, { modelTitle: product.title });
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
  const position = getSearchHighlightRanges(original, terms.join(" "))[0]?.start ?? 0;
  let start = Math.max(0, position - 55);
  if (start > 0) { const space = original.indexOf(" ", start); if (space >= 0 && space < position) start = space + 1; }
  const end = Math.min(original.length, start + 185);
  return `${start ? "…" : ""}${original.slice(start, end).trim()}${end < original.length ? "…" : ""}`;
}

type DeviceModel = { family: string; identifiers: string[]; terms: string[] };

/** Structured identifiers distinguish model names from chips, dates and feature names. */
function deviceModels(value: string): DeviceModel[] {
  const normalized = normalizeSearchQuery(value);
  const models: DeviceModel[] = [];
  const add = (family: string, identifiers: string[], terms: string[]) => models.push({ family, identifiers, terms });
  for (const match of normalized.matchAll(/(?:^| )iphone (\d{1,2}|x[rs]?|se|air|duo)(?= |$)(?: (pro(?: max)?|plus|mini|e|max)(?= |$))?/g)) {
    const edition = match[2]?.split(" ") ?? [];
    add("iphone", [`generation:${match[1]}`, `edition:${edition.includes("pro") ? "pro" : edition[0] ?? "base"}`, ...(edition.includes("max") ? ["size:max"] : [])], ["apple", "iphone", match[1], ...edition]);
  }
  for (const match of normalized.matchAll(/(?:^| )(ipad|macbook)(?: (pro|air|mini))?(?= |$)/g)) {
    const family = match[1], line = match[2] ?? "base";
    const rest = normalized.slice(match.index! + match[0].length).split(/ (?:iphone|ipad|macbook|watch|jbl|dyson|garmin) /)[0];
    const size = rest.match(/^ (\d{1,2}(?: \d)?)(?= |$)/)?.[1];
    const chips = [...rest.matchAll(/(?:^| )m ([1-9]\d?)(?: (pro|max|ultra))?(?= |$)/g)];
    const identifiers = [`line:${line}`, ...(size ? [`size:${size}`] : [])];
    const terms = ["apple", family, ...(match[2] ? [match[2]] : []), ...(size?.split(" ") ?? [])];
    if (chips.length) for (const chip of chips) add(family, [...identifiers, `chip:m${chip[1]}`, ...(chip[2] ? [`chipEdition:${chip[2]}`] : [])], [...terms, "m", chip[1], ...(chip[2] ? [chip[2]] : [])]);
    else add(family, identifiers, terms);
  }
  for (const match of normalized.matchAll(/(?:^| )watch (series|ultra|se)(?: (\d{1,2})(?= |$))?(?= |$)/g)) {
    add("watch", [`line:${match[1]}`, ...(match[2] ? [`generation:${match[2]}`] : [])], ["apple", "watch", match[1], ...(match[2] ? [match[2]] : [])]);
  }
  for (const match of normalized.matchAll(/(?:^| )watch (\d{1,2})(?= |$)/g)) {
    add("watch", ["line:series", `generation:${match[1]}`], ["apple", "watch", match[1]]);
  }
  for (const match of normalized.matchAll(/(?:^| )dyson (v|gen) (\d{1,2})(?= |$)/g)) {
    add("dyson", [`model:${match[1]}${match[2]}`], ["dyson", match[1], match[2]]);
  }
  for (const match of normalized.matchAll(/(?:^| )(jbl|garmin) (flip|charge|boombox|xtreme|go|clip|pulse|partybox|authentics|fenix|epix|tactix|quatix|forerunner|venu|vivoactive|instinct|enduro)(?: (\d{1,3})(?= |$))?(?= |$)/g)) {
    add(match[1], [`line:${match[2]}`, ...(match[3] ? [`generation:${match[3]}`] : [])], [match[1], match[2], ...(match[3] ? [match[3]] : [])]);
  }
  return models;
}

function modelMatches(candidate: DeviceModel, requested: DeviceModel) {
  return candidate.family === requested.family && requested.identifiers.every(part => candidate.identifiers.includes(part));
}

function modelConflicts(candidate: DeviceModel, requested: DeviceModel) {
  return candidate.family === requested.family && candidate.identifiers.some(part => requested.identifiers.some(wanted => wanted.split(":")[0] === part.split(":")[0] && wanted !== part));
}

function qualifiedDeviceModels(value: string, family: string) {
  const names = family === "garmin" ? "fenix|epix|tactix|quatix|forerunner|venu|vivoactive|instinct|enduro"
    : family === "jbl" ? "flip|charge|boombox|xtreme|go|clip|pulse|partybox|authentics" : "";
  const normalized = normalizeSearchQuery(value);
  return deviceModels(names ? normalized.replace(new RegExp(`(?:^| )(${names})(?= |$)`, "g"), ` ${family} $1`) : `${family} ${normalized}`);
}

function entryMatchesModels(entry: IndexEntry, requested: DeviceModel[], own: string) {
  const ownModels = deviceModels(own);
  if (entry.modelTitle !== undefined) return requested.every(intent => {
    const titleModels = deviceModels(entry.modelTitle!).filter(candidate => candidate.family === intent.family);
    if (titleModels.some(candidate => modelMatches(candidate, intent))) return true;
    // A title explicitly naming another generation/line wins over comparative
    // marketing copy. A different-family accessory can still name compatibility.
    if (titleModels.length && titleModels.every(candidate => modelConflicts(candidate, intent))) return false;
    if (ownModels.some(candidate => modelMatches(candidate, intent))) return true;
    if (titleModels.length) {
      const inferred = deviceModels(`${entry.modelTitle} ${entry.modelDescription ?? own}`);
      const qualifiedOwn = qualifiedDeviceModels(entry.modelDescription ?? own, intent.family);
      return [...inferred, ...qualifiedOwn].some(candidate => modelMatches(candidate, intent));
    }
    return false;
  });
  if (ownModels.length) return requested.every(intent => ownModels.some(candidate => modelMatches(candidate, intent)));
  // A paragraph may inherit one precise local heading. Broad module/category
  // paths and a heading that mixes generations cannot label every row below it.
  const localModels = deviceModels(entry.localContext ?? "");
  return localModels.length > 0 && requested.every(intent => localModels.every(candidate => modelMatches(candidate, intent)));
}

export function searchPortalIndex(index: PortalSearchIndex, query: string, options: { offset?: number; limit?: number } = {}): SearchResponse {
  const offset = Math.max(0, Math.floor(options.offset ?? 0));
  const limit = Math.max(1, Math.min(30, Math.floor(options.limit ?? 12)));
  const terms = tokenizeSearchQuery(query);
  if (query.trim().length < 2 || !terms.length) return { results: [], total: 0, offset, limit, hasMore: false };
  const phrase = terms.join(" ");
  const requestedModels = deviceModels(query).map(model => ({ ...model, identifiers: model.identifiers.filter(identifier => identifier !== "edition:base" && identifier !== "line:base") }));
  const modelTerms = new Set(requestedModels.flatMap(model => model.terms));
  const detailTerms = terms.filter(term => !modelTerms.has(term));
  const matchers = new Map(terms.map(term => {
    const number = /^\d+$/.test(term) ? new RegExp(`(?:^| )${term}(?: |$)`) : null;
    return [term, (value: string) => number ? number.test(value) : value.includes(term)] as const;
  }));
  const hasTerm = (value: string, term: string) => matchers.get(term)!(value);
  const ranked = index.flatMap((entry, order) => {
    const own = `${entry.title} ${entry.text}`;
    const full = `${own} ${entry.context} ${requestedModels.length ? normalizeSearchText(entry.modelDescription ?? "") : ""}`;
    if (!terms.every(term => hasTerm(full, term)) || !terms.some(term => hasTerm(own, term))) return [];
    if (requestedModels.length) {
      if (!entryMatchesModels(entry, requestedModels, own)) return [];
      // Do not combine a model in one paragraph with a feature of another model
      // elsewhere in the same imported block.
      if (entry.aggregate && detailTerms.length) return [];
      if (detailTerms.length) {
        if (!detailTerms.every(term => hasTerm(own, term))) return [];
      } else if (entry.result.type !== "product") {
        const explicitOwn = deviceModels(own);
        const qualifiedOwn = entry.modelTitle === undefined ? [] : requestedModels.flatMap(intent => qualifiedDeviceModels(own, intent.family));
        if (![...explicitOwn, ...qualifiedOwn].some(candidate => requestedModels.some(intent => modelMatches(candidate, intent)))) return [];
      }
    }
    const score = (entry.title === phrase ? 220 : entry.title.includes(phrase) ? 140 : 0)
      + terms.reduce((sum, term) => sum + (hasTerm(entry.title, term) ? 45 : hasTerm(entry.text, term) ? 25 : 3), 0)
      + (entry.text === phrase ? 65 : entry.text.includes(phrase) ? 35 : 0)
      + (entry.result.href.includes("#") ? 10 : 0);
    return [{ entry, score, order }];
  });
  // Prefer a matching paragraph or row over its aggregate block, without hiding
  // otherwise unanchored visible text or direct matches on the block heading.
  const byId = new Map(index.map(entry => [String(entry.result.id), entry]));
  const matches = ranked.filter(({ entry }) => {
    if (entry.container && !terms.every(term => hasTerm(entry.title, term))
      && ranked.some(other => other.entry !== entry && other.entry.result.href.startsWith(`${entry.result.href}-`))) return false;
    if (entry.nestedTargets?.length) {
      const children = ranked.filter(other => entry.nestedTargets!.includes(String(other.entry.result.id)));
      const descendants = entry.nestedTargets.map(id => byId.get(id)).filter((child): child is IndexEntry => !!child).sort((left, right) => right.text.length - left.text.length);
      let unique = entry.text;
      for (const child of descendants) unique = unique.replace(child.text, " ");
      if (children.length) {
        const uniqueFull = `${entry.title} ${unique} ${entry.context}`;
        if (!terms.some(term => hasTerm(unique, term)) || !terms.every(term => hasTerm(uniqueFull, term))) return false;
      } else if (!terms.some(term => hasTerm(unique, term))) return false;
    }
    return true;
  });
  matches.sort((left, right) => right.score - left.score || left.entry.text.length - right.entry.text.length || left.order - right.order);
  const unique = [...new Map(matches.map(item => [item.entry.result.href, item.entry])).values()];
  const results = unique.slice(offset, offset + limit).map(entry => ({ ...entry.result, snippet: snippet(entry.original, requestedModels.length && detailTerms.length ? detailTerms : terms) }));
  return { results, total: unique.length, offset, limit, hasMore: offset + results.length < unique.length };
}
