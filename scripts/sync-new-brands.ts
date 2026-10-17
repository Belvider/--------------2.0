import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

const brandsToSync = [
  {
    name: "Harman",
    slug: "harman",
    logoUrl: "/logos/harman.svg",
    description: "Преміальне аудіо для дому, подорожей і сучасного lifestyle-сегмента.",
    categories: [
      {
        name: "Портативна акустика",
        slug: "portable-audio",
        description: "Компактні аудіорішення, автономність, захист та сценарії продажу.",
        sortOrder: 1
      },
      {
        name: "Домашня акустика",
        slug: "home-audio",
        description: "Колонки для дому, мультирум, дизайн і позиціонування.",
        sortOrder: 2
      },
      {
        name: "Саундбари",
        slug: "soundbars",
        description: "Покращення домашнього кінотеатру, підключення і апсейл.",
        sortOrder: 3
      }
    ]
  },
  {
    name: "Whoop",
    slug: "whoop",
    logoUrl: "/logos/whoop.svg",
    description: "Платформа для відстеження відновлення, навантаження і якості сну.",
    categories: [
      {
        name: "Фітнес-трекери",
        slug: "fitness-trackers",
        description: "Whoop Strap, сенсори, сценарії використання та робота з запереченнями.",
        sortOrder: 1
      },
      {
        name: "Аналітика та відновлення",
        slug: "recovery-analytics",
        description: "Recovery, Strain, Sleep Coach та цінність підписки.",
        sortOrder: 2
      }
    ]
  },
  {
    name: "Портативні станції",
    slug: "portable-power",
    logoUrl: "/logos/portable-power.svg",
    description: "Резервне живлення для дому, подорожей, кемпінгу та професійного використання.",
    categories: [
      {
        name: "Зарядні станції",
        slug: "power-stations",
        description: "Ємність, потужність, сценарії резервного живлення та підбір під техніку.",
        sortOrder: 1
      },
      {
        name: "Сонячні панелі",
        slug: "solar-panels",
        description: "Підзарядка станцій у польових умовах та додаткові сценарії використання.",
        sortOrder: 2
      },
      {
        name: "Аксесуари живлення",
        slug: "power-accessories",
        description: "Кабелі, адаптери, чохли та супутні рішення для апсейлу.",
        sortOrder: 3
      }
    ]
  }
] as const;

function moduleContent(title: string, categoryName: string) {
  return [
    {
      type: "video",
      title: `Відео-огляд: ${categoryName}`,
      provider: "youtube",
      url: "https://www.youtube.com/embed/1La4QzGeaaQ"
    },
    {
      type: "text",
      title: "Що має знати продавець",
      html: `<h3>Ключові тези</h3><ul><li>Визначайте потребу клієнта через 3 уточнювальні питання.</li><li>Пояснюйте вигоди простою мовою.</li><li>Додавайте релевантний аксесуар або сервіс.</li></ul><p>Модуль <strong>${title}</strong> допоможе впевнено презентувати товар.</p>`
    },
    {
      type: "image",
      title: "Візуальні акценти",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      caption: "Приклад викладки товарів у торговому залі"
    },
    {
      type: "facts",
      title: "Важливо знати",
      items: [
        "Починайте консультацію з уточнення сценарію використання.",
        "Порівнюйте не лише характеристики, а й кінцеву цінність для клієнта.",
        "Фіксуйте сумісні аксесуари у чеку для збільшення середнього кошика."
      ]
    },
    {
      type: "pdf",
      title: "Швидкий конспект",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ];
}

function moduleQuestions(categoryName: string) {
  return [
    {
      question: `Що є найкращим першим кроком під час консультації у категорії «${categoryName}»?`,
      type: QuestionType.SINGLE,
      options: [
        "Відразу запропонувати найдорожчу модель",
        "Поставити уточнювальні питання про потреби",
        "Показати тільки акційні товари",
        "Уникати порівняння моделей"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "True/False: Апсейл аксесуарів підвищує цінність покупки для клієнта.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 2
    },
    {
      question: "Оберіть валідні техніки презентації продукту:",
      type: QuestionType.MULTIPLE,
      options: [
        "Пояснювати вигоди через сценарії використання",
        "Ігнорувати заперечення клієнта",
        "Порівнювати 2-3 релевантні моделі",
        "Говорити лише про знижку"
      ],
      correctAnswer: { indices: [0, 2] },
      sortOrder: 3
    },
    {
      question: "Яка ціль блоку «Важливо знати» у навчальному модулі?",
      type: QuestionType.SINGLE,
      options: [
        "Дати юридичну консультацію",
        "Закріпити ключові акценти для практики продажів",
        "Замінити весь навчальний контент",
        "Виключно рекламувати бренд"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що варто зробити після успішної презентації товару?",
      type: QuestionType.SINGLE,
      options: [
        "Завершити діалог без пропозицій",
        "Запропонувати сумісний аксесуар або сервіс",
        "Скасувати гарантійні опції",
        "Уникати уточнення бюджету"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

async function upsertModule(categoryId: number, title: string, description: string, categoryName: string, sortOrder: number, durationMin: number) {
  const existing = await prisma.module.findFirst({
    where: {
      categoryId,
      title
    },
    select: { id: true }
  });

  const updateData = {
    description,
    contentBlocks: moduleContent(title, categoryName),
    durationMin,
    sortOrder,
    isPublished: true,
    questions: {
      deleteMany: {},
      create: moduleQuestions(categoryName)
    }
  };

  if (existing) {
    await prisma.module.update({
      where: { id: existing.id },
      data: updateData
    });
    return;
  }

  await prisma.module.create({
    data: {
      categoryId,
      title,
      description,
      contentBlocks: moduleContent(title, categoryName),
      durationMin,
      sortOrder,
      isPublished: true,
      questions: {
        create: moduleQuestions(categoryName)
      }
    }
  });
}

async function main() {
  const maxSortOrder = await prisma.brand.aggregate({
    _max: {
      sortOrder: true
    }
  });

  const baseSortOrder = (maxSortOrder._max.sortOrder ?? 0) + 1;

  for (const [brandIndex, brand] of brandsToSync.entries()) {
    const savedBrand = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        logoUrl: brand.logoUrl,
        description: brand.description,
        sortOrder: baseSortOrder + brandIndex
      },
      create: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        description: brand.description,
        sortOrder: baseSortOrder + brandIndex
      }
    });

    for (const category of brand.categories) {
      const savedCategory = await prisma.category.upsert({
        where: {
          brandId_slug: {
            brandId: savedBrand.id,
            slug: category.slug
          }
        },
        update: {
          name: category.name,
          description: category.description,
          sortOrder: category.sortOrder
        },
        create: {
          brandId: savedBrand.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder
        }
      });

      const baseTitle = `${savedBrand.name} ${savedCategory.name}`;

      await upsertModule(
        savedCategory.id,
        `${baseTitle}: Базові знання`,
        "Огляд лінійки, ключові характеристики, позиціонування і робота із запереченнями.",
        savedCategory.name,
        1,
        18
      );

      await upsertModule(
        savedCategory.id,
        `${baseTitle}: Скрипти продажу`,
        "Практичні сценарії консультації, апсейл аксесуарів і сервісних продуктів.",
        savedCategory.name,
        2,
        24
      );
    }
  }

  console.log("New brands synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
