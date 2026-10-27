/** Shared by the server search index and the visible result highlighting. */
export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("uk")
    .replace(/[’'ʼ`]/g, "")
    .replace(/(\d)е(?=$|[^\p{L}\p{N}])/gu, "$1e")
    .replace(/([\p{L}])(\d)/gu, "$1 $2").replace(/(\d)([\p{L}])/gu, "$1 $2")
    .replace(/\bpromax\b/g, "pro max")
    .replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim()
    .replace(/(^| )(гб|тб)(?= |$)/gu, (_, space: string, unit: string) => space + (unit === "гб" ? "gb" : "tb"));
}

export function normalizeSearchQuery(query: string) {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean).map(token => {
    if (/^айфон(?:и|ів|а|у|ом|ах)?$/u.test(token)) return "iphone";
    if (/^айпад(?:и|ів|а|у|ом|ах)?$/u.test(token)) return "ipad";
    if (/^макбук(?:и|ів|а|у|ом|ах)?$/u.test(token)) return "macbook";
    if (token === "епл") return "apple";
    return token;
  });
  for (let index = 0; index < tokens.length - 2; index += 1) {
    if (tokens[index] !== "iphone" || !/^\d{1,2}$/.test(tokens[index + 1])) continue;
    const editionIndex = index + 2;
    if (tokens[editionIndex] === "промакс") tokens.splice(editionIndex, 1, "pro", "max");
    else if (tokens[editionIndex] === "про") tokens[editionIndex] = "pro";
    else if (tokens[editionIndex] === "плюс") tokens[editionIndex] = "plus";
    else if (tokens[editionIndex] === "міні") tokens[editionIndex] = "mini";
    if (tokens[editionIndex] === "pro" && tokens[editionIndex + 1] === "макс") tokens[editionIndex + 1] = "max";
  }
  return tokens.join(" ");
}

export function tokenizeSearchQuery(query: string) {
  return [...new Set(normalizeSearchQuery(query).split(" ").filter(Boolean))];
}
