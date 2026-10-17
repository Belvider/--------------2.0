import serviceTradeInContent from "@/lib/content/service-trade-in";
import serviceSaleContent from "@/lib/content/service-sale";
import serviceWarrantyContent from "@/lib/content/service-warranty";
import serviceBaseContent from "@/lib/content/service-base";

export const servicePageSlugs = ["trade-in", "sale", "warranty", "base"] as const;

export type ServicePageSlug = (typeof servicePageSlugs)[number];

export type ServicePageSection = {
  id: string;
  title: string;
  html: string;
};

export type ServicePageContent = {
  slug: ServicePageSlug;
  label: string;
  title: string;
  subtitle: string;
  sideLabel: string;
  sideText: string;
  sections: ServicePageSection[];
};

function createTradeInSections(): ServicePageSection[] {
  const allBlocks = [...serviceTradeInContent.serviceTradeInFoundationBlocks, ...serviceTradeInContent.serviceTradeInCatalogBlocks];

  return allBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `trade-in-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createSaleSections(): ServicePageSection[] {
  return serviceSaleContent.serviceSaleBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `sale-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createWarrantySections(): ServicePageSection[] {
  return serviceWarrantyContent.serviceWarrantyBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `warranty-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createBaseSections(): ServicePageSection[] {
  return serviceBaseContent.serviceBaseBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `base-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

const SERVICE_PAGES: Record<ServicePageSlug, ServicePageContent> = {
  "trade-in": {
    slug: "trade-in",
    label: "Сервісна сторінка",
    title: "Trade-In",
    subtitle:
      "Повний внутрішній гайд по прийому техніки в Trade-In: оцінка, формування вартості, перевірка стану пристрою та покрокові чек-листи для ключових категорій.",
    sideLabel: "Що всередині",
    sideText:
      "Логіка оцінки, документи, перевірка “нових” пристроїв і повні чек-листи по iPhone, iPad, Apple Watch, MacBook, iMac та Sony PlayStation 5.",
    sections: createTradeInSections()
  },
  sale: {
    slug: "sale",
    label: "Сервісна сторінка",
    title: "Продаж",
    subtitle:
      "Повний навчальний матеріал по продажу: підготовка, активне слухання, техніки виявлення потреб, поглиблений підхід до Apple-екосистеми та практичні сценарії консультації по аксесуарах.",
    sideLabel: "Що всередині",
    sideText:
      "Базові й поглиблені техніки продажу, робота з потребами клієнта, приклади консультації по захисних аксесуарах і захисному склу, а також логіка післяпродажної підтримки.",
    sections: createSaleSections()
  },
  warranty: {
    slug: "warranty",
    label: "Сервісна сторінка",
    title: "Умови гарантії",
    subtitle:
      "Повний затверджений матеріал по гарантійних програмах PineApple: безпечний період, гарантія на розбиття, повне знищення та умови для різних категорій техніки.",
    sideLabel: "Що всередині",
    sideText:
      "Окремі гарантійні умови для iPhone, iPad, Apple Watch, AirPods, MacBook, Dyson, PlayStation 5 та EcoFlow, без скорочення вихідного матеріалу.",
    sections: createWarrantySections()
  },
  base: {
    slug: "base",
    label: "Сервісна сторінка",
    title: "База знань",
    subtitle:
      "Повний внутрішній довідник по ремонтах і супровідних процесах: прийом техніки, виконання ремонту, розрахунок, ремонт запасів, відкладені чеки, залишки та карти лояльності.",
    sideLabel: "Що всередині",
    sideText:
      "Покрокові інструкції зі скріншотами по роботі в системі: від створення прийому в ремонт до списання бонусних балів, без скорочення затвердженого матеріалу.",
    sections: createBaseSections()
  }
};

export function isServicePageSlug(value: string): value is ServicePageSlug {
  return servicePageSlugs.includes(value as ServicePageSlug);
}

export function getServicePageContent(slug: ServicePageSlug) {
  return SERVICE_PAGES[slug];
}
