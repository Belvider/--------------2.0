import { PrismaClient, QuestionType } from "@prisma/client";
import applePeripheralsContent from "../lib/content/apple-peripherals";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { applePeripheralsCatalogBlocks, applePeripheralsFoundationBlocks } = applePeripheralsContent;

function applePeripheralsFoundationQuestions() {
  return [
    {
      question: "Що найкраще описує роль категорії Apple Периферія у консультації?",
      type: QuestionType.SINGLE,
      options: [
        "Це окрема лінійка смартфонів Apple",
        "Це категорія доповнень до вже наявної техніки Apple: TV, iPad, Mac, iPhone та розумного дому",
        "Це лише розділ з кабелями",
        "Це тільки аксесуари без прив'язки до екосистеми"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які сімейства прямо входять до модуля по Apple Периферії?",
      type: QuestionType.MULTIPLE,
      options: [
        "Apple TV",
        "HomePod",
        "Apple Pencil",
        "AirTag",
        "Magic Mouse та Magic Trackpad"
      ],
      correctAnswer: { indices: [0, 1, 2, 3, 4] },
      sortOrder: 2
    },
    {
      question: "True/False: Apple Pencil треба підбирати насамперед за сумісністю з конкретною моделлю iPad.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Який продукт із цього модуля найкраще позиціонується як трекер для ключів, сумок і багажу через Find My?",
      type: QuestionType.SINGLE,
      options: ["Apple TV", "AirTag", "HomePod mini", "Magic Mouse"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що найсильніше допомагає продавати периферію Apple?",
      type: QuestionType.SINGLE,
      options: [
        "Говорити лише про кількість гігабайтів",
        "Прив'язувати аксесуар до вже наявного сценарію використання клієнта в екосистемі Apple",
        "Уникати згадки про сумісність",
        "Продавати периферію лише разом з iPhone"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function applePeripheralsCatalogQuestions() {
  return [
    {
      question: "Яка модель Apple TV у вашому каталозі має чип A15 Bionic?",
      type: QuestionType.SINGLE,
      options: [
        "Apple TV HD",
        "Apple TV 4K (1-го покоління, 2017)",
        "Apple TV 4K (2-го покоління, 2021)",
        "Apple TV 4K (3-го покоління, 2022)"
      ],
      correctAnswer: { index: 3 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі Apple Pencil із каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "Apple Pencil (1-го покоління)",
        "Apple Pencil (2-го покоління)",
        "Apple Pencil (USB-C)",
        "Apple Pencil Pro",
        "Siri Remote"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: HomePod mini у вашому матеріалі базується на Apple S5.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Який пристрій у каталозі найкраще відповідає сценарію Multi-Touch жестів і Force Touch для Mac?",
      type: QuestionType.SINGLE,
      options: ["AirTag", "Magic Trackpad", "Apple TV 4K", "HomePod"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка лінійка в каталозі позиціонується як фірмова миша Apple з Multi-Touch поверхнею?",
      type: QuestionType.SINGLE,
      options: ["Magic Mouse", "Apple Pencil", "HomePod", "AirTag"],
      correctAnswer: { index: 0 },
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
  questions: ReturnType<typeof applePeripheralsFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "peripherals",
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
    throw new Error("Категорію Периферія не знайдено. Спочатку має існувати Apple / peripherals.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Apple Периферія: Apple TV, HomePod, Pencil, AirTag та аксесуари",
      description: "Внутрішній конспект по Apple периферії: Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse і Magic Trackpad у сценаріях екосистеми Apple.",
      contentBlocks: applePeripheralsFoundationBlocks,
      durationMin: 27,
      sortOrder: 1,
      questions: applePeripheralsFoundationQuestions()
    },
    {
      title: "Apple Периферія: моделі Apple TV, HomePod, Pencil, AirTag, Magic Mouse та Trackpad",
      description: "Каталог моделей Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse і Magic Trackpad з ключовими характеристиками та позиціонуванням.",
      contentBlocks: applePeripheralsCatalogBlocks,
      durationMin: 39,
      sortOrder: 2,
      questions: applePeripheralsCatalogQuestions()
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

  console.log("Apple peripherals content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
