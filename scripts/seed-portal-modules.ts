/**
 * Конвертує статті сервісу/аксесуарів/кредитів в реальні DB-модулі.
 * Після запуску всі ці теми проходять через ModuleViewer і мають можливість тестування.
 *
 * Запуск: node node_modules\.bin\tsx scripts\seed-portal-modules.ts
 */

import { PrismaClient } from "@prisma/client";
import { getServicePageContent } from "@/lib/service-pages";
import { getAccessoryPageContent } from "@/lib/accessory-pages";
import { getCreditPageContent } from "@/lib/credit-pages";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Seed Portal Modules ===\n");

  // ── 1. Бренд PineApple Academy ──────────────────────────────────────────
  let brand = await prisma.brand.findFirst({ where: { slug: "pineapple-academy" } });

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: "PineApple Academy",
        slug: "pineapple-academy",
        logoUrl: "/logos/apple.svg",
        description: "Внутрішні навчальні матеріали: сервіс, аксесуари та фінансові продукти для команди магазину.",
        sortOrder: 99
      }
    });
    console.log(`✓ Бренд створено: ${brand.name} (id: ${brand.id})`);
  } else {
    console.log(`→ Бренд існує: ${brand.name} (id: ${brand.id})`);
  }

  // ── 2. Категорії ─────────────────────────────────────────────────────────
  const categoryDefs = [
    { slug: "servis-ta-prodazh", name: "Сервіс та Продаж", description: "Trade-In, техніки продажу, гарантійні програми та база знань по сервісу.", sortOrder: 1 },
    { slug: "aksesuary", name: "Аксесуари", description: "Чохли, захисне скло, зарядка та супутня техніка — аргументи допродажів.", sortOrder: 2 },
    { slug: "kredyty-ta-finansy", name: "Кредити та Фінанси", description: "Розстрочка, кредитні програми партнерів, оформлення та робота з банками.", sortOrder: 3 }
  ];

  const categories: Record<string, { id: number }> = {};

  for (const def of categoryDefs) {
    let cat = await prisma.category.findFirst({
      where: { brandId: brand.id, slug: def.slug }
    });
    if (!cat) {
      cat = await prisma.category.create({
        data: { brandId: brand.id, ...def }
      });
      console.log(`  ✓ Категорія: ${cat.name}`);
    } else {
      console.log(`  → Категорія існує: ${cat.name}`);
    }
    categories[def.slug] = { id: cat.id };
  }

  // ── 3. Модулі ────────────────────────────────────────────────────────────
  type ModuleDef = {
    slug: string;
    title: string;
    description: string;
    durationMin: number;
    categorySlug: string;
    getContent: () => { sections: Array<{ title: string; html: string }> };
  };

  const moduleDefs: ModuleDef[] = [
    // === СЕРВІС ===
    {
      slug: "service-trade-in",
      title: "Trade-In",
      description: "Повний гайд по прийому техніки: оцінка вартості, перевірка стану, чек-листи по iPhone, iPad, MacBook і PlayStation.",
      durationMin: 35,
      categorySlug: "servis-ta-prodazh",
      getContent: () => getServicePageContent("trade-in")
    },
    {
      slug: "service-sale",
      title: "Техніки продажу",
      description: "Підготовка до продажу, SPIN-техніки, виявлення потреб, Apple-екосистема та сценарії з аксесуарами.",
      durationMin: 40,
      categorySlug: "servis-ta-prodazh",
      getContent: () => getServicePageContent("sale")
    },
    {
      slug: "service-warranty",
      title: "Умови гарантії",
      description: "Безпечний період, гарантія на розбиття та умови для iPhone, iPad, Apple Watch, MacBook, Dyson, PlayStation.",
      durationMin: 25,
      categorySlug: "servis-ta-prodazh",
      getContent: () => getServicePageContent("warranty")
    },
    {
      slug: "service-base",
      title: "База знань сервісу",
      description: "Прийом і виконання ремонтів, відкладені чеки, залишки, карти лояльності та бонусна система.",
      durationMin: 30,
      categorySlug: "servis-ta-prodazh",
      getContent: () => getServicePageContent("base")
    },

    // === АКСЕСУАРИ ===
    {
      slug: "accessory-cases",
      title: "Чохли та MagSafe",
      description: "Apple Case, Pitaka, Spigen, UAG — позиціонування, матеріали, MagSafe і сценарії підбору під клієнта.",
      durationMin: 25,
      categorySlug: "aksesuary",
      getContent: () => getAccessoryPageContent("cases")
    },
    {
      slug: "accessory-glass",
      title: "Захисне скло",
      description: "Типи скла, покриття, privacy/matte/blue-light, наші лінійки та логіка рекомендації під сценарій клієнта.",
      durationMin: 20,
      categorySlug: "aksesuary",
      getContent: () => getAccessoryPageContent("glass")
    },
    {
      slug: "accessory-power",
      title: "Зарядні пристрої та Power Bank",
      description: "Стандарти зарядки, MagSafe, бездротові зарядки та підбір powerbank під потреби клієнта.",
      durationMin: 20,
      categorySlug: "aksesuary",
      getContent: () => getAccessoryPageContent("power")
    },
    {
      slug: "accessory-belkin",
      title: "Belkin",
      description: "Кабелі, зарядки, MagSafe аксесуари та позиціонування Belkin у лінійці допродажів.",
      durationMin: 15,
      categorySlug: "aksesuary",
      getContent: () => getAccessoryPageContent("belkin")
    },
    {
      slug: "accessory-satechi",
      title: "Satechi",
      description: "Хаби, підставки, зарядні станції — аргументи продажу Satechi для Mac-користувачів.",
      durationMin: 15,
      categorySlug: "aksesuary",
      getContent: () => getAccessoryPageContent("satechi")
    },
    {
      slug: "accessory-apple-peripherals",
      title: "Apple Peripherals",
      description: "AirTag, Apple Pencil, Magic Keyboard, Magic Mouse та логіка допродажів до основних пристроїв.",
      durationMin: 20,
      categorySlug: "aksesuary",
      getContent: () => getAccessoryPageContent("apple-peripherals")
    },

    // === КРЕДИТИ ===
    {
      slug: "credit-privat24",
      title: "ПриватБанк — розстрочка",
      description: "«Оплата частинами» і «Миттєва розстрочка» — різниця, оформлення на POS-терміналі та повернення.",
      durationMin: 20,
      categorySlug: "kredyty-ta-finansy",
      getContent: () => getCreditPageContent("privat24")
    },
    {
      slug: "credit-monobank",
      title: "Monobank — «Покупка частинами»",
      description: "Подання заявки, статуси, підтвердження видачі, скасування та робота з повернення.",
      durationMin: 20,
      categorySlug: "kredyty-ta-finansy",
      getContent: () => getCreditPageContent("monobank")
    },
    {
      slug: "credit-ukrsib",
      title: "УКРСИББАНК",
      description: "Підготовка документів, анкета клієнта, адреси, доходи та відправка кредитної заявки.",
      durationMin: 25,
      categorySlug: "kredyty-ta-finansy",
      getContent: () => getCreditPageContent("ukrsib")
    },
    {
      slug: "credit-idea-bank",
      title: "Ідея Банк",
      description: "Коротка і повна заявка, попереднє рішення та покроковий перехід до повної анкети.",
      durationMin: 20,
      categorySlug: "kredyty-ta-finansy",
      getContent: () => getCreditPageContent("idea-bank")
    },
    {
      slug: "credit-sense-bank",
      title: "СЕНС Банк",
      description: "Нова заявка, фото клієнта, паспортні дані, дохід і фінальна відправка в банк.",
      durationMin: 20,
      categorySlug: "kredyty-ta-finansy",
      getContent: () => getCreditPageContent("sense-bank")
    }
  ];

  const mapping: Record<string, number> = {};

  for (const def of moduleDefs) {
    const categoryId = categories[def.categorySlug]!.id;

    // Перевіряємо чи модуль вже є
    let existing = await prisma.module.findFirst({
      where: { categoryId, title: def.title }
    });

    if (existing) {
      console.log(`  → Модуль існує: ${def.title} (id: ${existing.id})`);
      mapping[def.slug] = existing.id;
      continue;
    }

    // Отримуємо контент і конвертуємо в content blocks
    const pageContent = def.getContent();
    const contentBlocks = pageContent.sections.map((section) => ({
      type: "text" as const,
      title: section.title,
      html: section.html
    }));

    const module = await prisma.module.create({
      data: {
        categoryId,
        title: def.title,
        description: def.description,
        durationMin: def.durationMin,
        contentBlocks: contentBlocks as never,
        sortOrder: moduleDefs.indexOf(def),
        isPublished: true
      }
    });

    console.log(`  ✓ Модуль: ${module.title} (id: ${module.id})`);
    mapping[def.slug] = module.id;
  }

  // ── 4. Зберігаємо маппінг в AppSetting ──────────────────────────────────
  await prisma.appSetting.upsert({
    where: { key: "portal_module_mapping" },
    create: { key: "portal_module_mapping", value: mapping as never },
    update: { value: mapping as never }
  });

  console.log("\n✓ Маппінг збережено в AppSetting (portal_module_mapping)");
  console.log("\nМаппінг slug → moduleId:");
  Object.entries(mapping).forEach(([slug, id]) => {
    console.log(`  ${slug}: ${id}`);
  });

  console.log("\n=== Готово! ===");
  console.log("Тепер відкрийте /brands/pineapple-academy щоб побачити нові модулі.");
  console.log("Адміністратор може додавати тести через /admin/modules/[id]");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
