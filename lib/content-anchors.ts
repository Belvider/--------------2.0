import type { ModuleContentBlock } from "./module-content";

/** Shared by the search index and the material renderer. Never derive links from translated labels. */
export function getModuleBlockAnchor(moduleId: number, blockIndex: number) {
  return `module-${moduleId}-topic-${blockIndex + 1}`;
}

export function getProductAnchor(blockAnchor: string, productIndex: number) {
  return `${blockAnchor}-product-${productIndex + 1}`;
}

export function getProductDetailAnchor(productAnchor: string, kind: "summary" | "spec" | "highlight" | "color", index = 0) {
  return `${productAnchor}-${kind}-${index + 1}`;
}

export function getFactAnchor(blockAnchor: string, index: number) {
  return `${blockAnchor}-fact-${index + 1}`;
}

export function getPortalCardAnchor(pageSlug: string, cardIndex: number) {
  return `portal-${pageSlug}-card-${cardIndex + 1}`;
}

export function getPortalCardItemAnchor(cardAnchor: string, itemIndex: number) {
  return `${cardAnchor}-item-${itemIndex + 1}`;
}

/** Includes original product slugs and authored HTML ids for previously shared links. */
export function findModuleBlockIndexForAnchor(moduleId: number, blocks: ModuleContentBlock[], anchor: string) {
  const generated = anchor.match(new RegExp(`^module-${moduleId}-topic-(\\d+)(?:-|$)`));
  if (generated) {
    const index = Number(generated[1]) - 1;
    if (index >= 0 && index < blocks.length) return index;
  }
  return blocks.findIndex((block) => {
    if (block.type === "productCatalog") return block.products.some((product) => product.slug === anchor);
    if (block.type === "text") return Array.from(block.html.matchAll(/\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi))
      .some((match) => decodeEntities(match[1] ?? match[2] ?? match[3]) === anchor);
    return false;
  });
}

const namedEntities: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ensp: " ", emsp: " ", thinsp: " ",
  ndash: "–", mdash: "—", minus: "−", hellip: "…", laquo: "«", raquo: "»", lsquo: "‘", rsquo: "’",
  ldquo: "“", rdquo: "”", bull: "•", middot: "·", times: "×", divide: "÷", deg: "°", copy: "©", reg: "®", trade: "™",
  euro: "€", pound: "£", yen: "¥", cent: "¢", micro: "µ", plusmn: "±", le: "≤", ge: "≥", ne: "≠", shy: ""
};

function decodeEntities(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z][a-z\d]+);/gi, (entity, name: string) => {
    if (name[0] !== "#") return namedEntities[name.toLowerCase()] ?? entity;
    const codePoint = name[1]?.toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return codePoint > 0 && codePoint <= 0x10ffff && !(codePoint >= 0xd800 && codePoint <= 0xdfff)
      ? String.fromCodePoint(codePoint) : "";
  });
}

// Quoted attributes may contain angle brackets. Script/style contents are raw
// text; tags written inside them must never affect the surrounding element stack.
const HTML_TOKEN_SOURCE = String.raw`<!--[\s\S]*?(?:-->|$)|<(script|style|noscript)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<\/?[a-z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>|<![^>]*>`;

/** Visible copy only: URLs, CSS, JS, comments and HTML attributes are never searchable. */
export function stripSearchableHtml(html: string) {
  const stack: { tag: string; hidden: boolean }[] = [];
  const chunks: string[] = [];
  const token = new RegExp(HTML_TOKEN_SOURCE, "gi");
  const voidTags = /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;
  let position = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(html))) {
    if (!stack.some((entry) => entry.hidden)) chunks.push(html.slice(position, match.index));
    chunks.push(" ");
    position = token.lastIndex;
    const markup = match[0];
    if (markup.startsWith("<!") || match[1]) continue;
    const tag = markup.match(/^<\/?([\w:-]+)/)?.[1]?.toLowerCase();
    if (!tag) continue;
    if (markup.startsWith("</")) {
      let index = stack.length - 1;
      while (index >= 0 && stack[index].tag !== tag) index -= 1;
      if (index >= 0) stack.splice(index);
    } else if (!voidTags.test(tag) && !markup.endsWith("/>")) {
      stack.push({ tag, hidden: /^(?:script|style|template|noscript)$/.test(tag)
        || /\s(?:hidden(?=\s|=|>)|aria-hidden\s*=\s*(?:["']true["']|true(?=\s|>)))/i.test(markup) });
    }
  }
  if (!stack.some((entry) => entry.hidden)) chunks.push(html.slice(position));
  return decodeEntities(chunks.join(" ")).replace(/\s+/g, " ").trim();
}

export type SearchableHtmlFragment = { anchor: string; text: string; title?: string };

/**
 * Add stable targets to readable units without reparsing or normalizing authored HTML.
 * An existing id remains intact; data-material-anchor provides a second target for search.
 */
export function prepareSearchableHtml(html: string, blockAnchor: string): { html: string; fragments: SearchableHtmlFragment[] } {
  type Element = { tag: string; start: number; openingEnd: number; end: number; innerEnd: number; opening: string; targeted: boolean };
  const elements: Element[] = [];
  const stack: Element[] = [];
  const token = new RegExp(HTML_TOKEN_SOURCE, "gi");
  const targetTags = /^(?:h[1-6]|p|li|tr|blockquote|dt|dd|figcaption|summary|caption)$/;
  const voidTags = /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;
  let match: RegExpExecArray | null;
  while ((match = token.exec(html))) {
    const opening = match[0];
    if (opening.startsWith("<!") || match[1]) continue;
    const tag = opening.match(/^<\/?([\w:-]+)/)?.[1]?.toLowerCase();
    if (!tag) continue;
    if (opening.startsWith("</")) {
      let index = stack.length - 1;
      while (index >= 0 && stack[index].tag !== tag) index -= 1;
      if (index < 0) continue;
      for (const element of stack.splice(index)) {
        element.innerEnd = match.index;
        element.end = token.lastIndex;
      }
      continue;
    }
    const excluded = /^(?:script|style|template|noscript)$/.test(tag) || /\s(?:hidden(?=\s|=|>)|aria-hidden\s*=\s*(?:["']true["']|true(?=\s|>)))/i.test(opening)
      || stack.some((element) => /^(?:script|style|template|noscript)$/.test(element.tag) || /\s(?:hidden(?=\s|=|>)|aria-hidden\s*=\s*(?:["']true["']|true(?=\s|>)))/i.test(element.opening));
    const element: Element = { tag, start: match.index, openingEnd: token.lastIndex, end: html.length, innerEnd: html.length, opening, targeted: !excluded && targetTags.test(tag) };
    elements.push(element);
    if (!voidTags.test(tag) && !opening.endsWith("/>")) stack.push(element);
  }

  // A table row or list item is one useful result even when it contains paragraph markup.
  const readable = elements.filter((element) => element.targeted && !elements.some((parent) =>
    parent !== element && parent.targeted && /^(?:tr|li)$/.test(parent.tag) && !(parent.tag === "li" && element.tag === "li")
    && parent.start < element.start && parent.end >= element.end));
  const fragments: SearchableHtmlFragment[] = [];
  const edits: { position: number; remove: number; html: string }[] = [];
  let heading: string | undefined;
  for (const element of readable) {
    const text = stripSearchableHtml(html.slice(element.openingEnd, element.innerEnd));
    if (!text) continue;
    if (/^h[1-6]$/.test(element.tag)) heading = text;
    const anchor = `${blockAnchor}-text-${fragments.length + 1}`;
    fragments.push({ anchor, text, ...(heading ? { title: heading } : {}) });
    const hasId = /\sid\s*=/i.test(element.opening);
    const attributes = `${hasId ? "" : ` id="${anchor}"`} data-material-anchor="${anchor}"`;
    edits.push({ position: element.start, remove: element.openingEnd - element.start, html: element.opening.replace(/\/?\s*>$/, (ending) => `${attributes}${ending}`) });
  }

  // Imported comparison tables can have their own minimum width. Keep their
  // horizontal scrolling local to the table, including on an exact row link.
  for (const table of elements.filter((element) => element.tag === "table")) {
    const alreadyWrapped = elements.some((ancestor) => {
      if (ancestor.start >= table.start || ancestor.end < table.end) return false;
      const classAttribute = ancestor.opening.match(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      return (classAttribute?.[1] ?? classAttribute?.[2] ?? classAttribute?.[3] ?? "").split(/\s+/).includes("table-scroll");
    });
    if (alreadyWrapped) continue;
    edits.push({ position: table.start, remove: 0, html: '<div class="table-scroll" role="region" aria-label="Таблиця навчального матеріалу" tabindex="0">' });
    edits.push({ position: table.end, remove: 0, html: "</div>" });
  }

  let prepared = html;
  for (const edit of edits.sort((left, right) => right.position - left.position || right.remove - left.remove)) {
    prepared = prepared.slice(0, edit.position) + edit.html + prepared.slice(edit.position + edit.remove);
  }
  // Bare text in an imported block still links to its containing topic.
  if (!fragments.length) {
    const text = stripSearchableHtml(html);
    if (text) fragments.push({ anchor: blockAnchor, text });
  }
  return { html: prepared, fragments };
}
