import { clsx } from "clsx";

const ukrainianTextCollator = new Intl.Collator("uk", {
  numeric: true,
  sensitivity: "base"
});

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function compareUkText(left: string, right: string) {
  return ukrainianTextCollator.compare(left, right);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(date));
}
