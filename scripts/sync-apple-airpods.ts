import { PrismaClient, QuestionType } from "@prisma/client";
import appleAirpodsContent from "../lib/content/apple-airpods";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { airpodsCatalogBlocks, airpodsFoundationBlocks } = appleAirpodsContent;

function airpodsFoundationQuestions() {
  return [
    {
      question: "Яка перевага найкраще описує роботу AirPods усередині екосистеми Apple?",
      type: QuestionType.SINGLE,
      options: [
        "Працюють лише з iPhone і не сумісні з Mac",
        "Автоматично перемикаються між пристроями Apple",
        "Працюють тільки через кабель",
        "Не підтримують Siri"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які функції прямо згадані у базовому модулі AirPods?",
      type: QuestionType.MULTIPLE,
      options: [
        "Спільне аудіо",
        "Просторове аудіо",
        "Автоматичне перемикання між пристроями",
        "Механічна клавіатура"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: AirPods Pro та AirPods 4 ANC позиціонуються як моделі для клієнтів, яким важливе шумозаглушення.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка лінійка найкраще відповідає повнорозмірному формату з Digital Crown і домашньо-офісному сценарію?",
      type: QuestionType.SINGLE,
      options: ["AirPods 2", "AirPods Pro", "AirPods Max", "EarPods"],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Коли EarPods мають найкраще позиціонування у консультації?",
      type: QuestionType.SINGLE,
      options: [
        "Коли клієнту потрібні лише ANC і просторове аудіо",
        "Коли важливі дротовий формат, стабільність і відсутність потреби заряджати навушники",
        "Коли потрібні силіконові амбушури та H2",
        "Коли клієнт обирає Apple Watch"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function airpodsCatalogQuestions() {
  return [
    {
      question: "Яка модель у каталозі поєднує відкритий формат і Active Noise Cancellation?",
      type: QuestionType.SINGLE,
      options: ["AirPods 2", "AirPods 3", "AirPods 4 ANC", "EarPods USB-C"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Яка модель має чип H2 у навушниках і чип U1 у зарядному кейсі?",
      type: QuestionType.SINGLE,
      options: ["AirPods 3", "AirPods Pro 2", "AirPods Max 2", "AirPods Pro 1"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть дротові моделі EarPods із каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "EarPods з 3,5 мм",
        "EarPods з Lightning",
        "EarPods з USB-C",
        "AirPods Max 2"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: AirPods Max 2 у вашому каталозі вже перейшли на USB-C.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка лінійка найкраще підходить клієнту, якому потрібні силіконові амбушури, ANC та глибша посадка?",
      type: QuestionType.SINGLE,
      options: ["AirPods", "AirPods Pro", "AirPods Max", "EarPods"],
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
  questions: ReturnType<typeof airpodsFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "airpods",
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
    throw new Error("Категорію AirPods не знайдено. Спочатку має існувати Apple / airpods.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Apple AirPods та EarPods: функції, екосистема та сценарії використання",
      description: "Внутрішній конспект по Apple AirPods та EarPods: ключові функції, позиціонування сімейств, екосистема Apple та сценарії консультації.",
      contentBlocks: airpodsFoundationBlocks,
      durationMin: 23,
      sortOrder: 1,
      questions: airpodsFoundationQuestions()
    },
    {
      title: "Apple AirPods та EarPods: моделі й технічні характеристики",
      description: "Каталог моделей AirPods, AirPods Pro, AirPods Max та EarPods з ключовими характеристиками, типами підключення і позиціонуванням.",
      contentBlocks: airpodsCatalogBlocks,
      durationMin: 36,
      sortOrder: 2,
      questions: airpodsCatalogQuestions()
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

  console.log("Apple AirPods content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
