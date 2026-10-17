import { PrismaClient, QuestionType } from "@prisma/client";
import smegKettlesContent from "../lib/content/smeg-kettles";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { smegKettlesCatalogBlocks, smegKettlesFoundationBlocks } = smegKettlesContent;

function smegKettlesFoundationQuestions() {
  return [
    {
      question: "Яке питання найважливіше на старті консультації по чайниках Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Чи подобається клієнту сама коробка",
        "Чи потрібне просто кип'ятіння води або температурні режими з підтримкою тепла",
        "Який у клієнта пароль від телефону",
        "Чи хоче клієнт одразу пилосос"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що з наведеного важливо уточнити перед рекомендацією?",
      type: QuestionType.MULTIPLE,
      options: [
        "Чи потрібні температурні режими",
        "Чи важливий колір під інтер'єр",
        "Чи готують напої, де важлива не кипляча вода",
        "Який серіал зараз дивиться клієнт"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "Яка модель у лінійці відповідає за сценарій з терморегуляцією?",
      type: QuestionType.SINGLE,
      options: ["KLF03", "KLF04", "DCF02", "ECF02"],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "True/False: У Smeg колір чайника часто є повноцінним аргументом продажу.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка логіка консультації по Smeg-чайниках є правильною?",
      type: QuestionType.SINGLE,
      options: [
        "Рекомендувати лише дорожчу модель без уточнень",
        "Визначити сценарій використання, потім підібрати модель і тільки після цього колір",
        "Починати й завершувати консультацію лише кольором",
        "Не пояснювати різницю між KLF03 і KLF04"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function smegKettlesCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі має температурні режими 50-100°C?",
      type: QuestionType.SINGLE,
      options: ["KLF03", "KLF04", "DCF02", "ECF02"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель позиціонується як класичний чайник без терморегуляції?",
      type: QuestionType.SINGLE,
      options: ["KLF04", "KLF03", "GoPro MAX", "Smeg DCF02"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть сильні сторони KLF03.",
      type: QuestionType.MULTIPLE,
      options: [
        "Потужність 2400 Вт",
        "Захист від сухого ходу",
        "Температурні режими 50-100°C",
        "База 360°"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 3
    },
    {
      question: "Яка модель більше підійде клієнту, який хоче підтримання тепла після нагріву?",
      type: QuestionType.SINGLE,
      options: ["KLF03", "KLF04", "Обидві однаково", "Жодна"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є логічним апсейлом для Smeg-чайників?",
      type: QuestionType.SINGLE,
      options: [
        "Інша техніка Smeg у тому ж кольорі або стилі",
        "Media Mod",
        "Карта microSD",
        "VR-контролер"
      ],
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
  questions: ReturnType<typeof smegKettlesFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "kettles",
      brand: { slug: "smeg" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Smeg / kettles не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Smeg: чайники, сценарії та логіка консультації",
      description:
        "Практичний модуль по чайниках Smeg: як розвести класичний сценарій і сценарій з терморегуляцією, які питання ставити та як продавати через дизайн.",
      contentBlocks: smegKettlesFoundationBlocks,
      durationMin: 22,
      sortOrder: 1,
      questions: smegKettlesFoundationQuestions()
    },
    {
      title: "Smeg KLF03 та KLF04: моделі, кольори й аргументи продажу",
      description:
        "Каталог чайників Smeg з ключовими відмінностями між KLF03 і KLF04, кольоровими варіантами та короткою логікою рекомендації під запит клієнта.",
      contentBlocks: smegKettlesCatalogBlocks,
      durationMin: 29,
      sortOrder: 2,
      questions: smegKettlesCatalogQuestions()
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

  console.log("Smeg kettles content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
