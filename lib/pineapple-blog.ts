export type PineappleBlogPost = {
  title: string;
  url: string;
  imageUrl: string | null;
  excerpt: string;
  publishedAtLabel: string;
  categoryLabel: string;
};

const BLOG_URL = "https://pineapple.ua/blog";
const BLOG_HOST = "https://pineapple.ua";

const CATEGORY_LABELS: Record<string, string> = {
  novyny: "Новини",
  "ohliad-tekhniky": "Огляд техніки",
  "haidy-ta-instruktsii-how-to": "Гайди та інструкції",
  "idei-dlia-podarunkiv": "Ідеї для подарунків"
};

function extractMatch(source: string, pattern: RegExp) {
  return source.match(pattern)?.[1]?.trim() ?? "";
}

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function toAbsoluteUrl(value: string) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${BLOG_HOST}${value.startsWith("/") ? value : `/${value}`}`;
}

function getCategoryLabelFromUrl(url: string) {
  const parts = url.replace(/^https?:\/\/[^/]+/i, "").split("/").filter(Boolean);
  const categorySlug = parts[1] ?? "";

  if (CATEGORY_LABELS[categorySlug]) {
    return CATEGORY_LABELS[categorySlug];
  }

  if (!categorySlug) {
    return "Блог";
  }

  return categorySlug
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export async function getLatestPineappleBlogPosts(limit = 4): Promise<PineappleBlogPost[]> {
  try {
    const response = await fetch(BLOG_URL, {
      headers: {
        "User-Agent": "Pineapple Learning Dashboard"
      },
      next: {
        revalidate: 1800
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const cardPattern = /<a href="([^"]+)" class="news_list__item">([\s\S]*?)<\/a>/g;
    const posts: PineappleBlogPost[] = [];
    const seenUrls = new Set<string>();

    for (const match of html.matchAll(cardPattern)) {
      const rawUrl = match[1] ?? "";
      const block = match[2] ?? "";
      const url = toAbsoluteUrl(rawUrl);

      if (!url || seenUrls.has(url)) {
        continue;
      }

      const title = stripTags(extractMatch(block, /news_list__item-title">([\s\S]*?)<\/div>/));
      const excerpt = stripTags(extractMatch(block, /news_list__item-text">([\s\S]*?)<\/div>/));
      const publishedAtLabel = stripTags(extractMatch(block, /news_list__item-date">([\s\S]*?)<\/div>/));
      const imageUrl = toAbsoluteUrl(extractMatch(block, /<img src="([^"]+)"/)) || null;

      if (!title || !publishedAtLabel) {
        continue;
      }

      seenUrls.add(url);
      posts.push({
        title,
        url,
        imageUrl,
        excerpt,
        publishedAtLabel,
        categoryLabel: getCategoryLabelFromUrl(url)
      });

      if (posts.length >= limit) {
        break;
      }
    }

    return posts;
  } catch {
    return [];
  }
}
