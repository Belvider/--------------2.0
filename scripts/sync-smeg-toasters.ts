import { PrismaClient, QuestionType } from "@prisma/client";
import smegToastersContent from "../lib/content/smeg-toasters";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { smegToastersCatalogBlocks, smegToastersFoundationBlocks } = smegToastersContent;

function smegToastersFoundationQuestions() {
  return [
    {
      question: "Яке питання найкраще допомагає на старті консультації по тостерах Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Який серіал зараз дивиться клієнт",
        "Скільки тостів клієнт готує за один раз і чи потрібен більший формат",
        "Чи хоче клієнт одразу пральну машину",
        "Який у клієнта улюблений пароль"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що з наведеного важливо уточнити перед рекомендацією тостера?",
      type: QuestionType.MULTIPLE,
      options: [
        "Кількість скибок за один раз",
        "Чи важливий колір під інтер'єр",
        "Чи потрібні режими розморожування та підігріву",
        "Який у клієнта мобільний оператор"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: Для тостерів Smeg дизайн і колір часто є повноцінним аргументом продажу.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Що спільного для обох моделей у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "6 рівнів підсмажування та режими підігріву/розморожування/bagel",
        "Температурні режими 50-100°C",
        "Паровий режим",
        "Вбудований кавомолочний блок"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Яка логіка консультації по Smeg-тостерах є правильною?",
      type: QuestionType.SINGLE,
      options: [
        "Рекомендувати будь-яку модель без уточнень",
        "Спершу зрозуміти сценарій, потім формат тостера, після цього вже колір",
        "Починати і завершувати лише кольором",
        "Не згадувати про режими і догляд"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function smegToastersCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі позиціонується як варіант на 4 скибки / 2 довгі щілини?",
      type: QuestionType.SINGLE,
      options: ["TSF03", "TSF02", "KLF04", "ECF02"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель у вашому матеріалі описується як компактніший сценарій на 1-2 людини?",
      type: QuestionType.SINGLE,
      options: ["TSF02", "TSF03", "KLF03", "DCF02"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть функції, які згадані для лінійки тостерів Smeg.",
      type: QuestionType.MULTIPLE,
      options: [
        "Підігрів",
        "Розморожування",
        "Bagel",
        "HyperSmooth"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "Яка модель більше підійде для сім'ї або активного сніданкового сценарію?",
      type: QuestionType.SINGLE,
      options: ["TSF03", "TSF02", "Обидві однаково", "Жодна"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є логічним апсейлом для тостерів Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Інша техніка Smeg у тому ж кольорі або стилі",
        "Media Mod",
        "Карта microSD",
        "VR-шолом"
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
  questions: ReturnType<typeof smegToastersFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "toasters",
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
    throw new Error("Категорію Smeg / toasters не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Smeg: тостери, сценарії та логіка консультації",
      description:
        "Практичний модуль по тостерах Smeg: як визначати потрібний формат, які питання ставити клієнту та як продавати через дизайн і побутовий комфорт.",
      contentBlocks: smegToastersFoundationBlocks,
      durationMin: 21,
      sortOrder: 1,
      questions: smegToastersFoundationQuestions()
    },
    {
      title: "Smeg TSF02 та TSF03: моделі, кольори й аргументи продажу",
      description:
        "Каталог тостерів Smeg з ключовими відмінностями між TSF02 і TSF03, кольоровими варіантами та короткою логікою рекомендації.",
      contentBlocks: smegToastersCatalogBlocks,
      durationMin: 27,
      sortOrder: 2,
      questions: smegToastersCatalogQuestions()
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

  console.log("Smeg toasters content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
