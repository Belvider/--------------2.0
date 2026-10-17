import { PrismaClient, QuestionType } from "@prisma/client";
import smegCoffeeMachinesContent from "../lib/content/smeg-coffee-machines";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { smegCoffeeMachinesCatalogBlocks, smegCoffeeMachinesFoundationBlocks } = smegCoffeeMachinesContent;

function smegCoffeeMachinesFoundationQuestions() {
  return [
    {
      question: "Яке питання найкраще допомагає на старті консультації по кавоварках Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Який у клієнта улюблений колір коробки",
        "Яку каву він п'є найчастіше і чи потрібен еспресо-сценарій або кілька чашок одразу",
        "Чи хоче клієнт тільки найдорожчу модель",
        "Чи планує він купувати телевізор"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що правильніше описує різницю між ECF02 і DCF02?",
      type: QuestionType.SINGLE,
      options: [
        "ECF02 - крапельна, DCF02 - рожкова",
        "ECF02 - для еспресо і молочних напоїв, DCF02 - для кількох чашок фільтр-кави",
        "Обидві моделі працюють лише як чайники",
        "DCF02 не підтримує сценарій кількох чашок"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть важливі речі, які треба уточнити перед рекомендацією.",
      type: QuestionType.MULTIPLE,
      options: [
        "Який тип кави п'є клієнт",
        "Скільки людей будуть користуватись кавоваркою",
        "Чи важливий колір та інтер'єр",
        "Який у клієнта пароль від Wi-Fi"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: У Smeg колір і зовнішній вигляд часто є повноцінним аргументом продажу, а не другорядною деталлю.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Що варто робити перед обіцянкою конкретних термінів поставки під замовлення?",
      type: QuestionType.SINGLE,
      options: [
        "Пообіцяти будь-який термін одразу",
        "Звірити актуальну наявність у постачальника",
        "Орієнтуватись лише на стару пам'ять",
        "Не відповідати клієнту взагалі"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function smegCoffeeMachinesCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі є рожковою кавоваркою з тиском 15 бар?",
      type: QuestionType.SINGLE,
      options: ["Smeg DCF02", "Smeg ECF02", "Smeg KLF03", "Smeg TSF01"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель підходить для приготування до 10 чашок кави завдяки резервуару 1.4 л?",
      type: QuestionType.SINGLE,
      options: ["Smeg ECF02", "Smeg DCF02", "GoPro HERO 13", "Canon EOS 5D Mark III"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть сильні сторони Smeg DCF02.",
      type: QuestionType.MULTIPLE,
      options: [
        "Таймер запуску",
        "Підтримка тепла",
        "Дві порції еспресо одночасно",
        "Кілька чашок кави за один цикл"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 3
    },
    {
      question: "Яка модель більше підійде клієнту, який хоче домашній еспресо-куточок і молочні напої?",
      type: QuestionType.SINGLE,
      options: ["Smeg DCF02", "Smeg ECF02", "Будь-яка крапельна модель", "Жодна з моделей"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є коректним апсейлом для категорії Smeg-кавоварок?",
      type: QuestionType.SINGLE,
      options: [
        "Засоби для догляду й декальцинації",
        "Модуль HyperSmooth",
        "VR-гарнітура",
        "Стілус для планшета"
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
  questions: ReturnType<typeof smegCoffeeMachinesFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "coffee-machines",
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
    throw new Error("Категорію Smeg / coffee-machines не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Smeg: кавомашини, сценарії та логіка консультації",
      description:
        "Практичний модуль по кавомашинах Smeg: як розвести еспресо- й крапельний сценарій, які питання ставити клієнту та на чому будувати рекомендацію.",
      contentBlocks: smegCoffeeMachinesFoundationBlocks,
      durationMin: 24,
      sortOrder: 1,
      questions: smegCoffeeMachinesFoundationQuestions()
    },
    {
      title: "Smeg ECF02 та DCF02: моделі, кольори й аргументи продажу",
      description:
        "Каталог кавоварок Smeg з ключовими відмінностями між рожковою та крапельною моделлю, кольоровими варіантами й короткою логікою підбору.",
      contentBlocks: smegCoffeeMachinesCatalogBlocks,
      durationMin: 31,
      sortOrder: 2,
      questions: smegCoffeeMachinesCatalogQuestions()
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

  console.log("Smeg coffee machines content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
