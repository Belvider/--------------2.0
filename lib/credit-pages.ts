import creditIdeaContent from "@/lib/content/credit-idea";
import creditMonobankContent from "@/lib/content/credit-monobank";
import creditPrivat24Content from "@/lib/content/credit-privat24";
import creditSenseContent from "@/lib/content/credit-sense";
import creditUkrsibContent from "@/lib/content/credit-ukrsib";

export const creditPageSlugs = ["privat24", "monobank", "ukrsib", "idea-bank", "sense-bank"] as const;

export type CreditPageSlug = (typeof creditPageSlugs)[number];

export type CreditPageSection = {
  id: string;
  title: string;
  html: string;
};

export type CreditPageContent = {
  slug: CreditPageSlug;
  label: string;
  title: string;
  subtitle: string;
  sideLabel: string;
  sideText: string;
  sections: CreditPageSection[];
};

function mapBlocksToSections(
  prefix: string,
  blocks: Array<{ type: "text"; title: string; html: string }>
): CreditPageSection[] {
  return blocks.map((block, index) => ({
    id: `${prefix}-section-${index + 1}`,
    title: block.title,
    html: block.html
  }));
}

function createPrivat24Sections() {
  return mapBlocksToSections(
    "privat24",
    creditPrivat24Content.creditPrivat24Blocks.filter(
      (block): block is { type: "text"; title: string; html: string } => block.type === "text"
    )
  );
}

function createMonobankSections() {
  return mapBlocksToSections(
    "monobank",
    creditMonobankContent.creditMonobankBlocks.filter(
      (block): block is { type: "text"; title: string; html: string } => block.type === "text"
    )
  );
}

function createUkrsibSections() {
  return mapBlocksToSections(
    "ukrsib",
    creditUkrsibContent.creditUkrsibBlocks.filter(
      (block): block is { type: "text"; title: string; html: string } => block.type === "text"
    )
  );
}

function createIdeaSections() {
  return mapBlocksToSections(
    "idea-bank",
    creditIdeaContent.creditIdeaBlocks.filter(
      (block): block is { type: "text"; title: string; html: string } => block.type === "text"
    )
  );
}

function createSenseSections() {
  return mapBlocksToSections(
    "sense-bank",
    creditSenseContent.creditSenseBlocks.filter(
      (block): block is { type: "text"; title: string; html: string } => block.type === "text"
    )
  );
}

const CREDIT_PAGES: Record<CreditPageSlug, CreditPageContent> = {
  privat24: {
    slug: "privat24",
    label: "Кредитний блок",
    title: "ПриватБанк",
    subtitle:
      "Повний затверджений матеріал по «Оплаті частинами» та «Миттєвій розстрочці» ПриватБанку: як презентувати послугу, провести оформлення на POS-терміналі та правильно зробити повернення.",
    sideLabel: "Що всередині",
    sideText:
      "Загальна логіка POS-кредитування, відмінності між сервісами ПриватБанку, касовий сценарій оформлення та порядок повернення без втрати важливих деталей.",
    sections: createPrivat24Sections()
  },
  monobank: {
    slug: "monobank",
    label: "Кредитний блок",
    title: "Monobank",
    subtitle:
      "Повний затверджений матеріал по «Покупці частинами» Monobank: подання заявки, статуси, підтвердження видачі товару, історія звернень та скасування покупки.",
    sideLabel: "Що всередині",
    sideText:
      "Умови для 3 платежів і довших термінів, покрокова заявка, розшифровка статусів і логіка роботи з підтвердженням чи поверненням товару.",
    sections: createMonobankSections()
  },
  ukrsib: {
    slug: "ukrsib",
    label: "Кредитний блок",
    title: "УКРСИББАНК",
    subtitle:
      "Повний затверджений матеріал по оформленню кредитної заявки в УКРСИББАНК: підготовка даних, створення заявки, анкета клієнта, доходи та фінальна відправка в банк.",
    sideLabel: "Що всередині",
    sideText:
      "Покрокове проходження всіх етапів анкети з акцентом на правильність даних, перевірку документів, внесення параметрів товару і кредитної програми.",
    sections: createUkrsibSections()
  },
  "idea-bank": {
    slug: "idea-bank",
    label: "Кредитний блок",
    title: "Ідея Банк",
    subtitle:
      "Повний затверджений матеріал по короткій і повній заявці в Ідея Банк: що потрібно зібрати, як отримати попереднє рішення і як без помилок завершити повну анкету.",
    sideLabel: "Що всередині",
    sideText:
      "Логіка короткої заявки, перехід до повної анкети, робота з персональними даними, адресами, зайнятістю, доходами та фінальним відправленням у банк.",
    sections: createIdeaSections()
  },
  "sense-bank": {
    slug: "sense-bank",
    label: "Кредитний блок",
    title: "СЕНС Банк",
    subtitle:
      "Повний затверджений матеріал по оформленню кредитної заявки в СЕНС Банку: підготовка, створення заявки, середня анкета, контактні дані, доходи та фінальна перевірка.",
    sideLabel: "Що всередині",
    sideText:
      "Покрокова робота з кабінетом СЕНС Банку, наповнення анкети клієнта і товару, фото клієнта, параметри кредиту та контроль статусу заявки після відправки.",
    sections: createSenseSections()
  }
};

export function isCreditPageSlug(value: string): value is CreditPageSlug {
  return creditPageSlugs.includes(value as CreditPageSlug);
}

export function getCreditPageContent(slug: CreditPageSlug) {
  return CREDIT_PAGES[slug];
}
