export type ModuleBlockType = "video" | "pdf" | "text" | "image" | "facts" | "productCatalog";

export type ModuleCatalogColor = {
  label: string;
  imageUrl: string;
  caption: string;
  default?: boolean;
};

export type ModuleCatalogProduct = {
  slug: string;
  title: string;
  family?: string;
  summary?: string;
  overview: string[];
  highlights: string[];
  colors: ModuleCatalogColor[];
};

type BaseBlock = {
  type: ModuleBlockType;
  title: string;
};

export type VideoBlock = BaseBlock & {
  type: "video";
  provider?: string;
  url: string;
};

export type PdfBlock = BaseBlock & {
  type: "pdf";
  url: string;
};

export type TextBlock = BaseBlock & {
  type: "text";
  html: string;
};

export type ImageBlock = BaseBlock & {
  type: "image";
  url: string;
  caption?: string;
};

export type FactsBlock = BaseBlock & {
  type: "facts";
  items: string[];
};

export type ProductCatalogBlock = BaseBlock & {
  type: "productCatalog";
  products: ModuleCatalogProduct[];
};

export type ModuleContentBlock =
  | VideoBlock
  | PdfBlock
  | TextBlock
  | ImageBlock
  | FactsBlock
  | ProductCatalogBlock;

const VALID_BLOCK_TYPES: ModuleBlockType[] = ["video", "pdf", "text", "image", "facts", "productCatalog"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseModuleContentBlocks(value: unknown): ModuleContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    if (typeof item.type !== "string" || !VALID_BLOCK_TYPES.includes(item.type as ModuleBlockType)) {
      return [];
    }

    if (typeof item.title !== "string") {
      return [];
    }

    return [item as ModuleContentBlock];
  });
}
