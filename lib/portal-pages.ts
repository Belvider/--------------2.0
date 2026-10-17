export const portalPageSlugs = ["services", "credits", "accessories"] as const;

export type PortalPageSlug = (typeof portalPageSlugs)[number];

export const portalCardIconKeys = [
  "shield-check",
  "wrench",
  "headphones",
  "badge-percent",
  "messages-square",
  "scale",
  "cable",
  "sparkles",
  "package-plus"
] as const;

export type PortalCardIconKey = (typeof portalCardIconKeys)[number];

export type PortalPageCard = {
  id: string;
  title: string;
  icon: PortalCardIconKey;
  text: string;
  items: string[];
  imageUrl: string;
  imageAlt: string;
  href?: string;
};

export type PortalPageContent = {
  slug: PortalPageSlug;
  label: string;
  title: string;
  subtitle: string;
  sideLabel: string;
  sideText: string;
  cards: PortalPageCard[];
};

export const portalPageMeta: Record<
  PortalPageSlug,
  {
    route: string;
    adminLabel: string;
    description: string;
  }
> = {
  services: {
    route: "/services",
    adminLabel: "Послуги та сервіс",
    description: "Гарантія, ремонт, сервісні кейси та підтримка клієнтів"
  },
  credits: {
    route: "/credits",
    adminLabel: "Кредити",
    description: "Фінансові продукти, скрипти продажу та етика фінансування"
  },
  accessories: {
    route: "/accessories",
    adminLabel: "Аксесуари",
    description: "Сумісність і комплекти допродажу"
  }
};

const DEFAULT_PORTAL_PAGES: Record<PortalPageSlug, PortalPageContent> = {
  services: {
    slug: "services",
    label: "Сервісний розділ",
    title: "Послуги та сервіс",
    subtitle:
      "Практичний блок для консультацій у магазині: гарантія, ремонт, сервісні сценарії та якісна підтримка клієнта після продажу.",
    sideLabel: "Фокус розділу",
    sideText:
      "Не просто правила, а готові алгоритми для впевненої комунікації з клієнтом у складних сервісних кейсах.",
    cards: [
      {
        id: "services-trade-in",
        title: "Trade-In",
        icon: "scale",
        text: "Повний сервісний гайд по прийому техніки: оцінка вартості, перевірка стану пристрою та покрокові чек-листи по ключових категоріях.",
        items: [
          "Формування вартості та перевірка “нового” пристрою",
          "Чек-листи для iPhone, iPad, Apple Watch",
          "Прийом MacBook, iMac і Sony PlayStation 5"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/services/trade-in"
      },
      {
        id: "services-sale",
        title: "Продаж",
        icon: "messages-square",
        text: "Повний матеріал по продажу: виявлення потреб, активне слухання, техніки консультації та приклади роботи із захисними аксесуарами.",
        items: [
          "Підготовка, SPIN і виявлення потреб",
          "Поглиблений продаж Apple-екосистеми",
          "Сценарії по чохлах, зарядці та захисному склу"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/services/sale"
      },
      {
        id: "services-warranty",
        title: "Умови гарантії",
        icon: "shield-check",
        text: "Повний матеріал по гарантійних програмах PineApple: безпечний період, гарантія на розбиття, повне знищення та умови для ключових категорій техніки.",
        items: [
          "iPhone, iPad, Apple Watch, AirPods",
          "MacBook, Dyson, PlayStation 5, EcoFlow",
          "Безпечний період, розбиття та повне знищення"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/services/warranty"
      },
      {
        id: "services-base",
        title: "База знань",
        icon: "wrench",
        text: "Внутрішня база по ремонтах і сервісних процесах: прийом техніки, виконання ремонту, розрахунок, відкладені чеки, залишки та робота з картами лояльності.",
        items: [
          "Порядок прийняття та виконання ремонтів",
          "Ремонт запасів, відкладені чеки, залишки",
          "Карти лояльності, бонуси та списання балів"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/services/base"
      }
    ]
  },
  credits: {
    slug: "credits",
    label: "Фінансовий блок",
    title: "Кредити",
    subtitle:
      "Умови розстрочки, кредитні продукти та скрипти консультації, які допомагають говорити про фінансування спокійно, прозоро й професійно.",
    sideLabel: "Тон комунікації",
    sideText:
      "Презентуємо користь і зручність платежу, але завжди лишаємося чесними щодо умов, переплати та документів.",
    cards: [
      {
        id: "credits-privat24",
        title: "ПриватБанк",
        icon: "badge-percent",
        text: "Повний матеріал по «Оплаті частинами» та «Миттєвій розстрочці» ПриватБанку: різниця між сервісами, оформлення на POS-терміналі та повернення товару.",
        items: [
          "POS-кредитування і різниця між сервісами",
          "Покрокове оформлення на касі",
          "Повернення товару та скасування розстрочки"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/credits/privat24"
      },
      {
        id: "credits-monobank",
        title: "Monobank",
        icon: "messages-square",
        text: "Повний матеріал по «Покупці частинами» Monobank: подання заявки, статуси, історія звернень, підтвердження видачі товару та скасування покупки.",
        items: [
          "Умови для 3 платежів і довших термінів",
          "Статуси заявок і логіка підтвердження",
          "Історія, пошук і повернення товару"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/credits/monobank"
      },
      {
        id: "credits-ukrsib",
        title: "УКРСИББАНК",
        icon: "scale",
        text: "Повний гайд по оформленню кредитної заявки в УКРСИББАНК: підготовка документів, створення заявки, анкета клієнта, робота з адресами, доходами та фінальна відправка.",
        items: [
          "Підготовка клієнтських даних і товару",
          "Основна заявка, анкета та контактні дані",
          "Зайнятість, дохід і фінальна перевірка"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/credits/ukrsib"
      },
      {
        id: "credits-idea-bank",
        title: "Ідея Банк",
        icon: "sparkles",
        text: "Повний матеріал по короткій і повній заявці в Ідея Банк: попереднє рішення, перехід до повної анкети та покрокове оформлення без дублювання заявок.",
        items: [
          "Коротка заявка і усна згода клієнта",
          "Перехід до повної анкети",
          "Адреси, доходи, контактна особа та відправка"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/credits/idea-bank"
      },
      {
        id: "credits-sense-bank",
        title: "СЕНС Банк",
        icon: "shield-check",
        text: "Повний матеріал по оформленню кредиту в СЕНС Банку: створення заявки, фото клієнта, середня анкета, контактна інформація, доходи та відправлення в банк.",
        items: [
          "Створення нової заявки і блок товару",
          "Середня анкета та паспортні дані",
          "Робота, дохід і фінальна перевірка"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/credits/sense-bank"
      }
    ]
  },
  accessories: {
    slug: "accessories",
    label: "Супутні продажі",
    title: "Аксесуари",
    subtitle:
      "Розділ для швидких допродажів: сумісність, готові сценарії допродажу і зв’язки “пристрій + аксесуар + сервіс”, які піднімають середній чек без зайвого тиску на клієнта.",
    sideLabel: "Принцип роботи",
    sideText:
      "Відштовхуємося від сценарію використання, а не від випадкового аксесуара. Так рекомендація звучить природно і продає краще.",
    cards: [
      {
        id: "accessories-compatibility",
        title: "Чохли та MagSafe-кейси",
        icon: "shield-check",
        text: "Перший повний аксесуарний блок: офіційні Apple Case з MagSafe, логіка продажу Pitaka / Spigen / UAG та сценарії підбору під реальні потреби клієнта.",
        items: [
          "Офіційні Apple Case: Clear, Silicone, Leather, FineWoven, TechWoven",
          "Pitaka, Spigen, UAG: матеріали, серії та позиціонування",
          "MagSafe, догляд, сценарії рекомендації та чек-лист перед видачею"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/accessories/cases"
      },
      {
        id: "accessories-upsell",
        title: "Захисне скло",
        icon: "sparkles",
        text: "Повний блок по захисному склу: типи, покриття, privacy / matte / blue-light, наші лінійки та чесна логіка рекомендації під чохол і сценарій використання.",
        items: [
          "Що таке tempered glass, 9H, олеофобне покриття і full adhesive",
          "PineApple Titanium, Monblan, Ilera, NeuChatel",
          "Сумісність із чохлами, установка, FAQ і чек-лист перед видачею"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/accessories/glass"
      },
      {
        id: "accessories-bundles",
        title: "Живлення та кабелі",
        icon: "cable",
        text: "Повний блок по адаптерах живлення Apple та кабелях: підбір потужності для MacBook, fast charge, USB-C / MagSafe / Thunderbolt і готові сценарії швидкої консультації.",
        items: [
          "Адаптери 20W, 35W, 67W, 70W, 96W, 140W і логіка їх добору",
          "Fast charge для MacBook Pro та Air",
          "Кабелі MagSafe 3, USB-C, Thunderbolt 3 / 4 і таблиці швидкого підбору"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/accessories/power"
      },
      {
        id: "accessories-belkin",
        title: "Belkin",
        icon: "headphones",
        text: "Повний бренд-блок Belkin: BoostCharge, Connect, SoundForm, recall по BPD005 і вся базова логіка продажу зарядок, хабів, кабелів та аудіо.",
        items: [
          "MagSafe/Qi2-станції, магнітні павербанки, GaN-зарядки й автоадаптери",
          "Кабелі 240W, TB4-доки та компактні USB-C хаби",
          "SoundForm ANC-моделі та важливий recall для сервісної комунікації"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/accessories/belkin"
      },
      {
        id: "accessories-satechi",
        title: "Satechi",
        icon: "package-plus",
        text: "Повний бренд-блок Satechi: USB4/Thunderbolt рішення, фірмові Stand & Hub, потужні GaN-зарядки, Qi2 travel-аксесуари та периферія для Apple-style сетапів.",
        items: [
          "USB4 Multiport Adapter, Pro Hub серія, TB4 Multi Display Dock",
          "Stand & Hub для Mac mini та Monitor Stand Hub XL",
          "165W GaN Charger, Qi2 travel-зарядки, клавіатури й стенди"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/accessories/satechi"
      },
      {
        id: "accessories-apple-peripherals",
        title: "Apple периферія",
        icon: "sparkles",
        text: "Окремий блок по периферії Apple: Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse і Magic Trackpad як логічне доповнення до iPhone, iPad, Mac та розумного дому.",
        items: [
          "Apple TV і HomePod для домашнього медіа- та smart-home сценарію",
          "Apple Pencil, AirTag, Magic Mouse і Magic Trackpad",
          "Каталог поколінь, сумісність і логіка підбору під екосистему клієнта"
        ],
        imageUrl: "",
        imageAlt: "",
        href: "/accessories/apple-peripherals"
      }
    ]
  }
};

function cloneContent<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeCard(card: unknown, index: number, fallback: PortalPageCard): PortalPageCard {
  if (!isRecord(card)) {
    return fallback;
  }

  const iconValue = normalizeString(card.icon, fallback.icon);
  const icon = portalCardIconKeys.includes(iconValue as PortalCardIconKey)
    ? (iconValue as PortalCardIconKey)
    : fallback.icon;

  return {
    id: normalizeString(card.id, fallback.id || `card-${index + 1}`),
    title: normalizeString(card.title, fallback.title),
    icon,
    text: normalizeString(card.text, fallback.text),
    items: normalizeStringArray(card.items),
    imageUrl: normalizeString(card.imageUrl, fallback.imageUrl),
    imageAlt: normalizeString(card.imageAlt, fallback.imageAlt),
    href: normalizeString(card.href, fallback.href ?? "")
  };
}

export function isPortalPageSlug(value: string): value is PortalPageSlug {
  return portalPageSlugs.includes(value as PortalPageSlug);
}

export function getPortalPageSettingKey(slug: PortalPageSlug) {
  return `portal_page:${slug}`;
}

export function getDefaultPortalPageContent(slug: PortalPageSlug) {
  return cloneContent(DEFAULT_PORTAL_PAGES[slug]);
}

export function parsePortalPageContent(slug: PortalPageSlug, value: unknown): PortalPageContent {
  const fallback = getDefaultPortalPageContent(slug);

  if (!isRecord(value)) {
    return fallback;
  }

  const cards = Array.isArray(value.cards)
    ? value.cards.map((card, index) => normalizeCard(card, index, fallback.cards[index] ?? fallback.cards[0]))
    : fallback.cards;

  return {
    slug,
    label: normalizeString(value.label, fallback.label),
    title: normalizeString(value.title, fallback.title),
    subtitle: normalizeString(value.subtitle, fallback.subtitle),
    sideLabel: normalizeString(value.sideLabel, fallback.sideLabel),
    sideText: normalizeString(value.sideText, fallback.sideText),
    cards: cards.length > 0 ? cards : fallback.cards
  };
}
