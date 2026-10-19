import fs from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { parseModuleContentBlocks } from "@/lib/module-content";
import { prisma } from "@/lib/prisma";

type Keyword = {
  label: string;
  pattern: RegExp;
};

export type ContentAuditIssue = {
  scope: "source" | "database";
  location: string;
  field: string;
  text: string;
  unexpected: string[];
};

export type ContentAuditPlaceholderModule = {
  id: number;
  title: string;
  brand: string;
  category: string;
  signals: string[];
  blockPreviews: ContentAuditPlaceholderBlockPreview[];
};

export type ContentAuditPlaceholderCategory = {
  brand: string;
  category: string;
  modulesCount: number;
  placeholderModulesCount: number;
  modules: Array<{
    id: number;
    title: string;
    signals: string[];
  }>;
};

export type ContentAuditPlaceholderBlockPreview = {
  type: string;
  title: string | null;
  previewText: string | null;
  url: string | null;
  itemCount: number;
};

export type ContentAuditSnapshot = {
  sourceIssues: ContentAuditIssue[];
  databaseIssues: ContentAuditIssue[];
  placeholderModules: ContentAuditPlaceholderModule[];
  placeholderCategories: ContentAuditPlaceholderCategory[];
  totals: {
    visibleIssues: number;
    sourceIssues: number;
    databaseIssues: number;
    placeholderModules: number;
    placeholderCategories: number;
  };
};

type MinimalPrismaClient = Pick<PrismaClient, "module" | "category">;
type PortalAwarePrismaClient = MinimalPrismaClient & Pick<PrismaClient, "appSetting">;

const contentDir = path.join(process.cwd(), "lib/content");
const VISIBLE_LINE_PATTERN = /(title:|caption:|summary:|family:|html:)/;

const KEYWORDS: Keyword[] = [
  { label: "Apple", pattern: /\bApple\b/i },
  { label: "iPhone", pattern: /\biPhone\b/i },
  { label: "iPad", pattern: /\biPad\b/i },
  { label: "MacBook", pattern: /\bMacBook\b/i },
  { label: "iMac", pattern: /\biMac\b/i },
  { label: "AirPods", pattern: /\bAirPods\b/i },
  { label: "Apple Watch", pattern: /Apple Watch/i },
  { label: "Dyson", pattern: /\bDyson\b/i },
  { label: "Garmin", pattern: /\bGarmin\b/i },
  { label: "JBL", pattern: /\bJBL\b/i },
  { label: "Marshall", pattern: /\bMarshall\b/i },
  { label: "PlayStation", pattern: /\bPlayStation\b|\bPS5\b/i },
  { label: "Xbox", pattern: /\bXbox\b/i },
  { label: "Nintendo", pattern: /\bNintendo\b/i },
  { label: "GoPro", pattern: /\bGoPro\b/i },
  { label: "DJI", pattern: /\bDJI\b/i },
  { label: "Canon", pattern: /\bCanon\b/i },
  { label: "Instax", pattern: /\bInstax\b/i },
  { label: "Smeg", pattern: /\bSmeg\b|\bSMEG\b/i },
  { label: "Harman", pattern: /\bHarman\b/i },
  { label: "Citation", pattern: /\bCitation\b/i },
  { label: "Onyx", pattern: /\bOnyx\b/i },
  { label: "WHOOP", pattern: /\bWHOOP\b/i },
  { label: "EcoFlow", pattern: /\bEcoFlow\b/i },
  { label: "Bluetti", pattern: /\bBluetti\b/i },
  { label: "Anker", pattern: /\bAnker\b/i },
  { label: "Jackery", pattern: /\bJackery\b/i },
  { label: "Pitaka", pattern: /\bPitaka\b/i },
  { label: "Spigen", pattern: /\bSpigen\b/i },
  { label: "UAG", pattern: /\bUAG\b/i },
  { label: "Belkin", pattern: /\bBelkin\b/i },
  { label: "Satechi", pattern: /\bSatechi\b/i },
  { label: "Privat", pattern: /ПриватБанк|\bPrivat\b/i },
  { label: "Monobank", pattern: /\bMonobank\b/i },
  { label: "Ukrsib", pattern: /УКРСИБ|Ukrsib/i },
  { label: "Idea", pattern: /Ідея Банк|\bIdea\b/i },
  { label: "SenseBank", pattern: /СЕНС Банк|Sense Bank/i }
];

const SOURCE_ALLOWED_LABELS: Record<string, string[]> = {
  "learning-category-repairs.ts": ["PlayStation", "DJI", "Harman", "Citation", "Onyx", "WHOOP", "EcoFlow"],
  "accessory-apple-peripherals.ts": ["Apple", "iPhone", "iPad", "MacBook", "iMac", "AirPods", "Apple Watch"],
  "accessory-belkin.ts": ["Belkin", "Apple", "iPhone", "iPad", "MacBook", "AirPods", "Apple Watch"],
  "accessory-cases.ts": ["Apple", "iPhone", "iPad", "Pitaka", "Spigen", "UAG"],
  "accessory-glass.ts": ["Apple", "iPhone"],
  "accessory-power.ts": ["Apple", "iPhone", "iPad", "MacBook", "AirPods", "Apple Watch"],
  "accessory-satechi.ts": ["Satechi", "Apple", "iPhone", "iPad", "MacBook", "iMac", "AirPods", "Apple Watch"],
  "apple-airpods.ts": ["Apple", "AirPods", "iPhone", "iPad", "MacBook", "Apple Watch"],
  "apple-imac.ts": ["Apple", "iMac", "MacBook", "iPhone", "iPad", "AirPods", "Apple Watch"],
  "apple-ipad.ts": ["Apple", "iPad", "iPhone", "MacBook", "Apple Watch", "AirPods"],
  "apple-iphone.ts": ["Apple", "iPhone", "AirPods", "Apple Watch", "iPad", "MacBook"],
  "apple-macbook.ts": ["Apple", "MacBook", "iPhone", "iPad", "iMac", "AirPods", "Apple Watch"],
  "apple-peripherals.ts": ["Apple", "iPhone", "iPad", "MacBook", "iMac", "AirPods", "Apple Watch", "Xbox"],
  "apple-watch.ts": ["Apple", "Apple Watch", "iPhone", "AirPods"],
  "cameras-digital-cameras.ts": ["Canon", "Instax", "DJI", "GoPro"],
  "cameras-go-pro.ts": ["GoPro", "DJI", "Apple", "iPhone", "AirPods"],
  "credit-idea.ts": ["Idea"],
  "credit-monobank.ts": ["Monobank"],
  "credit-privat24.ts": ["Privat", "Apple", "iPhone"],
  "credit-sense.ts": ["SenseBank"],
  "credit-ukrsib.ts": ["Ukrsib"],
  "dyson-air-purifiers.ts": ["Dyson"],
  "dyson-hair-stylers.ts": ["Dyson", "Onyx"],
  "dyson-vacuums.ts": ["Dyson"],
  "garmin-smart-watches.ts": ["Garmin", "Apple", "Apple Watch", "iPhone"],
  "harman-home-audio.ts": ["Harman", "Citation", "Onyx"],
  "jbl-bluetooth-speakers.ts": ["JBL"],
  "marshall-bluetooth-speakers.ts": ["Marshall"],
  "playstation-gaming-consoles.ts": ["PlayStation", "Xbox", "Nintendo"],
  "portable-power-stations.ts": ["EcoFlow", "Bluetti", "Anker", "Jackery", "Apple", "MacBook"],
  "service-base.ts": [],
  "service-sale.ts": ["Apple", "iPhone", "iPad", "MacBook", "AirPods", "Apple Watch"],
  "service-trade-in.ts": ["Apple", "iPhone", "iPad", "MacBook", "iMac", "AirPods", "Apple Watch", "PlayStation"],
  "service-warranty.ts": ["Apple", "iPhone", "iPad", "MacBook", "AirPods", "Apple Watch", "Dyson", "PlayStation", "EcoFlow"],
  "smeg-coffee-machines.ts": ["Smeg", "Apple"],
  "smeg-kettles.ts": ["Smeg"],
  "smeg-toasters.ts": ["Smeg"],
  "whoop-fitness-trackers.ts": ["WHOOP"]
};

const PORTAL_MAPPING_CONTENT_FILES: Record<string, string> = {
  "service-trade-in": "service-trade-in.ts",
  "service-sale": "service-sale.ts",
  "service-warranty": "service-warranty.ts",
  "service-base": "service-base.ts",
  "accessory-cases": "accessory-cases.ts",
  "accessory-glass": "accessory-glass.ts",
  "accessory-power": "accessory-power.ts",
  "accessory-belkin": "accessory-belkin.ts",
  "accessory-satechi": "accessory-satechi.ts",
  "accessory-apple-peripherals": "accessory-apple-peripherals.ts",
  "credit-privat24": "credit-privat24.ts",
  "credit-monobank": "credit-monobank.ts",
  "credit-ukrsib": "credit-ukrsib.ts",
  "credit-idea-bank": "credit-idea.ts",
  "credit-sense-bank": "credit-sense.ts"
};

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function clampText(value: string | null | undefined, limit = 180) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return null;
  }

  return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized;
}

function extractHeadingsFromHtml(value: string) {
  return [...value.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((match) => stripTags(match[1] ?? ""))
    .filter(Boolean);
}

function detectUnexpectedLabels(text: string, allowedLabels: Set<string>) {
  return KEYWORDS.filter((keyword) => keyword.pattern.test(text) && !allowedLabels.has(keyword.label)).map(
    (keyword) => keyword.label
  );
}

function getAllowedLabelsForModule(brand: string, category: string) {
  const labels = new Set<string>([brand]);

  const add = (...values: string[]) => {
    values.forEach((value) => labels.add(value));
  };

  switch (brand) {
    case "Apple":
      add("Apple", "iPhone", "iPad", "MacBook", "iMac", "AirPods", "Apple Watch");
      break;
    case "Dyson":
      add("Dyson", "Onyx");
      break;
    case "Garmin":
      add("Garmin", "Apple", "Apple Watch", "iPhone");
      break;
    case "JBL":
      add("JBL");
      break;
    case "Marshall":
      add("Marshall");
      break;
    case "PlayStation":
      add("PlayStation", "Xbox", "Nintendo");
      break;
    case "Камери":
      add("GoPro", "DJI", "Canon", "Instax", "Apple", "iPhone", "AirPods");
      break;
    case "Smeg":
      add("Smeg");
      break;
    case "Harman":
      add("Harman", "Citation", "Onyx");
      break;
    case "Whoop":
      add("WHOOP");
      break;
    case "Портативні станції":
      add("EcoFlow", "Bluetti", "Anker", "Jackery", "Apple", "MacBook");
      break;
    default:
      break;
  }

  if (category.includes("Периферія")) {
    add("Apple", "PlayStation");
  }

  return labels;
}

function scanVisibleContent(
  value: unknown,
  allowedLabels: Set<string>,
  issues: ContentAuditIssue[],
  location: string,
  fieldPrefix = "content"
) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      scanVisibleContent(entry, allowedLabels, issues, location, `${fieldPrefix}[${index}]`);
    });
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, raw] of Object.entries(value)) {
    const field = `${fieldPrefix}.${key}`;

    if (typeof raw === "string") {
      if (["title", "caption", "summary", "family"].includes(key)) {
        const unexpected = detectUnexpectedLabels(raw, allowedLabels);
        if (unexpected.length > 0) {
          issues.push({
            scope: "database",
            location,
            field,
            text: raw,
            unexpected
          });
        }
      }

      if (key === "html") {
        for (const heading of extractHeadingsFromHtml(raw)) {
          const unexpected = detectUnexpectedLabels(heading, allowedLabels);
          if (unexpected.length > 0) {
            issues.push({
              scope: "database",
              location,
              field: `${field}#heading`,
              text: heading,
              unexpected
            });
          }
        }
      }
    } else {
      scanVisibleContent(raw, allowedLabels, issues, location, field);
    }
  }
}

function getPlaceholderSignals(contentBlocks: unknown) {
  const payload = JSON.stringify(contentBlocks);
  const signals: string[] = [];

  if (payload.includes("https://www.youtube.com/embed/1La4QzGeaaQ")) {
    signals.push("demo-video");
  }

  if (payload.includes("dummy.pdf")) {
    signals.push("dummy-pdf");
  }

  if (payload.includes("Що має знати продавець")) {
    signals.push("generic-seller-block");
  }

  if (payload.includes("Важливо знати")) {
    signals.push("generic-important-block");
  }

  return signals;
}

function getPlaceholderBlockPreviews(contentBlocks: unknown): ContentAuditPlaceholderBlockPreview[] {
  return parseModuleContentBlocks(contentBlocks)
    .slice(0, 4)
    .map((block) => {
      if (block.type === "text") {
        return {
          type: block.type,
          title: block.title ?? null,
          previewText: clampText(stripTags(block.html)),
          url: null,
          itemCount: 0
        } satisfies ContentAuditPlaceholderBlockPreview;
      }

      if (block.type === "facts") {
        return {
          type: block.type,
          title: block.title ?? null,
          previewText: clampText(block.items.slice(0, 3).join(" • ")),
          url: null,
          itemCount: block.items.length
        } satisfies ContentAuditPlaceholderBlockPreview;
      }

      if (block.type === "productCatalog") {
        return {
          type: block.type,
          title: block.title ?? null,
          previewText: clampText(block.products.slice(0, 2).map((product) => product.title).join(" • ")),
          url: null,
          itemCount: block.products.length
        } satisfies ContentAuditPlaceholderBlockPreview;
      }

      if (block.type === "image") {
        return {
          type: block.type,
          title: block.title ?? null,
          previewText: clampText(block.caption ?? null),
          url: block.url,
          itemCount: 0
        } satisfies ContentAuditPlaceholderBlockPreview;
      }

      return {
        type: block.type,
        title: block.title ?? null,
        previewText: null,
        url: block.url,
        itemCount: 0
      } satisfies ContentAuditPlaceholderBlockPreview;
    });
}

export function auditSourceContentFiles(directory = contentDir) {
  const issues: ContentAuditIssue[] = [];
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".ts")).sort();

  for (const file of files) {
    const allowedLabels = new Set(SOURCE_ALLOWED_LABELS[file] ?? []);
    const lines = fs.readFileSync(path.join(directory, file), "utf8").split("\n");

    lines.forEach((line, index) => {
      if (!VISIBLE_LINE_PATTERN.test(line)) {
        return;
      }

      const unexpected = detectUnexpectedLabels(line, allowedLabels);
      if (unexpected.length === 0) {
        return;
      }

      issues.push({
        scope: "source",
        location: `${file}:${index + 1}`,
        field: "visible-line",
        text: line.trim(),
        unexpected
      });
    });
  }

  return issues;
}

export async function auditDatabaseModuleContent(client: PortalAwarePrismaClient = prisma) {
  const issues: ContentAuditIssue[] = [];
  const [modules, portalMapping] = await Promise.all([client.module.findMany({
    select: {
      id: true,
      title: true,
      contentBlocks: true,
      category: {
        select: {
          name: true,
          brand: {
            select: {
              name: true,
              slug: true
            }
          }
        }
      }
    }
  }), client.appSetting.findUnique({
    where: { key: "portal_module_mapping" },
    select: { value: true }
  })]);

  const portalLabelsByModule = new Map<number, Set<string>>();
  if (portalMapping?.value && typeof portalMapping.value === "object" && !Array.isArray(portalMapping.value)) {
    for (const [key, moduleId] of Object.entries(portalMapping.value)) {
      const sourceFile = PORTAL_MAPPING_CONTENT_FILES[key];
      if (!sourceFile || typeof moduleId !== "number" || !Number.isSafeInteger(moduleId) || moduleId < 1) continue;
      const allowed = portalLabelsByModule.get(moduleId) ?? new Set<string>();
      for (const label of SOURCE_ALLOWED_LABELS[sourceFile] ?? []) allowed.add(label);
      portalLabelsByModule.set(moduleId, allowed);
    }
  }

  for (const moduleItem of modules) {
    const brand = moduleItem.category.brand.name;
    const category = moduleItem.category.name;
    const location = `${brand} / ${category} / ${moduleItem.title}`;
    const allowedLabels = getAllowedLabelsForModule(brand, category);
    // Only the explicitly mapped academy module inherits its own source-file
    // context. Retail modules and unmapped academy content keep strict checks.
    if (moduleItem.category.brand.slug === "pineapple-academy") {
      for (const label of portalLabelsByModule.get(moduleItem.id) ?? []) allowedLabels.add(label);
    }

    const titleUnexpected = detectUnexpectedLabels(moduleItem.title, allowedLabels);
    if (titleUnexpected.length > 0) {
      issues.push({
        scope: "database",
        location,
        field: "module.title",
        text: moduleItem.title,
        unexpected: titleUnexpected
      });
    }

    scanVisibleContent(moduleItem.contentBlocks, allowedLabels, issues, location);
  }

  return issues;
}

export async function auditPlaceholderModules(client: MinimalPrismaClient = prisma) {
  const modules = await client.module.findMany({
    where: {
      isPublished: true
    },
    orderBy: [{ category: { brand: { name: "asc" } } }, { category: { name: "asc" } }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      contentBlocks: true,
      category: {
        select: {
          name: true,
          brand: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  return modules
    .map((moduleItem) => {
      const signals = getPlaceholderSignals(moduleItem.contentBlocks);

      return {
        id: moduleItem.id,
        title: moduleItem.title,
        brand: moduleItem.category.brand.name,
        category: moduleItem.category.name,
        signals,
        blockPreviews: getPlaceholderBlockPreviews(moduleItem.contentBlocks)
      } satisfies ContentAuditPlaceholderModule;
    })
    .filter((moduleItem) => moduleItem.signals.length >= 2);
}

export async function auditPlaceholderCategories(client: MinimalPrismaClient = prisma) {
  const categories = await client.category.findMany({
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    select: {
      name: true,
      brand: {
        select: {
          name: true
        }
      },
      modules: {
        where: {
          isPublished: true
        },
        select: {
          id: true,
          title: true,
          contentBlocks: true
        }
      }
    }
  });

  return categories
    .map((category) => {
      const publishedModules = category.modules;
      const placeholderModules = publishedModules.filter((moduleItem) => getPlaceholderSignals(moduleItem.contentBlocks).length >= 2);

      return {
        brand: category.brand.name,
        category: category.name,
        modulesCount: publishedModules.length,
        placeholderModulesCount: placeholderModules.length,
        modules: placeholderModules.map((moduleItem) => ({
          id: moduleItem.id,
          title: moduleItem.title,
          signals: getPlaceholderSignals(moduleItem.contentBlocks)
        }))
      } satisfies ContentAuditPlaceholderCategory;
    })
    .filter((category) => category.modulesCount > 0 && category.modulesCount === category.placeholderModulesCount);
}

export async function getContentAuditSnapshot(client: PortalAwarePrismaClient = prisma): Promise<ContentAuditSnapshot> {
  const [sourceIssues, databaseIssues, placeholderModules, placeholderCategories] = await Promise.all([
    Promise.resolve(auditSourceContentFiles()),
    auditDatabaseModuleContent(client),
    auditPlaceholderModules(client),
    auditPlaceholderCategories(client)
  ]);

  return {
    sourceIssues,
    databaseIssues,
    placeholderModules,
    placeholderCategories,
    totals: {
      visibleIssues: sourceIssues.length + databaseIssues.length,
      sourceIssues: sourceIssues.length,
      databaseIssues: databaseIssues.length,
      placeholderModules: placeholderModules.length,
      placeholderCategories: placeholderCategories.length
    }
  };
}
