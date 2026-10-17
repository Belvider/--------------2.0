import { PrismaClient, QuestionType } from "@prisma/client";
import camerasGoProContent from "../lib/content/cameras-go-pro";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { goProCatalogBlocks, goProFoundationBlocks } = camerasGoProContent;

function goProFoundationQuestions() {
  return [
    {
      question: "У якому сценарії GoPro зазвичай буде кращою рекомендацією, ніж DJI Pocket?",
      type: QuestionType.SINGLE,
      options: [
        "Коли потрібен кишеньковий стедікам для спокійних проходок",
        "Коли камера буде кріпитись на шолом, кермо чи груди й працювати у спорті та воді",
        "Коли клієнту потрібен лише квадратний друк фото",
        "Коли головна вимога - змінна оптика"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що найкраще уточнити перед рекомендацією GoPro?",
      type: QuestionType.MULTIPLE,
      options: [
        "Сценарій зйомки: спорт, вода, тревел, влог",
        "Чи потрібні LOG, 8:7 або creator-комплект",
        "Якого кольору має бути кришка коробки",
        "Чи потрібне 360° або MAX-сценарій"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 2
    },
    {
      question: "Який аксесуар з вашого матеріалу найсильніше продається під довгі записи й creator-сценарій?",
      type: QuestionType.SINGLE,
      options: ["Volta", "Паперовий альбом", "Штатив для DSLR", "Спалах Speedlite"],
      correctAnswer: { index: 0 },
      sortOrder: 3
    },
    {
      question: "True/False: GoPro MAX варто рекомендувати, якщо клієнту потрібне 360° і свобода перекадровки.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка логіка правильна для консультації по GoPro?",
      type: QuestionType.SINGLE,
      options: [
        "Спершу тільки ціна, усе інше неважливо",
        "Спершу сценарій зйомки, потім формат контенту, аксесуари й потрібний рівень моделі",
        "Рекомендувати лише найновішу камеру без уточнень",
        "Усім клієнтам однаково підходить GoPro MAX"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function goProCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому матеріалі має 10-бітний LOG, Enduro 1900 мА·год і кращий запас по теплу?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 11 Black", "GoPro HERO 12 Black", "GoPro HERO 13 Black", "GoPro MAX"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Яка модель поєднує GoPro, 360°-камеру і влог-сценарій в одному корпусі?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 10 Black", "GoPro HERO 11 Mini", "GoPro MAX", "GoPro HERO 12 Creator Edition"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть комплекти Creator Edition з вашого каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "GoPro HERO 12 Black Creator Edition",
        "GoPro HERO 11 Black Creator Edition",
        "GoPro HERO 11 Mini",
        "GoPro HERO 9 Black"
      ],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 3
    },
    {
      question: "Яка модель у вашому матеріалі позиціонується як найкращий варіант для максимально компактного кріплення?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 13 Black", "GoPro HERO 11 Mini", "GoPro MAX", "GoPro HERO 9 Black"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка GoPro-модель принесла фронтальний екран і модульний підхід як доступніший вхід у систему?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 9 Black", "GoPro HERO 10 Black", "GoPro HERO 12 Black", "GoPro HERO 13 Black"],
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
  questions: ReturnType<typeof goProFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "go-pro",
      brand: { slug: "cameras" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Камери / go-pro не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "GoPro: лінійки, сценарії та логіка консультації",
      description:
        "Практичний модуль по GoPro: як швидко розвести Hero, Creator Edition і MAX, коли порівнювати з DJI та що допродавати в екшн-сценарії.",
      contentBlocks: goProFoundationBlocks,
      durationMin: 28,
      sortOrder: 1,
      questions: goProFoundationQuestions()
    },
    {
      title: "GoPro HERO, MAX, Creator Edition та аксесуари",
      description:
        "Каталог GoPro-моделей з позиціонуванням, ключовими відмінностями, creator-наборами, 360-сценарієм і швидкою логікою рекомендації.",
      contentBlocks: goProCatalogBlocks,
      durationMin: 41,
      sortOrder: 2,
      questions: goProCatalogQuestions()
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

  console.log("Cameras GoPro content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
