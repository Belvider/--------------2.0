import { normalizeSearchText, tokenizeSearchQuery } from "./search-query";

type Range = { start: number; end: number };

/** Map normalized matches back to the authored copy, including apostrophes and aliases. */
export function getSearchHighlightRanges(text: string, query: string): Range[] {
  const terms = tokenizeSearchQuery(query);
  if (!terms.length) return [];
  const ranges: Range[] = [];
  for (const word of text.matchAll(/[\p{L}\p{N}\p{M}]+(?:[’'ʼ`][\p{L}\p{N}\p{M}]+)*/gu)) {
    const original = word[0];
    const base = word.index!;
    const normalized = normalizeSearchText(original);
    const positions: Range[] = [];
    // Keep combining characters together so NFKC cannot change their source offsets.
    for (const character of original.matchAll(/\P{M}\p{M}*|\p{M}+/gu)) {
      const folded = normalizeSearchText(character[0]).replaceAll(" ", "");
      for (let i = 0; i < folded.length; i++) positions.push({ start: base + character.index!, end: base + character.index! + character[0].length });
    }
    let offset = 0;
    for (const token of normalized.split(" ").filter(Boolean)) {
      const canonical = tokenizeSearchQuery(token)[0] ?? token;
      for (const term of terms) {
        if (/^\d+$/.test(term) && canonical !== term) continue;
        let at = canonical.indexOf(term);
        while (at >= 0) {
          const aliased = canonical !== token;
          const first = positions[offset + (aliased ? 0 : at)];
          const last = positions[offset + (aliased ? token.length : at + term.length) - 1];
          if (first && last) ranges.push({ start: first.start, end: last.end });
          at = canonical.indexOf(term, at + term.length);
        }
      }
      offset += token.length;
    }
  }
  // Preserve meaningful punctuation in exact matches such as “A+” or “USB-C”.
  for (const term of query.trim().split(/\s+/u).filter(term => /[^\p{L}\p{N}]/u.test(term))) {
    const expression = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu");
    for (const match of text.matchAll(expression)) ranges.push({ start: match.index!, end: match.index! + match[0].length });
  }
  const merged: Range[] = [];
  for (const range of ranges.sort((a, b) => a.start - b.start || a.end - b.end)) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}

export function splitSearchHighlights(text: string, query: string) {
  const segments: { text: string; highlighted: boolean }[] = [];
  let position = 0;
  for (const range of getSearchHighlightRanges(text, query)) {
    if (range.start > position) segments.push({ text: text.slice(position, range.start), highlighted: false });
    segments.push({ text: text.slice(range.start, range.end), highlighted: true });
    position = range.end;
  }
  if (position < text.length) segments.push({ text: text.slice(position), highlighted: false });
  return segments;
}
