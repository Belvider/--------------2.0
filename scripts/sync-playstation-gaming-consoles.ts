import { PrismaClient, QuestionType } from "@prisma/client";
import playstationGamingConsolesContent from "../lib/content/playstation-gaming-consoles";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { gamingConsolesCatalogBlocks, gamingConsolesFoundationBlocks } = playstationGamingConsolesContent;

function gamingConsolesFoundationQuestions() {
  return [
    {
      question: "Що найкраще з'ясувати на старті консультації по ігрових консолях?",
      type: QuestionType.SINGLE,
      options: [
        "Лише улюблений колір консолі",
        "Сценарій гри: дім, дорога, ексклюзиви, підписки, диск чи digital",
        "Тільки розмір коробки",
        "Чи потрібна тільки найдорожча модель"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка платформа у вашому матеріалі позиціонується як гібридна консоль для дому й подорожей?",
      type: QuestionType.SINGLE,
      options: ["PlayStation 5 Pro", "Xbox Series X", "Nintendo Switch", "PlayStation VR2"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть рішення, які підходять для portable PC-геймінгу.",
      type: QuestionType.MULTIPLE,
      options: ["Steam Deck", "Asus ROG Ally / Ally X", "Nintendo Switch Lite", "PlayStation VR2"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 3
    },
    {
      question: "True/False: PlayStation VR2 потребує PlayStation 5 і працює через кабельне USB-C підключення.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка екосистема у вашому матеріалі найсильніше продається через ексклюзиви Sony та DualSense?",
      type: QuestionType.SINGLE,
      options: ["Steam Deck", "Nintendo Switch", "PlayStation 5", "Xbox Series S"],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function gamingConsolesCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі має 2 ТБ SSD, PSSR і найсильнішу графіку в лінійці PlayStation?",
      type: QuestionType.SINGLE,
      options: ["PS5 Slim", "PS5 Pro", "Xbox Series X", "Steam Deck OLED"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка Xbox-консоль у вашому матеріалі має дисковод і флагманський 4K-сценарій?",
      type: QuestionType.SINGLE,
      options: ["Xbox Series S", "Xbox Series X", "Nintendo Switch OLED", "PS5 Digital Edition"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Яка портативна платформа у вашому каталозі працює на Windows 11 Home і підтримує Game Pass, Steam та Epic Games?",
      type: QuestionType.SINGLE,
      options: ["Steam Deck", "Nintendo Switch", "Asus ROG Ally / Ally X", "PlayStation VR2"],
      correctAnswer: { index: 2 },
      sortOrder: 3
    },
    {
      question: "Оберіть portable або hybrid-рішення з вашого каталогу.",
      type: QuestionType.MULTIPLE,
      options: ["Steam Deck", "Nintendo Switch family", "Asus ROG Ally / Ally X", "PlayStation 5 Slim", "Xbox Series X"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 4
    },
    {
      question: "Яка платформа найкраще відповідає запиту на Mario, Zelda, Animal Crossing і сімейний мультиплеєр?",
      type: QuestionType.SINGLE,
      options: ["Xbox Series S", "Nintendo Switch family", "Steam Deck", "PS5 Pro"],
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
  questions: ReturnType<typeof gamingConsolesFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "gaming-consoles",
      brand: { slug: "playstation" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію PlayStation / gaming-consoles не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Ігрові консолі: платформи, екосистеми та логіка консультації",
      description:
        "Внутрішній конспект по сучасних ігрових платформах: домашні консолі, портативні рішення, VR, ексклюзиви, підписки та сценарії підбору.",
      contentBlocks: gamingConsolesFoundationBlocks,
      durationMin: 29,
      sortOrder: 1,
      questions: gamingConsolesFoundationQuestions()
    },
    {
      title: "Ігрові консолі: PS5, Xbox, Steam Deck, Nintendo Switch та ROG Ally",
      description:
        "Каталог сучасних консолей і handheld-рішень з ключовими відмінностями, аксесуарами та короткою логікою рекомендації під запит клієнта.",
      contentBlocks: gamingConsolesCatalogBlocks,
      durationMin: 42,
      sortOrder: 2,
      questions: gamingConsolesCatalogQuestions()
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

  console.log("PlayStation gaming consoles content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
