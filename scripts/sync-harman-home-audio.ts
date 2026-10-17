import { PrismaClient, QuestionType } from "@prisma/client";
import harmanHomeAudioContent from "../lib/content/harman-home-audio";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { harmanHomeAudioCatalogBlocks, harmanHomeAudioFoundationBlocks } = harmanHomeAudioContent;

function harmanHomeAudioFoundationQuestions() {
  return [
    {
      question: "Яке перше питання найкраще поставити клієнту під час консультації по Harman Kardon?",
      type: QuestionType.SINGLE,
      options: [
        "Який колір коробки подобається більше",
        "Де стоятиме колонка, чи треба її переносити і чи потрібні smart / Wi-Fi функції",
        "Чи хоче клієнт одразу найдорожчу модель",
        "Чи потрібен лише логотип бренду"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть лінійки або серії Harman Kardon, які у вашому матеріалі відносяться до portable-сценарію.",
      type: QuestionType.MULTIPLE,
      options: ["Onyx", "Go + Play", "Luna", "Citation 200", "Radiance 2400"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Citation у вашому матеріалі позиціонується як smart / Wi-Fi / multiroom-лінійка.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще відповідає сценарію 'дизайнерська 360° колонка з підсвіткою для атмосфери'?",
      type: QuestionType.SINGLE,
      options: ["Aura Studio", "Luna", "Citation Oasis", "Onyx Studio 7"],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що найкраще відрізняє Harman Kardon у продажі від більш утилітарних колонок?",
      type: QuestionType.SINGLE,
      options: [
        "Поєднання теплого фірмового звучання, дизайну і сценарності",
        "Повна відсутність дизайну",
        "Лише захист від води",
        "Тільки найнижча ціна"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function harmanHomeAudioCatalogQuestions() {
  return [
    {
      question: "Яка модель Harman Kardon у вашому матеріалі є культовою 2.1-системою з окремим сабвуфером?",
      type: QuestionType.SINGLE,
      options: ["Aura Studio 4", "SoundSticks 4", "Onyx Studio 9", "Citation 100"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі Harman Kardon, для яких у вашому матеріалі прямо згадано Wi-Fi / multiroom сценарій.",
      type: QuestionType.MULTIPLE,
      options: ["Citation One MKIII", "Citation 200", "Citation 500", "Luna", "Citation Oasis MKIII"],
      correctAnswer: { indices: [0, 1, 2, 4] },
      sortOrder: 2
    },
    {
      question: "True/False: Go + Play 3 у вашому матеріалі описується як великий преміальний portable-бумбокс із масштабним звуком.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель Harman Kardon у вашому каталозі найбільше підходить для спальні як smart-будильник із Qi-зарядкою?",
      type: QuestionType.SINGLE,
      options: ["Citation 300", "Citation Oasis MKIII", "Onyx Studio 8", "Radiance 2400"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що найкраще описує позиціонування Radiance 2400 у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Компактна travel-колонка з IP67",
        "Преміальна домашня система для великої вітальні без складного ресивера",
        "Базова Bluetooth-колонка для кухні",
        "Дизайнерський нічний будильник"
      ],
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
  questions: ReturnType<typeof harmanHomeAudioFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "home-audio",
      brand: { slug: "harman" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Harman / home-audio не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Harman Kardon: лінійки, звук і логіка консультації",
      description:
        "Внутрішній конспект по Harman Kardon: дизайнерська домашня акустика, portable-серії, Citation multiroom і швидка логіка підбору під сценарій клієнта.",
      contentBlocks: harmanHomeAudioFoundationBlocks,
      durationMin: 24,
      sortOrder: 1,
      questions: harmanHomeAudioFoundationQuestions()
    },
    {
      title: "Harman Kardon: SoundSticks, Aura, Onyx, Citation та інші моделі",
      description:
        "Каталог Harman Kardon з ключовими моделями для дому, portable і smart Wi-Fi сценаріїв: позиціонування, відмінності та швидкі аргументи продажу.",
      contentBlocks: harmanHomeAudioCatalogBlocks,
      durationMin: 36,
      sortOrder: 2,
      questions: harmanHomeAudioCatalogQuestions()
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

  console.log("Harman home audio content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
