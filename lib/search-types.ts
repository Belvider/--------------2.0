export type SearchResultType = "brand" | "category" | "module" | "product" | "section";

export type SearchResult = {
  type: SearchResultType;
  id: string | number;
  title: string;
  subtitle: string;
  meta?: string;
  snippet?: string;
  href: string;
};

export type SearchResponse = {
  results: SearchResult[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};
