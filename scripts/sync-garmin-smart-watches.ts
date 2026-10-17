import { PrismaClient, QuestionType } from "@prisma/client";
import garminSmartWatchesContent from "../lib/content/garmin-smart-watches";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { garminSmartWatchesCatalogBlocks, garminSmartWatchesFoundationBlocks } = garminSmartWatchesContent;

function garminSmartWatchesFoundationQuestions() {
  return [
    {
      question: "Яка серія Garmin найкраще підходить клієнту, для якого головний сценарій — біг і триатлон?",
      type: QuestionType.SINGLE,
      options: ["Fenix", "Forerunner", "Approach", "Descent"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть спеціалізовані серії Garmin, які прив'язані до конкретного виду активності або професії.",
      type: QuestionType.MULTIPLE,
      options: ["Approach", "Descent", "MARQ", "Forerunner", "Instinct"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: Instinct продається через rugged-захист, outdoor-сценарії та tactical-версії, а не як lifestyle-лінійка з акцентом на AMOLED.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка лінійка Garmin найкраще відповідає сценарію щоденного використання, здоров'я та стильного AMOLED-досвіду без жорсткого outdoor-акценту?",
      type: QuestionType.SINGLE,
      options: ["Enduro", "Vivoactive / Venu", "Tactix", "Descent"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "З чого найкраще починати консультацію по Garmin?",
      type: QuestionType.SINGLE,
      options: [
        "З демонстрації найдорожчої моделі",
        "З уточнення головного сценарію: біг, outdoor, здоров'я, гольф, дайвінг або tactical",
        "З порівняння тільки кольорів корпусу",
        "З вибору ремінця до годинника"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function garminSmartWatchesCatalogQuestions() {
  return [
    {
      question: "Яка серія Garmin створена саме для гольфу?",
      type: QuestionType.SINGLE,
      options: ["Approach", "Instinct", "Enduro", "Epix"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Оберіть серії Garmin, які найчастіше рекомендують для outdoor, експедицій і жорстких умов.",
      type: QuestionType.MULTIPLE,
      options: ["Fenix", "Enduro", "Instinct", "Tactix", "Venu"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Epix — це преміальна AMOLED-альтернатива Fenix для клієнта, якому важливий більш яскравий дисплей.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка серія Garmin є найбільш спеціалізованою під дайвінг?",
      type: QuestionType.SINGLE,
      options: ["Forerunner", "Approach", "Descent", "MARQ Driver"],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Яка серія Garmin найкраще відповідає запиту на люксовий дизайн, преміальні матеріали та вузьку спеціалізацію під стиль життя або професію?",
      type: QuestionType.SINGLE,
      options: ["MARQ", "Instinct", "Forerunner 55", "Approach S12"],
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
  questions: ReturnType<typeof garminSmartWatchesFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "smart-watches",
      brand: { slug: "garmin" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Garmin / smart-watches не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Garmin Смарт-годинники: серії, позиціонування та логіка підбору",
      description:
        "Внутрішній конспект по Garmin: бренд, ключові серії, сценарії використання та швидка логіка рекомендації під спорт, outdoor, здоров'я, гольф і дайвінг.",
      contentBlocks: garminSmartWatchesFoundationBlocks,
      durationMin: 28,
      sortOrder: 1,
      questions: garminSmartWatchesFoundationQuestions()
    },
    {
      title: "Garmin Смарт-годинники: Fenix, Epix, Forerunner, Instinct, MARQ та інші серії",
      description:
        "Каталог серій Garmin з ключовими відмінностями, позиціонуванням і швидким маршрутом підбору під запит клієнта.",
      contentBlocks: garminSmartWatchesCatalogBlocks,
      durationMin: 37,
      sortOrder: 2,
      questions: garminSmartWatchesCatalogQuestions()
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

  console.log("Garmin smart watches content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
