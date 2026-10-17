export type MatchingOptions = { left: string[]; right: string[] };

export function getMatchingOptions(value: unknown): MatchingOptions {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
  const strings = (items: unknown) => Array.isArray(items) ? items.map(String) : [];
  return { left: strings(source.left), right: strings(source.right) };
}

export function hasMatchingAnswer(answer: unknown, options: MatchingOptions) {
  if (!answer || typeof answer !== "object" || Array.isArray(answer) || !options.left.length) return false;
  const values = answer as Record<string, unknown>;
  return Object.keys(values).length === options.left.length && options.left.every((_, index) => {
    const value = values[String(index)];
    return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < options.right.length;
  });
}
