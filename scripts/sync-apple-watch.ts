import { PrismaClient, QuestionType } from "@prisma/client";
import appleWatchContent from "../lib/content/apple-watch";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { appleWatchCatalogBlocks, appleWatchFoundationBlocks } = appleWatchContent;

function appleWatchFoundationQuestions() {
  return [
    {
      question: "Яка головна різниця між Apple Watch GPS і GPS + Cellular (LTE) у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "GPS-версія підтримує лише Android",
        "LTE-версія може працювати автономніше без iPhone поруч",
        "GPS-версія має сапфірове скло, а LTE — ні",
        "LTE-версія не підтримує дзвінки"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "True/False: Червоне кільце на Digital Crown є ознакою LTE-версії Apple Watch.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 2
    },
    {
      question: "Яка функція вперше з’явилася в Apple Watch Series 5 згідно з модулем?",
      type: QuestionType.SINGLE,
      options: ["ЕКГ", "Always-On Display", "Crash Detection", "Siri через супутник"],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "Оберіть коректні тези з розділу про регіональні відмінності Apple Watch.",
      type: QuestionType.MULTIPLE,
      options: [
        "ЕКГ доступна не в усіх країнах",
        "У США є обмеження щодо кисню в крові для частини нових моделей",
        "LTE Apple Watch повноцінно працює в Україні без обмежень",
        "Китайські моделі можуть мати інші локальні обмеження"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 4
    },
    {
      question: "Який варіант найкраще описує позиціонування Apple Watch Ultra?",
      type: QuestionType.SINGLE,
      options: [
        "Модель тільки для дитячого сегмента",
        "Найдоступніший варіант входу в екосистему",
        "Лінійка для спорту, outdoor і максимальної витривалості",
        "Годинник без health-функцій"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function appleWatchCatalogQuestions() {
  return [
    {
      question: "Яка лінійка Apple Watch найкраще підходить клієнту, якому потрібен доступніший вхід в екосистему Apple Watch?",
      type: QuestionType.SINGLE,
      options: ["Ultra", "SE", "Series 10", "Hermes Edition"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "У якій моделі з каталогу вперше окремо підкреслюється Always-On Display?",
      type: QuestionType.SINGLE,
      options: ["Series 3", "Series 4", "Series 5", "SE 2020"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть моделі Apple Watch Ultra з каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "Apple Watch Ultra (2022)",
        "Apple Watch Ultra 2 (2023/2024)",
        "Apple Watch Ultra 3 (2025)",
        "Apple Watch SE 2 (2022)"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: Apple Watch Ultra та Ultra 2 у вашому каталозі мають 49 мм титановий корпус.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка модель у каталозі є хорошим сучасним універсальним вибором завдяки S9, Double Tap і яскравішому екрану?",
      type: QuestionType.SINGLE,
      options: ["Series 7", "Series 9", "SE 2020", "Series 4"],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

type ModuleBlueprint = {
  title: string;
  description: string;
  contentBlocks: ModuleContentBlock[];
  durationMin: number;
  sortOrder: number;
  questions: ReturnType<typeof appleWatchFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "apple-watch",
      brand: { slug: "apple" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Apple Watch не знайдено. Спочатку має існувати Apple / apple-watch.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Apple Watch: GPS/LTE, здоров'я та регіональні особливості",
      description: "Внутрішній конспект по Apple Watch: GPS vs LTE, ключові функції здоров'я, дисплеї, регіональні відмінності та позиціонування.",
      contentBlocks: appleWatchFoundationBlocks,
      durationMin: 29,
      sortOrder: 1,
      questions: appleWatchFoundationQuestions()
    },
    {
      title: "Apple Watch: Series, SE та Ultra — моделі й технічні характеристики",
      description: "Каталог моделей Apple Watch Series, SE та Ultra з кольорами, конфігураціями та ключовими технічними характеристиками.",
      contentBlocks: appleWatchCatalogBlocks,
      durationMin: 41,
      sortOrder: 2,
      questions: appleWatchCatalogQuestions()
    }
  ];

  for (const blueprint of blueprints) {
    const existingByOrder = category.modules.find((module) => module.sortOrder === blueprint.sortOrder);

    if (existingByOrder) {
      await prisma.module.update({
        where: { id: existingByOrder.id },
        data: {
          title: blueprint.title,
          description: blueprint.description,
          contentBlocks: blueprint.contentBlocks,
          durationMin: blueprint.durationMin,
          sortOrder: blueprint.sortOrder,
          isPublished: true,
          questions: {
            deleteMany: {},
            create: blueprint.questions
          }
        }
      });

      continue;
    }

    await prisma.module.create({
      data: {
        categoryId: category.id,
        title: blueprint.title,
        description: blueprint.description,
        contentBlocks: blueprint.contentBlocks,
        durationMin: blueprint.durationMin,
        sortOrder: blueprint.sortOrder,
        isPublished: true,
        questions: {
          create: blueprint.questions
        }
      }
    });
  }

  console.log("Apple Watch content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
